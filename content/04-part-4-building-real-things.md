# PART IV — BUILDING REAL THINGS

## MODULE 6: PLANNING A PROJECT FROM SCRATCH

With Module 0's web and architecture fundamentals, you can now plan a build sensibly instead of hoping. This is also where your "plan in chat, build in Code" workflow (Module 1.3) lands.

### 6.1 — Write a spec first

A **spec** is a short, plain-language document — written before any code — that says what a change should do. It pins down what the agent would otherwise guess. The most useful specs name the files and interfaces involved, state what's *out* of scope, and end with an end-to-end verification step that proves the feature works. The recommended approach: start a minimal prompt, have Claude interview you (using the AskUserQuestion tool), write `SPEC.md`, then start a fresh session to execute it — clean context focused entirely on implementation. (This is the formal version of your chat→Code handoff.)

### 6.2 — Architecture in plain language

**Architecture** is the high-level design: what the major pieces are, how they connect, where data flows, and the technology choices (Module 0.3–0.4 gave you the vocabulary). You don't design it alone — ask Claude, in plan mode, to "propose concrete file structures, API contracts, and data models, and explain the tradeoffs of two approaches." A clear plain-English rationale is a green light; vagueness is a cue to push back.

### 6.3 — The "Explore → Plan → Code → Commit" loop (one instance of Module 0.5's lifecycle)

1. **Explore** (plan mode): "read /src/auth and explain how we handle sessions and login" — no changes yet.
2. **Plan:** "create a detailed implementation plan." Press Ctrl+G to edit it.
3. **Implement** (default mode): let Claude code, verifying against the plan; write and run tests; fix failures.
4. **Commit:** "commit with a descriptive message and open a PR."

Tie this to `/goal`, which sets a measurable finish line the agent works toward with a live progress overlay. Use a normal Plan-Mode session for everyday work; reserve `ultracode`/dynamic workflows for genuinely large builds, with the cost caveat from Module 5.5.

### 6.4 — Break work into vertical slices

Community best practice: make a phase-wise, gated plan where each phase has its own tests, and break the work into **vertical slices** ("tracer bullets") that cross every layer (database + logic + UI) rather than building one whole layer at a time. AI defaults to horizontal phasing, which delays the moment you can see the thing actually work end-to-end. A thin slice that runs beats a broad slice that doesn't (Module 0.5).

### 6.5 — Spec-driven frameworks (optional, for bigger builds)

If you want more structure, open-source frameworks run inside Claude Code, light to heavy: **Superpowers**, **GitHub Spec Kit** (`/speckit.specify`, `/speckit.plan`), and **BMAD-METHOD**. Honest limits: Spec Kit shines for building from scratch but is overkill for a one-line fix, and Claude Code doesn't provide native drift detection or guaranteed spec compliance — humans still verify outcomes.

### 6.6 — A balanced non-coder case study

**Focused Chaos** (a self-described non-developer shipping a production SaaS) offers the honest lessons worth internalizing: expect to spend 20–30% of your time improving your *workflow*, not building your product; keep a `SESSION_NOTES` external-memory file; and adopt a hard "never ship to production automatically" rule. Treat self-reported "built it in 15 minutes" claims elsewhere as illustrative, not benchmarks.

> **Milestone — Module 6:** Start Ladder 2 the right way — in chat, have Claude interview you and write SPEC.md for the file-organizer, including what's *out* of scope and the end-to-end verification step. Don't build yet. **You should now be able to:** write a spec, ask for two architecture options with tradeoffs, and slice work vertically.

## MODULE 7: DEBUGGING AND TESTING (closing the loop)

This module operationalizes Module 0.7. The core idea is the most important practice in the entire course.

### 7.1 — What bugs, debugging, and testing are

A **bug** is a mistake that makes a program behave wrong or crash. **Debugging** is finding and fixing *why* it breaks. A **test** is code that checks other code does what it should; **automated tests** run on command and report pass/fail. Tests give Claude a concrete "definition of done" it can verify itself, instead of guessing when work "looks done."

### 7.2 — Give Claude a way to verify its own work (the single most important idea)

Official: "Claude stops when the work looks done. Without a check it can run, 'looks done' is the only signal available, and you become the verification loop… Give Claude something that produces a pass or fail, and the loop closes on its own." The check can be a test suite, a build exit code, a linter, a script that diffs output against a fixture, or a browser screenshot compared to a design. Tell Claude to **show evidence rather than asserting success.** Boris Cherny, who created Claude Code, calls this his single most important tip: he says giving Claude a way to verify its own work can roughly 2–3× the quality of the result, and he has Claude test every change he ships to claude.ai/code in a real browser before it lands. (More on the insider practices in Module 12.)

> **For a non-coder, this is the whole game.** You may not read every line, but you can insist on a check you understand: does the test pass, does the page match the screenshot, does the script produce the right file? That's how you verify without coding (and it's why Module 0.2 literacy + a runnable check together close the loop). Opus 4.8 is reportedly far less likely than its predecessor to let flaws in its own code pass unremarked and "tells you what it's unsure of" — helpful, but it does **not** remove your need to verify.

### 7.3 — The iterative debugging loop

Don't *describe* the error — **paste it**, and better, give Claude the command to reproduce it so it can run the failure and verify its own fix. Official before/after: not "the build is failing" but "the build fails with this error: [paste]. fix it and verify the build succeeds. address the root cause, don't suppress the error." Start a fresh session dedicated to the bug, describe the symptom (not your theory — Module 0.7), and let Claude trace the code.

### 7.4 — Test-Driven Development (write tests, then code to pass them)

The TDD loop: write a failing test → write the minimum code to pass → refactor. A sample prompt sequence: (1) "write failing tests; don't implement the class yet." (2) "run the tests and confirm they all fail." (3) "now implement to make all tests pass. **Don't modify the tests.**" (4) "refactor without changing any tests." That "don't modify the tests" instruction is crucial — otherwise Claude may weaken the tests to pass them. The official Writer/Reviewer pattern: have one Claude write tests and another write the code, since a fresh-context reviewer won't be biased toward code it just wrote.

### 7.5 — Verify with screenshots and the browser

Official: "[paste screenshot] implement this design. take a screenshot of the result and compare it to the original. list differences and fix them." Claude can drive a real browser (Chrome integration, or browser MCP servers) to open the app, click around, and capture screenshots as evidence — closing the loop "implement → verify in browser → generate test." Honest caveat: AI-generated tests can be flaky and become technical debt, so review them like any other code.

### 7.6 — How hard to gate the "stop"

In one prompt (ask it to run the check and iterate); across a session with a `/goal` condition (an evaluator re-checks each turn); as a deterministic **Stop hook** (blocks the turn from ending until your check passes, after a small number of consecutive blocks); or via a second-opinion verification subagent in fresh context. Plus `/ultrareview` for a heavier cloud-based bug-hunting pass.

### 7.7 — Large and binary files

Claude reads files it's pointed at **in full** — real cost/context implications for big files. **Binary files** (images, compiled artifacts) aren't meaningfully editable as text. Very large files spike context and memory (relevant to the `/heapdump` tool and the VS Code RAM crashes in Module 10).

> **Milestone — Module 7:** Build Ladder 2 from the spec — on a *copy* of a messy folder — and require Claude to run the verification check and show evidence before you call it done. Then break it on purpose and paste the error. **You should now be able to:** define "done" as a runnable check, and hand over a bug as symptom + error + reproduction instead of "it doesn't work."

## MODULE 8: DEPLOYING AND AUTOMATING

### 8.1 — Deployment from scratch (publishing your project)

**Deployment = publishing your project to a live server so anyone can reach it at a public URL.** Until you deploy, your site only exists in your local environment (Module 3.5).

- **A static site** is fixed files (HTML/CSS/images) served as-is to every visitor, with no per-request server computation — most simple sites, portfolios, and landing pages. (Dynamic sites compute pages per request, usually backed by a database — Module 0.3.)
- **Beginner hosts:** Vercel, Netlify, and Cloudflare Pages host static (and some dynamic) sites cheaply or free.
- **The Git → host auto-deploy flow:** connect a GitHub repo to the host; every `git push` triggers an automatic rebuild and re-publish. This is the standard modern workflow and fits Claude Code naturally.
- **The no-Git option:** Netlify drag-and-drop — drag your project folder onto Netlify's page and it goes live. Good before you've adopted Git.
- **Custom domains and HTTPS:** point a domain you own at the host; these platforms provision HTTPS automatically (Module 0.6).
- **Claude Code can run the deploy for you:** it can execute the host's CLI — `vercel`, `netlify deploy`, or `wrangler pages deploy` — so you can say "deploy this to Netlify" and approve the commands.

> **Real gotcha:** Vercel's free (Hobby) tier disallows commercial use; Netlify's free tier allows it. Choose accordingly for a small business site.

### 8.2 — Scheduled automation: three surfaces, not one

- **Routines** (April 14, 2026; research preview; all paid plans) — saved Claude Code automations that run on Anthropic-managed cloud infrastructure, so they keep running even when your computer is off. They're fully autonomous (no approval prompts during a run) and by default only push to `claude/`-prefixed branches. Daily caps: Pro 5/day, Max 15/day. Triggers: scheduled (≥1-hour interval), API (HTTP POST), or GitHub events. Create at claude.ai/code/routines or via `/schedule`.
- **Desktop scheduled tasks** — local; the Desktop app must be open.
- **`/loop`** — in-session recurring routine, ≤7 days.

> **Gotcha:** a green run status means the session started and exited cleanly, **not** that the task succeeded. Open the run to confirm the actual outcome.

> **Milestone — Module 8:** Deploy Ladder 1's site with Netlify drag-and-drop (then, optionally, redo it via the Git→host flow), and set up one small scheduled task or `/loop` for a recurring chore. **You should now be able to:** explain deployment to a friend in two sentences, and pick between Routines, desktop scheduled tasks, and `/loop`.


-----

