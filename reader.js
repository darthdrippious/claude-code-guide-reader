/* Guide Reader engine.
   Loads guide.json, fetches the Markdown files it lists, renders them into
   #content, then hands off to start() — the reader itself (TOC, search,
   progress, glossary, lookup menu), which works on the rendered DOM. To make a
   new guide, edit guide.json and content/; this file shouldn't need changes. */
(function(){
"use strict";
var $=function(s){return document.querySelector(s)},$$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};

function fatal(msg,hint){
  var c=$('#content'); c.innerHTML='';
  var d=document.createElement('div'); d.id='fatal';
  d.innerHTML='<h2>Couldn’t load the guide</h2><p></p><p></p>';
  d.children[1].textContent=msg; d.children[2].innerHTML=hint||'';
  c.appendChild(d);
}
var FILE_HINT='If you opened <code>index.html</code> straight from disk, browsers block loading the content files. Open it from the hosted link (GitHub Pages) or run <code>python3 -m http.server</code> in this folder and visit <code>http://localhost:8000</code>.';

function getJSON(url){
  return fetch(url,{cache:'no-cache'}).then(function(r){ if(!r.ok) throw new Error(url+' → '+r.status); return r.json(); });
}
function getText(url){
  return fetch(url,{cache:'no-cache'}).then(function(r){ if(!r.ok) throw new Error(url+' → '+r.status); return r.text(); });
}
function slug(s){
  return s.toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60).replace(/-+$/,'')||'section';
}

/* Render one Markdown file into a <div>. Image paths resolve relative to the
   Markdown file, so content/images/x.jpg is written ![caption](images/x.jpg). */
function renderFile(entry,md){
  var path=typeof entry==='string'?entry:entry.path, shift=(typeof entry==='object'&&entry.shift)||0;
  var box=document.createElement('div');
  box.innerHTML=marked.parse(md,{gfm:true});
  var base=new URL(path,document.baseURI);
  Array.prototype.slice.call(box.querySelectorAll('img')).forEach(function(img){
    var s=img.getAttribute('src')||'';
    if(!/^(?:[a-z]+:|\/\/|data:)/i.test(s)) img.setAttribute('src',new URL(s,base).href);
    img.setAttribute('loading','lazy'); img.setAttribute('decoding','async');
    var p=img.parentNode, alt=(img.getAttribute('alt')||'').trim();
    // a paragraph holding only an image becomes a figure (caption = alt text)
    if(p.tagName==='P'&&p.children.length===1&&p.textContent.trim()===''){
      var fig=document.createElement('figure');
      fig.appendChild(img);
      if(alt){ var fc=document.createElement('figcaption'); fc.textContent=alt; fig.appendChild(fc); }
      p.parentNode.replaceChild(fig,p);
    }
  });
  if(shift){
    Array.prototype.slice.call(box.querySelectorAll('h1,h2,h3,h4,h5')).reverse().forEach(function(h){
      var n=document.createElement('h'+Math.min(6,+h.tagName.charAt(1)+shift));
      n.innerHTML=h.innerHTML; h.parentNode.replaceChild(n,h);
    });
  }
  return box;
}

function boot(){
  getJSON('guide.json').then(function(cfg){
    if(!cfg.files||!cfg.files.length) throw new Error('guide.json has no "files" list.');
    document.title=cfg.title||document.title;
    if(cfg.shortTitle){
      var amb=document.querySelector('meta[name="apple-mobile-web-app-title"]');
      if(!amb){ amb=document.createElement('meta'); amb.name='apple-mobile-web-app-title'; document.head.appendChild(amb); }
      amb.content=cfg.shortTitle;
    }
    return Promise.all(cfg.files.map(function(f){ return getText(typeof f==='string'?f:f.path); })).then(function(texts){
      var content=$('#content'); content.innerHTML='';
      cfg.files.forEach(function(f,i){
        var box=renderFile(f,texts[i]);
        while(box.firstChild) content.appendChild(box.firstChild);
      });
      // stable, unique ids on headings (TOC jumps, module progress keys)
      var seen={};
      $$('#content h1,#content h2,#content h3').forEach(function(h){
        var id=slug(h.textContent), n=seen[id]=(seen[id]||0)+1;
        h.id=n>1?id+'-'+n:id;
      });
      start(cfg);
    });
  }).catch(function(err){
    fatal(String(err&&err.message||err),FILE_HINT);
  });
}

function start(cfg){
var ID=cfg.id||'guide';
var MOD_RE=new RegExp((cfg.modules&&cfg.modules.heading)||'^MODULE\\s+(\\d+)\\s*[:.—–-]\\s*(.*)$','i');
var APX_RE=new RegExp((cfg.appendices&&cfg.appendices.heading)||'^APPENDIX\\s+([A-Z])\\s*[:.—–-]\\s*(.*)$','i');
var GL_RE=cfg.glossary&&cfg.glossary.heading?new RegExp(cfg.glossary.heading,'i'):null;
$('#crumb').textContent=cfg.title||'';

/* ---------- storage (localStorage w/ in-memory fallback) ----------
   The try/catch is load-bearing, not boilerplate. Every iOS browser (Chrome
   included) runs on WebKit, and a page opened from file:// can be given an
   opaque origin where touching localStorage THROWS SecurityError rather than
   returning null. The mem tier keeps the reader fully usable in that case —
   settings just don't survive a reload, which is the spec's stated
   "best-effort, not guaranteed" posture.                                    */
var mem={};
var store={
  get:function(k){
    try{ var r=localStorage.getItem(k); if(r) return JSON.parse(r); }catch(e){}
    return mem[k]||null;
  },
  set:function(k,v){
    mem[k]=v;
    try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){}
  }
};
var K={prefs:ID+':prefs',prog:ID+':progress'};
var prefs={fs:17,lh:1.72,th:'paper',w:'35rem'};
var prog={mods:{},last:null,lastTx:''};
var saveT={};
function save(key,val){ clearTimeout(saveT[key]); saveT[key]=setTimeout(function(){store.set(key,val)},350); }

/* ---------- index the document ---------- */
var content=$('#content');
var BLOCKSEL='#content p,#content li,#content h1,#content h2,#content h3,#content h4,#content pre,#content figcaption';
var blocks=$$(BLOCKSEL);
blocks.forEach(function(b,i){ b.dataset.b=i; });

// map each block -> nearest module (h2) and part (h1)
var sections=[]; // {id,title,type,el,start,end}
(function(){
  var kids=Array.prototype.slice.call(content.children);
  var cur=null;
  kids.forEach(function(el){
    if(el.tagName==='H2'){
      cur={id:el.id,title:el.textContent,el:el,subs:[]};
      sections.push(cur);
    } else if(el.tagName==='H1'){
      cur={id:el.id,title:el.textContent,el:el,subs:[],part:true};
      sections.push(cur);
    } else if(el.tagName==='H3'&&cur){
      cur.subs.push({id:el.id,title:el.textContent});
    }
  });
})();
// tag blocks with their section id
(function(){
  var kids=Array.prototype.slice.call(content.children),curId=null,curTitle='';
  kids.forEach(function(el){
    if(el.tagName==='H1'||el.tagName==='H2'){curId=el.id;curTitle=el.textContent;}
    el.dataset.sec=curId||'';
    el.dataset.secTitle=curTitle||'';
  });
})();

/* modules = h2 starting with MODULE */
var modules=sections.filter(function(s){return !s.part&&MOD_RE.test(s.title)});
var byId={}; sections.forEach(function(s){ byId[s.id]=s; });

/* ---------- render TOC ---------- */
function renderToc(filter){
  var body=$('#tocBody'); body.innerHTML='';
  var f=(filter||'').toLowerCase().trim();
  var kids=Array.prototype.slice.call(content.children);
  var frag=document.createDocumentFragment();
  var curPart=null;
  kids.forEach(function(el){
    if(el.tagName==='H1'){
      var d=document.createElement('div'); d.className='t1'; d.textContent=el.textContent;
      d.dataset.part='1'; frag.appendChild(d); curPart=d;
    }
    if(el.tagName==='H2'){
      var isMod=MOD_RE.test(el.textContent);
      var row=document.createElement('div'); row.className='t2'; row.dataset.go=el.id;
      var mm=el.textContent.match(MOD_RE),num=mm?[0,mm[1]]:null;
      var am=el.textContent.match(APX_RE),label=mm?mm[2]:(am?am[1]+' · '+am[2]:el.textContent);
      if(f&&label.toLowerCase().indexOf(f)<0&&el.textContent.toLowerCase().indexOf(f)<0) return;
      var chk='';
      if(isMod){
        var on=prog.mods[el.id]?' on':'';
        chk='<span class="chk'+on+'" data-chk="'+el.id+'"><svg viewBox="0 0 24 24"><path d="M4 12l6 6L20 6"/></svg></span>';
      }
      row.innerHTML=chk+(num?'<span class="num">'+num[1]+'</span>':'')+'<span class="tx">'+label+'</span>';
      frag.appendChild(row);
      /* Sub-sections render for every module but stay hidden; markCurrentToc
         reveals only the one you're reading. All 100+ H3s at once would bury
         the module list in both the drawer and the sidebar. */
      if(!f){
        var sec=byId[el.id];
        if(sec) sec.subs.forEach(function(s){
          var sr=document.createElement('div');
          sr.className='t3'; sr.dataset.go=s.id; sr.dataset.sub=el.id; sr.hidden=true;
          sr.textContent=s.title.replace(/^(\d+\.\d+)\s*—\s*/,'$1  ');
          frag.appendChild(sr);
        });
      }
    }
  });
  body.appendChild(frag);
  markCurrentToc();
}
$('#tocBody').addEventListener('click',function(e){
  var c=e.target.closest('[data-chk]');
  if(c){ e.stopPropagation(); var id=c.dataset.chk; prog.mods[id]=!prog.mods[id];
    c.classList.toggle('on'); save(K.prog,prog); syncModBtns(); return; }
  var g=e.target.closest('[data-go]');
  if(g){ close(); jumpTo(g.dataset.go); }
});
$('#tocFilter').addEventListener('input',function(e){renderToc(e.target.value)});

function markCurrentToc(){
  var id=currentSectionId();
  $$('#tocBody .t2').forEach(function(r){ r.classList.toggle('cur',r.dataset.go===id) });
  $$('#tocBody .t3').forEach(function(r){ r.hidden=r.dataset.sub!==id });
}

/* ---------- module footers ---------- */
(function(){
  modules.forEach(function(m,i){
    var el=m.el.nextElementSibling, last=m.el;
    while(el&&el.tagName!=='H2'&&el.tagName!=='H1'){ last=el; el=el.nextElementSibling; }
    var f=document.createElement('div'); f.className='modfoot ui';
    f.innerHTML='<button data-done="'+m.id+'">Mark complete</button>'+
      (modules[i+1]?'<button data-next="'+modules[i+1].id+'">Next module →</button>':'');
    last.parentNode.insertBefore(f,last.nextSibling);
  });
  content.addEventListener('click',function(e){
    var d=e.target.closest('[data-done]');
    if(d){ var id=d.dataset.done; prog.mods[id]=!prog.mods[id]; save(K.prog,prog); syncModBtns(); renderToc($('#tocFilter').value); return; }
    var n=e.target.closest('[data-next]');
    if(n){ jumpTo(n.dataset.next); }
  });
})();
function syncModBtns(){
  $$('[data-done]').forEach(function(b){
    var on=!!prog.mods[b.dataset.done];
    b.classList.toggle('done',on);
    b.textContent=on?'✓ Completed':'Mark complete';
  });
  var n=modules.filter(function(m){return prog.mods[m.id]}).length;
  var mc=$('#modCount'); if(mc) mc.textContent=n+' of '+modules.length+' done';
}

/* ---------- code copy buttons ---------- */
$$('#content pre').forEach(function(pre){
  var b=document.createElement('button'); b.className='copyBtn ui'; b.textContent='Copy';
  b.addEventListener('click',function(){
    var t=pre.querySelector('code')?pre.querySelector('code').textContent:pre.textContent;
    navigator.clipboard&&navigator.clipboard.writeText(t);
    b.textContent='Copied'; setTimeout(function(){b.textContent='Copy'},1400);
  });
  pre.appendChild(b);
});

/* ---------- panels ---------- */
var openPanel=null;
function open(sel){
  if(openPanel)openPanel.classList.remove('on');
  openPanel=$(sel); openPanel.classList.add('on'); $('#scrim').classList.add('on');
}
function close(){ if(openPanel)openPanel.classList.remove('on'); openPanel=null; $('#scrim').classList.remove('on'); }
$('#scrim').addEventListener('click',close);
$$('[data-close]').forEach(function(b){b.addEventListener('click',close)});
$('#bToc').addEventListener('click',function(){renderToc($('#tocFilter').value);open('#toc')});
$('#bAa').addEventListener('click',function(){open('#pSet')});
$('#bSearch').addEventListener('click',function(){open('#pSearch');setTimeout(function(){$('#qInput').focus()},280)});
$('#bGloss').addEventListener('click',function(){renderGloss($('#gInput').value);open('#pGloss')});

/* ---------- display prefs ---------- */
function applyPrefs(){
  document.documentElement.style.setProperty('--fs',prefs.fs+'px');
  document.documentElement.style.setProperty('--lh',prefs.lh);
  document.documentElement.style.setProperty('--measure',prefs.w);
  document.documentElement.setAttribute('data-theme',prefs.th);
  $$('#segFs button').forEach(function(b){b.classList.toggle('on',+b.dataset.fs===prefs.fs)});
  $$('#segLh button').forEach(function(b){b.classList.toggle('on',+b.dataset.lh===prefs.lh)});
  $$('#segTh button').forEach(function(b){b.classList.toggle('on',b.dataset.th===prefs.th)});
  $$('#segW button').forEach(function(b){b.classList.toggle('on',b.dataset.w===prefs.w)});
}
$('#segFs').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;prefs.fs=+b.dataset.fs;applyPrefs();save(K.prefs,prefs)});
$('#segLh').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;prefs.lh=+b.dataset.lh;applyPrefs();save(K.prefs,prefs)});
$('#segTh').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;prefs.th=b.dataset.th;applyPrefs();save(K.prefs,prefs)});
$('#segW').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;prefs.w=b.dataset.w;applyPrefs();save(K.prefs,prefs)});

/* ---------- scroll: progress, crumb, bookmark ---------- */
function currentSectionId(){
  var y=window.scrollY+80,id=null;
  for(var i=0;i<blocks.length;i++){
    if(blocks[i].offsetTop<=y) id=blocks[i].dataset.sec; else break;
  }
  return id;
}
var tick=false,lastTocId=null;
window.addEventListener('scroll',function(){
  if(tick)return; tick=true;
  requestAnimationFrame(function(){
    tick=false;
    var h=document.documentElement.scrollHeight-window.innerHeight;
    $('#pfill').style.width=(h>0?Math.min(100,window.scrollY/h*100):0)+'%';
    var id=currentSectionId();
    if(id){
      var el=document.getElementById(id);
      if(el){
        var cm=el.textContent.match(MOD_RE),t=cm?'M'+cm[1]+' · '+cm[2]:el.textContent;
        $('#crumb').textContent=t;
      }
      if(id!==lastTocId){ lastTocId=id; markCurrentToc(); }
    }
    // bookmark furthest-ish: store nearest block to viewport top
    var top=window.scrollY+90,bi=0;
    for(var i=0;i<blocks.length;i++){ if(blocks[i].offsetTop<=top) bi=i; else break; }
    if(prog.last!==bi){
      prog.last=bi;
      prog.lastTx=(blocks[bi].dataset.secTitle||'').slice(0,60);
      save(K.prog,prog);
    }
  });
},{passive:true});

function jumpTo(id){
  var el=document.getElementById(id); if(!el)return;
  var y=el.getBoundingClientRect().top+window.scrollY-64;
  window.scrollTo({top:y,behavior:'smooth'});
}
function jumpBlock(i,flash){
  var b=blocks[i]; if(!b)return;
  var y=b.getBoundingClientRect().top+window.scrollY-64;
  window.scrollTo({top:y,behavior:'smooth'});
  if(flash){ b.classList.add('flash'); setTimeout(function(){b.classList.remove('flash')},1700); }
}

/* ---------- search ---------- */
var idx=blocks.map(function(b,i){
  return {i:i,t:b.textContent,l:b.textContent.toLowerCase(),s:b.dataset.secTitle||''};
}).filter(function(r){return r.t.length>24});
function esc(s){return s.replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
$('#qInput').addEventListener('input',function(e){
  var q=e.target.value.toLowerCase().trim(),body=$('#qBody');
  if(q.length<2){body.innerHTML='<div class="empty">Type at least two letters.</div>';return}
  var out=[];
  for(var k=0;k<idx.length&&out.length<60;k++){
    var p=idx[k].l.indexOf(q); if(p<0)continue;
    var st=Math.max(0,p-45),en=p+q.length+90;
    var tx=idx[k].t.slice(st,en);
    var tail=en<idx[k].t.length?'…':'';
    out.push('<button class="res" data-i="'+idx[k].i+'"><div class="rh">'+esc(idx[k].s.slice(0,52))+'</div><div class="rt">'+
      (st>0?'…':'')+esc(tx.slice(0,p-st))+'<b>'+esc(tx.substr(p-st,q.length))+'</b>'+esc(tx.slice(p-st+q.length))+tail+'</div></button>');
  }
  body.innerHTML=out.length?out.join(''):'<div class="empty">No matches.</div>';
});
$('#qBody').addEventListener('click',function(e){
  var r=e.target.closest('[data-i]'); if(!r)return;
  close(); setTimeout(function(){jumpBlock(+r.dataset.i,true)},240);
});

/* ---------- glossary ---------- */
var glossary=[];
var glossarySecIds={};  // set of section IDs that belong to the inline glossary
(function(){
  var gl=GL_RE?$$('#content h2').filter(function(h){return GL_RE.test(h.textContent)}):[];
  gl.forEach(function(h){
    glossarySecIds[h.id]=1;
    var el=h.nextElementSibling;
    while(el&&el.tagName!=='H2'&&el.tagName!=='H1'){
      if(el.tagName==='UL'){
        Array.prototype.slice.call(el.children).forEach(function(li){
          var s=li.querySelector('strong'); if(!s)return;
          var term=s.textContent.trim();
          var def=li.textContent.slice(li.textContent.indexOf(term)+term.length).replace(/^\s*[—-]\s*/,'');
          glossary.push({t:term,d:def,b:+li.dataset.b});
        });
      }
      el=el.nextElementSibling;
    }
  });
})();
function renderGloss(q){
  q=(q||'').toLowerCase().trim();
  var list=glossary.filter(function(g){return !q||g.t.toLowerCase().indexOf(q)>=0||g.d.toLowerCase().indexOf(q)>=0});
  $('#gBody').innerHTML=list.length?list.map(function(g){
    return '<dl class="gitem"><dt>'+esc(g.t)+'</dt><dd>'+esc(g.d)+'</dd></dl>';
  }).join(''):'<div class="empty">No term found.</div>';
}
$('#gInput').addEventListener('input',function(e){renderGloss(e.target.value)});
if(!glossary.length) $('#bGloss').style.display='none';

/* ---------- inline glossary tooltips ---------- */

/* Display terms aren't literal match targets. "API (Application Programming
   Interface)" should match both forms; "Array / list" is two aliases; but the
   parenthetical in "Environment (dev vs production)" is a qualifier, not a name. */
function aliasesFor(term){
  var out=[],base=term;
  var paren=term.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if(paren){
    base=paren[1].trim();
    var inner=paren[2].trim().replace(/^["“']|["”']$/g,'');
    if(!/\bvs\b/i.test(inner)) out.push(inner);   // expansion or short form, not a qualifier
  }
  base.split(/\s*\/\s*/).forEach(function(a){ a=a.trim(); if(a) out.push(a); });
  return out.filter(function(a,i,arr){ return a&&arr.indexOf(a)===i; });
}

/* ===================================================================
   MATCH POLICY — the one real judgement call in this file.
   The glossary defines ordinary English words in their technical sense, so
   annotating every occurrence would underline hundreds of words across 17,000.
   Three levers, tune freely:
     GT_MIN_LEN  raise to annotate fewer, longer terms (4 drops CI/IDE/npm/TUI)
     GT_DENY     aliases that are too common in their ordinary English sense
     GT_SCOPE    'module'   = first occurrence per module   (a reminder per module)
                 'document' = first occurrence overall      (near-silent after Module 0)
   =================================================================== */
var GT_MIN_LEN = 4;
var GT_DENY    = ['list','state','loop','object'];
var GT_SCOPE   = 'module';

function annotateGlossary(){
  var aliases=[],byAlias={};
  glossary.forEach(function(g){
    aliasesFor(g.t).forEach(function(a){
      if(a.length<GT_MIN_LEN) return;
      if(GT_DENY.indexOf(a.toLowerCase())>=0) return;
      aliases.push(a); byAlias[a.toLowerCase()]=g.t;
    });
  });
  if(!aliases.length) return;
  /* longest first, so "Continuous Integration" is claimed before "Integration" */
  aliases.sort(function(x,y){ return y.length-x.length; });
  var re=new RegExp('\\b('+aliases.map(function(a){
    return a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  }).join('|')+')\\b','gi');

  var walker=document.createTreeWalker(content,NodeFilter.SHOW_TEXT,{
    acceptNode:function(n){
      if(!n.nodeValue||!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      /* never annotate code, headings, links, or the module footer buttons */
      return n.parentNode.closest('pre,code,h1,h2,h3,h4,a,.gt,.modfoot')
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  var nodes=[],n; while((n=walker.nextNode())) nodes.push(n);

  var seen={};
  nodes.forEach(function(node){
    /* skip the inline glossary section — it already defines the terms */
    var holder=node.parentNode.closest('[data-sec]');
    if(holder && glossarySecIds[holder.dataset.sec]) return;
    var scope=GT_SCOPE==='document'?'*':((holder&&holder.dataset.sec)||'*');
    var text=node.nodeValue,frag=null,last=0,m;
    re.lastIndex=0;
    while((m=re.exec(text))){
      var key=scope+'|'+m[1].toLowerCase();
      if(seen[key]) continue;
      seen[key]=1;
      if(!frag) frag=document.createDocumentFragment();
      if(m.index>last) frag.appendChild(document.createTextNode(text.slice(last,m.index)));
      var sp=document.createElement('span');
      sp.className='gt'; sp.tabIndex=0; sp.setAttribute('role','button');
      sp.dataset.term=byAlias[m[1].toLowerCase()]||m[1];
      sp.textContent=m[1];
      frag.appendChild(sp);
      last=m.index+m[1].length;
    }
    if(frag){
      if(last<text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag,node);
    }
  });
}

var gtip=$('#gtip');
function hideTip(){
  gtip.classList.remove('on');
  $$('#content .gt.on').forEach(function(e){ e.classList.remove('on'); });
}
function showTip(el){
  var g=glossary.filter(function(x){return x.t===el.dataset.term})[0];
  if(!g) return;
  hideTip(); el.classList.add('on');
  gtip.innerHTML='<div class="gt-t">'+esc(g.t)+'</div><div class="gt-d">'+esc(g.d)+
    '</div><div class="gt-m" data-gfull>Open full glossary →</div>';
  gtip.classList.add('on');
  /* clamp against clientWidth, not innerWidth — the latter counts the
     scrollbar, which is how a "clamped" popup still overhangs the edge */
  var r=el.getBoundingClientRect(),w=gtip.offsetWidth,h=gtip.offsetHeight;
  var vw=document.documentElement.clientWidth;
  gtip.style.left=Math.max(8,Math.min(r.left+r.width/2-w/2,vw-w-8))+'px';
  var y=r.top+window.scrollY-h-9;
  gtip.style.top=(y<window.scrollY+56?r.bottom+window.scrollY+9:y)+'px';
}
content.addEventListener('click',function(e){
  var t=e.target.closest('.gt');
  if(t){ e.stopPropagation(); showTip(t); }
});
content.addEventListener('keydown',function(e){
  if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('gt')){
    e.preventDefault(); showTip(e.target);
  }
});
gtip.addEventListener('click',function(e){
  if(e.target.closest('[data-gfull]')){ hideTip(); renderGloss($('#gInput').value); open('#pGloss'); }
});
document.addEventListener('click',function(e){
  if(!e.target.closest('.gt')&&!e.target.closest('#gtip')) hideTip();
});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){ hideTip(); hideTb(); }
});

/* ---------- text-selection lookup ---------- */
var seltb=$('#seltb'),pending=null;
function hideTb(){ seltb.classList.remove('on'); }
document.addEventListener('selectionchange',function(){
  var s=window.getSelection();
  if(!s||s.isCollapsed||!s.rangeCount){ hideTb(); pending=null; }
});
['mouseup','touchend'].forEach(function(ev){
  document.addEventListener(ev,function(){
    setTimeout(function(){
      var s=window.getSelection();
      if(!s||s.isCollapsed||!s.rangeCount){hideTb();return}
      var r=s.getRangeAt(0);
      if(!content.contains(r.commonAncestorContainer)&&r.commonAncestorContainer!==content){hideTb();return}
      if(!r.toString().trim()){hideTb();return}
      pending=r.cloneRange();
      var rect=r.getBoundingClientRect();
      seltb.classList.add('on');
      var w=seltb.offsetWidth||210,vw=document.documentElement.clientWidth;
      var x=Math.max(8,Math.min(rect.left+rect.width/2-w/2,vw-w-8));
      var y=rect.top+window.scrollY-seltb.offsetHeight-10;
      if(y<window.scrollY+56) y=rect.bottom+window.scrollY+10;
      seltb.style.left=x+'px'; seltb.style.top=y+'px';
    },10);
  },{passive:true});
});
/* Keep the text selection alive when the toolbar is pressed — without this,
   mousedown inside the toolbar collapses the selection before the click lands. */
seltb.addEventListener('mousedown',function(e){ e.preventDefault(); });

/* Expand a selection out to its containing sentence so an AI lookup has enough
   context to disambiguate a bare phrase. */
function sentenceAround(r){
  if(!r) return '';
  var node=r.startContainer;
  while(node&&node.nodeType!==1) node=node.parentNode;
  var block=node&&node.closest?node.closest('#content p,#content li,#content blockquote,#content h1,#content h2,#content h3,#content h4'):null;
  if(!block) return '';
  var full=block.textContent.replace(/\s+/g,' ').trim();
  var pick=r.toString().replace(/\s+/g,' ').trim();
  var at=full.indexOf(pick);
  if(at<0) return '';
  var s=at,e=at+pick.length;
  while(s>0&&!/[.!?]/.test(full.charAt(s-1))) s--;
  while(e<full.length&&!/[.!?]/.test(full.charAt(e))) e++;
  return full.slice(s,Math.min(e+1,full.length)).trim();
}
function aiPrompt(sel,ctx){
  var p='Explain "'+sel+'" in plain language, for '+(cfg.lookupAudience||'someone learning this subject')+'.';
  if(ctx&&ctx!==sel) p+='\n\nIt appeared in this sentence: "'+ctx+'"';
  return p.length>1000?p.slice(0,1000):p;
}
var LOOKUP={
  google:function(sel){ return 'https://www.google.com/search?q='+encodeURIComponent(sel); },
  claude:function(sel,ctx){ return 'https://claude.ai/new?q='+encodeURIComponent(aiPrompt(sel,ctx)); },
  plx:function(sel,ctx){ return 'https://www.perplexity.ai/search?q='+encodeURIComponent(aiPrompt(sel,ctx)); }
};
seltb.addEventListener('click',function(e){
  var b=e.target.closest('[data-lk]'); if(!b)return;
  var sel=pending?pending.toString().replace(/\s+/g,' ').trim():'';
  if(!sel){ hideTb(); return; }
  if(b.dataset.lk==='copy'){
    if(navigator.clipboard) navigator.clipboard.writeText(sel);
    b.textContent='Copied';
    setTimeout(function(){ hideTb(); pending=null; window.getSelection().removeAllRanges(); },1200);
    return;
  }
  /* Opened synchronously inside the click handler on purpose: deferring this
     behind any async work gets the new tab killed by the iOS popup blocker. */
  window.open(LOOKUP[b.dataset.lk](sel,sentenceAround(pending)),'_blank','noopener');
  hideTb(); pending=null;
});

/* ---------- resume ---------- */
function hideResume(){ $('#resume').classList.remove('on'); }
$('#resumeGo').addEventListener('click',function(){ hideResume(); jumpBlock(prog.last,true); });
$('#resumeX').addEventListener('click',hideResume);
setTimeout(hideResume,14000);

/* ---------- boot ---------- */
(function(){
  var p=store.get(K.prefs); if(p)prefs=Object.assign(prefs,p);
  var g=store.get(K.prog);  if(g)prog=Object.assign(prog,g);
  applyPrefs(); annotateGlossary(); syncModBtns(); renderToc(''); renderGloss('');
  if(prog.last&&prog.last>15){
    $('#resumeTx').textContent=prog.lastTx||('Block '+prog.last);
    $('#resume').classList.add('on');
  }
})();

/* ---------- image lightbox (tap an image to view it full-screen) ---------- */
(function(){
  var lb=$('#lightbox'),li=lb.querySelector('img');
  content.addEventListener('click',function(e){
    var im=e.target.closest('img'); if(!im)return;
    li.src=im.currentSrc||im.src; li.alt=im.alt; lb.classList.add('on');
  });
  lb.addEventListener('click',function(){ lb.classList.remove('on'); li.removeAttribute('src'); });
})();
}

boot();
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){
  window.addEventListener('load',function(){ navigator.serviceWorker.register('./sw.js').catch(function(){}); });
}
})();
