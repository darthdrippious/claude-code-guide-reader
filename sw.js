/* Offline cache. Generic: it precaches the app shell plus whatever guide.json
   lists, and caches everything else (images) the first time it's viewed.
   Same-origin GETs are served from cache and refreshed in the background, so
   edits to the content show up on the next reload. Bump CACHE_NAME only if the
   shell's own file list changes. */
const CACHE_NAME = 'guide-reader-v1';
const SHELL = [
  './', './index.html', './reader.css', './reader.js',
  './vendor/marked.umd.js', './guide.json', './manifest.webmanifest',
  './icon.svg', './icon-192.png', './icon-512.png', './apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(SHELL);
    try {
      const cfg = await (await fetch('./guide.json', { cache: 'no-cache' })).json();
      await cache.addAll(cfg.files.map(f => typeof f === 'string' ? f : f.path));
    } catch (e) { /* content gets cached on first read instead */ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req, { ignoreSearch: true });
    const refresh = fetch(req).then(res => {
      if (res && res.status === 200) cache.put(req, res.clone());
      return res;
    }).catch(() => null);
    if (cached) { refresh.catch(() => {}); return cached; }
    const res = await refresh;
    if (res) return res;
    if (req.mode === 'navigate') return cache.match('./index.html');
    return Response.error();
  })());
});
