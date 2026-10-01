# AGENTS.md — Codex HTML Reader project

This is an interactive HTML reader for a personal self-study guide ("Codex for Non-Coders"). It's a portable document, not an app.

## Hard constraints (don't drift from these across sessions)

- **Static site, no build step.** The engine (`index.html`, `reader.css`, `reader.js`, `sw.js`, `vendor/marked.umd.js`) is separate from the content (`guide.json` + Markdown files in `content/`, images alongside). Nothing to install or compile; it just needs to be *served* (GitHub Pages, or `python3 -m http.server` locally) because it `fetch()`es the Markdown. Opening `index.html` straight from disk shows an explanatory error. Don't add a bundler or framework.
- **No backend, no API keys embedded anywhere in the file.** Its JavaScript is fully visible to anyone who opens it — never add a live call to an AI API from inside the page. If AI lookup is wanted, it's an external link to the tool's own web app, not an in-page integration.
- **No `window.storage`.** That's a Codex.ai-artifact-only API and doesn't exist here. Use `localStorage`, and treat everything stored in it as best-effort, not guaranteed — see below.
- **Target platforms: Chrome on iPhone, Chrome on laptop.** These are the only two real contexts this needs to work well on. Note that iOS requires all browsers, Chrome included, to run on Apple's WebKit engine — don't assume Chrome-on-iOS behaves like Chrome-on-desktop.
- **No cross-device sync, and that's fine.** Phone and laptop each have their own local storage; there's no account system. Don't add a backend to solve this.
- **Persistence is low-priority.** Progress tracking and any lightweight highlight/export feature are nice-to-haves. Don't let them drive architectural complexity.

## Source content

The guide lives in `content/*.md`, listed in order in `guide.json`. Edit those files; don't hand-write HTML. To reuse the reader for a different guide, follow `README.md`. The engine is guide-agnostic: guide-specific settings (title, storage id, module/glossary heading patterns) belong in `guide.json`, not in `reader.js`.

## Where to look for the original ask

`Codex Build Spec - HTML Reader.md` in this folder has the full feature list and priority tiers from the original build request. Re-read it if picking this project back up after a gap.
