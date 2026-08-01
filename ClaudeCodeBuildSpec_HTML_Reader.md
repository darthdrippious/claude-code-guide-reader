# Build Spec: Interactive HTML Reader for "Claude Code for Non-Coders"

## What this is

A standalone, downloadable HTML file — not a Claude.ai artifact — that turns a long markdown guide into a readable, navigable, phone-and-laptop-friendly document. Think "e-reader for my own textbook," not a web app with a backend.

**Source content:** the guide is `Claude Code for Non-Coders - Guide & Course.md` (~17,000 words, 13 numbered modules under Parts I–V, plus lettered appendices and a two-part glossary of ~55 defined terms). Provide this file to the session; it should be converted from markdown into the HTML document, not rewritten by hand.

**Platforms:** primarily an iPhone (Chrome), secondarily a laptop (Chrome). Must work well and look intentional on both — this isn't "mobile-first with desktop as an afterthought," it's two real, regularly-used contexts.

**Architecture constraint:** single HTML file (inline CSS/JS is fine, or a couple of adjacent files if that's cleaner — but no build step, no server, no framework install required to just open it). No `window.storage` (that's Claude-artifact-only) — use `localStorage` where persistence is used at all, and treat all persistence as best-effort, not guaranteed. One nuance worth knowing: Apple requires every browser on iOS — Chrome included — to run on Apple's own WebKit engine (a current App Store policy, not a Chrome limitation), so opening this file directly on the iPhone rather than from a real web address may hit the same storage-reliability quirks usually associated with Safari specifically. Worth testing directly rather than assuming Chrome sidesteps it; either way, nothing here is critical enough to be worth engineering around (see "Explicitly cut" below).

There is a working prior version of this reader (built as a Claude.ai artifact) that nailed the reading experience and layout — reuse its editorial book-like feel (serif reading type, generous measure, sticky minimal top bar, bottom-sheet panels for settings/TOC/search) as a starting aesthetic reference if it's available in the session; the layout and typography approach don't need to be reinvented, just re-implemented without the artifact-only storage API.

---

## Priority 1 — Must have

- **Interactive table of contents.** Collapsible/drawer-style, auto-generated from the document's headings (Parts → Modules → sub-sections), lets you jump straight to any section. Should work as a slide-out panel on mobile and could sit as a persistent sidebar on wider/laptop screens.
- **Adjustable display settings.** Font size (a handful of fixed steps, not a slider — easier to hit precisely on a touchscreen), line spacing, a light/dark/sepia theme toggle, and content width/measure. Should persist between visits if possible (localStorage), but isn't critical if it doesn't survive a cache clear.
- **Bookmark / resume position.** Track roughly where you are in the document and offer a "resume where you left off" prompt on return. Best-effort via localStorage — per-device only, and see the architecture note above on iOS storage reliability.
- **Search.** Full-text search across the whole document with enough surrounding context in each result to know if it's the right hit before jumping to it.
- **Copy buttons on code blocks.** One-click copy for every fenced code block / command snippet — this matters specifically for the laptop use case (reading the guide on one screen, a Claude Code session open on another).
- **Inline glossary tooltips.** The guide has its own ~55-term glossary. Any recognized glossary term appearing in the body text should be tappable/clickable to show its definition in a small popup, without navigating away from where you're reading. This should be built by matching against the glossary's own term list (parsed from the document), not a general dictionary.
- **Text-selection lookup menu.** Select any word or phrase in the body and get a small popup with:
  - **"Search Google"** — opens a Google search for the selected text in a new tab. Simple, no dependencies, should just work.
  - **"Ask ChatGPT"** (or similar) — opens the AI tool's web app in a new tab with the selected text (plus a bit of surrounding sentence for context) pre-filled into the query, if a reliable URL-based prefill mechanism exists for that tool. Verify the current URL scheme at build time rather than assuming one — these change. If no reliable prefill exists, fall back to simply opening a new chat with that tool, unprefilled, rather than failing silently.
  - **Do not** attempt a live in-page API call to an AI service to show an answer inline. A static HTML file's JavaScript is fully visible to anyone who opens it, so there's no safe way to embed an API key in it — a real integration would need a backend proxy to hold the key, which turns this from a single downloadable file into a hosted service. Out of scope for this build.

*Rationale for having both the glossary tooltip and the external lookup:* the tooltip instantly covers terms already defined in this specific guide (e.g. "state," "CI"); the external lookup covers everything else the guide mentions in passing but doesn't define (e.g. a specific tool name like CircleCI). They're complementary, not redundant — don't drop either one thinking the other covers it.

---

## Priority 2 — Nice to have, low priority

- **Progress tracking.** A simple "mark this module complete" control and an X-of-13 counter. Best-effort via localStorage. Genuinely optional — don't let this drive any architectural decisions or add real complexity. Fine if it's basic.
- **Lightweight highlight + markdown export.** The ability to select and mark a passage (a single simple highlight, not necessarily multi-color or requiring an attached note) and later export whatever's been marked as a markdown file. This is now secondary to the lookup features above — the original motivation (save something to research later) is mostly handled by being able to research it immediately via the lookup menu — but export-as-markdown is cheap to keep if a highlight mechanism exists anyway, since it plugs into a "second brain" / notes-file habit.

---

## Explicitly cut / not needed

- **No persistent note-writing UI** (a text box attached to each highlight, a notes-review panel, etc.). This was in the original build; it's being replaced by the instant-lookup features above, which solve the actual underlying need (understanding an unfamiliar term or concept in the moment) more directly than "flag it and come back later" did.
- **No cross-device sync.** Phone and laptop will each have their own local storage; there's no account system or backend here, so progress/highlights made on one won't appear on the other. Not worth solving for this project — would require a real backend.
- **No live AI API integration inside the page.** See Priority 1 above — security and scope reasons.
- **No dependency on Claude.ai's artifact storage API** (`window.storage`) — this is a standalone file, not an artifact.

---

## Open question to resolve during the build

Whether ChatGPT (or another AI tool) currently supports a reliable URL parameter for pre-filling a new chat's input. This should be tested directly rather than assumed; if it doesn't hold up, the plain "open a new chat" fallback is a perfectly fine outcome for that button.
