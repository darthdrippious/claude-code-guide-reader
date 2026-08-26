# AGENTS.md — Codex HTML Reader project

This is an interactive HTML reader for a personal self-study guide ("Codex for Non-Coders"). It's a portable document, not an app.

## Hard constraints (don't drift from these across sessions)

- **Single, standalone HTML file.** No build step, no server, no framework install to run it. A couple of adjacent files is fine if genuinely cleaner, but the whole point is "double-click it and it works."
- **No backend, no API keys embedded anywhere in the file.** Its JavaScript is fully visible to anyone who opens it — never add a live call to an AI API from inside the page. If AI lookup is wanted, it's an external link to the tool's own web app, not an in-page integration.
- **No `window.storage`.** That's a Codex.ai-artifact-only API and doesn't exist here. Use `localStorage`, and treat everything stored in it as best-effort, not guaranteed — see below.
- **Target platforms: Chrome on iPhone, Chrome on laptop.** These are the only two real contexts this needs to work well on. Note that iOS requires all browsers, Chrome included, to run on Apple's WebKit engine — don't assume Chrome-on-iOS behaves like Chrome-on-desktop.
- **No cross-device sync, and that's fine.** Phone and laptop each have their own local storage; there's no account system. Don't add a backend to solve this.
- **Persistence is low-priority.** Progress tracking and any lightweight highlight/export feature are nice-to-haves. Don't let them drive architectural complexity.

## Source content

The guide itself lives in `Codex for Non-Coders - Guide & Course.md` in this folder — convert from that, don't rewrite the content by hand.

## Where to look for the original ask

`Codex Build Spec - HTML Reader.md` in this folder has the full feature list and priority tiers from the original build request. Re-read it if picking this project back up after a gap.
