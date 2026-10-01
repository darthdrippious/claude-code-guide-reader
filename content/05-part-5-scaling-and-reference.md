# PART V — SCALING, TROUBLESHOOTING & REFERENCE

## MODULE 9: BEST PRACTICES & MANAGING COST

### 9.1 — The official best-practices spine

Everything rests on one constraint: Claude's context window fills fast and performance degrades as it fills. From there: give Claude a verifiable check; Explore→Plan→Code→Commit; provide specific context (`@` files, pasted images); write a lean CLAUDE.md; configure permissions; install the `gh` CLI so Claude can manage GitHub; connect MCP servers; set up hooks for non-negotiables; create skills and subagents; and manage your session (course-correct early via Esc / "undo that" / `/rewind`; `/clear` between unrelated tasks; `/compact` at ~80%; resume with `claude --continue` / `--resume`). For adversarial review, have a fresh-context subagent review the diff, but tell it to flag only gaps affecting correctness or the stated requirements, to avoid over-engineering.

### 9.2 — Failure patterns to avoid (official)

- **"The kitchen sink session"** → `/clear` between unrelated tasks.
- **"Correcting over and over"** → after two failed corrections, `/clear` and write a better prompt (the "two-strike rule").
- **"The over-specified CLAUDE.md"** → prune ruthlessly.
- **"The trust-then-verify gap"** → always provide verification; if you can't verify it, don't ship it.
- **"The infinite exploration"** → scope investigations or use subagents.

### 9.3 — Community mental model and tips

Treat Claude like a junior engineer with tools, memory, and iteration — not a magic code generator. Use slash commands for every inner-loop workflow you repeat, and say "use subagents" to throw more compute at a problem. (The team's challenge-and-review prompting moves — "grill me on these changes," "scrap this and implement the elegant solution" — live in Module 12.7 with attribution.) Convergent 2026 habits: one task per session; commit after every meaningful change; default to Sonnet and reserve Opus for planning.

### 9.4 — Multi-Claude, worktrees, headless

- **Git worktrees:** multiple working folders of one repo so parallel sessions don't collide.
- **Agent teams:** one session leads, coordinating teammates with their own context windows — but they use roughly **7× more tokens** in plan mode (each is a separate Claude instance). Cap parallelism; never leave subagent chains running unattended.
- **Headless mode:** `claude -p "prompt"` for scripts/CI; output formats `--output-format json`; scope with `--allowedTools`. Recall the June 15 credit split — `claude -p` bills from the separate programmatic pool.

### 9.5 — Managing cost (updated for the Opus 4.8 / effort era)

Watch usage with `/cost` / `/usage` / `/stats`; switch to Sonnet (`/model sonnet`) for routine work; `/compact` to cut context; use `.claudeignore` to keep big build folders out of context. Effort defaults to **high** on Opus 4.8, and adaptive thinking changes per-call cost even at the same headline price, so lower `/effort` for simple tasks. `ultracode`/dynamic workflows can balloon spend — scope tightly, inspect the phase plan via "Once," check the usage dashboard after the first runs, set a Console spend cap, **pin your Claude Code version** so a silent upgrade can't blow up your bill, and never run unattended loops without a hard ceiling. Cowork tasks in particular burn far more tokens than chat, so heavy Cowork use pushes you toward a higher plan. Community cost-visibility tools (`ccusage`, Claude Code Usage Monitor) help — with the caveat they're community-built. The "Document & Clear" method: don't trust auto-compaction; use `/clear` for simple reboots and keep a `CURRENT_STATE.md` as durable external memory for complex tasks.

> **Milestone — Module 9:** Do one cost-awareness pass: check `/usage` and `/stats` after a working session, drop `/effort` for a simple task, and add a `.claudeignore` if you have bulky folders. **You should now be able to:** name the five failure patterns and apply the two-strike rule without being reminded.

## MODULE 10: TROUBLESHOOTING & MAINTENANCE

### 10.1 — Diagnose first

Run `/doctor` (in session) or `claude doctor` (shell) — the fastest way to isolate the actual problem (press `f` to auto-fix). Restart with `claude --safe-mode` to test whether a plugin, MCP server, or hook is the source.

### 10.2 — Windows-specific

- **"claude is not recognized"** → PATH; reopen terminal; add `%USERPROFILE%\.local\bin`.
- **"Raw mode is not supported"** → you're in Git Bash; use PowerShell.
- **PowerShell "running scripts is disabled"** → `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- **Antivirus quarantine / slow toolchain** → narrow folder exclusion (a trust decision).
- **OneDrive `EEXIST` / truncation / config corruption** → move projects to `C:\dev\`.
- **Microsoft Store popup on install** → dismiss/re-run; install Git for Windows first.
- **Terminal rendering glitches** in VS Code/Cursor → `/terminal-setup`.
- **Sudden breakage after a Windows Update** → suspect the OS update (a January 2026 update once crashed the VS Code extension with `0xC0000005`); check the extension version and GitHub issues.

### 10.3 — Authentication

- **403 after login** → verify subscription at claude.ai/settings; check for a stale `ANTHROPIC_API_KEY` overriding OAuth.
- **400** = malformed request; **500** = Anthropic server (retry; check status.anthropic.com); **529** = overloaded.
- **OAuth timeout** → likely DNS; fall back to an API key. Stale auth → `claude logout` then `/login`.

### 10.4 — Context / memory

- **Auto-compact thrashing** → have Claude read the oversized file in chunks; `/compact` with a focus that drops the big output; move large-file work to a subagent; `/clear`.
- **Claude forgetting instructions** → context too full; `/clear` or `/compact`; check `/memory` (a rule may be in a nested CLAUDE.md not yet loaded).
- **If memory stays high** → `/heapdump` writes a snapshot to the Desktop for bug reports.

### 10.5 — Going off track / too many changes

Esc to stop; "undo that"; `/rewind` to a checkpoint. Mitigate with a feature branch + commit first (or a folder copy) + narrow prompts + Auto mode. After two corrections, `/clear`.

### 10.6 — Performance, and VS Code extension instability

High CPU/memory on large codebases → restart the terminal (resume with `claude --resume`; restarting doesn't lose your conversation). The VS Code extension can crash on RAM during rapid multi-file edits and corrupt large session files; keep CLI and extension versions aligned, and fall back to the terminal during extension regressions.

### 10.7 — Updating and uninstalling (Windows)

**Updating:** native installs auto-update in the background; WinGet/npm are manual (`winget upgrade Anthropic.ClaudeCode`). **Uninstalling** (no first-class native uninstaller historically): locate with `where.exe claude`, delete the binary (`Remove-Item "$env:USERPROFILE\.local\bin\claude.exe" -Force`, or Settings → Apps, or `winget uninstall`), then optionally delete `~/.claude`, `~/.claude.json`, and project `.claude/` and `.mcp.json`. **Back up config first** — deleting it wipes settings, MCP servers, allowlists, and history; IDE extensions/the Desktop app can recreate `~/.claude` if left installed.

### 10.8 — Data-integrity recovery

- **OneDrive `.claude.json` corruption** → recover from `~/.claude/backups/` (the largest valid `.corrupted` file is usually valid JSON).
- **Stale install lock** ("another process is currently installing Claude" after a reboot) → delete the stale lock at `~/.local/state/claude/locks`.

> **Milestone — Module 10:** Run `/doctor` and `claude --safe-mode` once while nothing is broken, so the first real failure isn't also your first diagnostic. **You should now be able to:** recall the fix for the top three Windows problems (PATH, execution policy, OneDrive) from memory.

## MODULE 11: REAL-WORLD USE CASES

### 11.1 — Websites and web apps

- A consultant rebuilt a Wix site as a custom static+dynamic site on AWS in ~3 hours, "not a single line of code" — honest caveat: no tests, no pipeline, no security hardening, "but it worked."
- A non-technical marketer (Ryan Doser) built a local-service website in ~15 minutes with Claude Code + GitHub + Cloudflare + Astro on the Max plan; round two produced 41 pages. Tips: narrow skills over a mega-skill; thinking off / effort low for scaffolding; end the first prompt with "First provide a game plan for approval."
- An agency rebuilt three production sites (deployed to Vercel, wired analytics) over a weekend or two, hosting "basically zero" vs $30–50/mo — caveat: you need to be comfortable with a terminal.
- **Chris Lema's "Non-Developer's Guide to Building a Website with Claude"** — a 24-step walkthrough using Cowork + GitHub + Cloudflare Pages, no terminal. A strong terminal-free example.
- **Oliur** built a personal site from a single prompt via the Desktop "Code" tab — the no-terminal on-ramp from Module 1.

### 11.2 — Automation, personal tools, data analysis (non-coder examples)

- ~400 non-developers in Anthropic's "Claude Code Camp" built expense trackers that auto-categorize trip spending, content-dataset analyses for engagement, codebase research to answer support questions, and marketing content from recent code changes.
- Sid Bharath automated a weekly team report (45 min → ~5 min reviewing a draft) by reading a folder, pulling Asana tasks, and grabbing a metrics spreadsheet; plus Downloads organization and parallel synthesis of 12 interview transcripts. Tip: run it on a *copy* of the folder first.
- A small agency automated monthly invoicing via a skill ("half a day → under an hour").
- A self-described non-coder (XDA) built a color-palette generator in "a minute or two" and used a per-folder CLAUDE.md so Claude reads screenshot *contents* to help cull junk over time.

> Many of those file-and-document tasks are now a better fit for **Cowork** than the CLI (Module 1.5). And treat the time estimates (15 min, 45 min, 3 hrs) as self-reported and illustrative, several from marketing-adjacent sources.

### 11.3 — Existing codebases, data science, creative

- **Onboarding:** ask the questions you'd ask a senior engineer — "how does logging work?", "how do I add an API endpoint?", "what edge cases does this class handle?" Anthropic uses this to speed ramp-up; one community user captured legacy context in a `CLAUDE_LEGACY.md` and had Claude fix a months-old race condition in minutes.
- **Data science:** researchers use Claude Code to read/write Jupyter notebooks and interpret outputs including images; asking for "beautiful" output nudges it toward human-friendly visualizations.
- **Creative:** "Vibe Animating" — splitting an SVG into parts and having Claude animate each separately, generating 20+ viable CSS animations with little handholding.

> **Milestone — Module 11:** Pick the one use case above closest to your real work and replicate a small slice of it this week. **You should now be able to:** match a task to a surface, and treat time estimates honestly — illustrative, not benchmark.


-----

## MODULE 12: THE INSIDER PLAYBOOK — HOW ANTHROPIC'S TEAM USES CLAUDE CODE (2026)

This module synthesizes how the people who *build* Claude Code actually use it, drawn from their public threads, talks, and podcasts in the first half of 2026 — primarily **Boris Cherny** (creator of Claude Code), **Cat Wu** (head of product for Claude Code and Cowork), and engineering lead **Fiona Fung**, plus widely-shared community practitioners. Two framing notes before the tips. First, these are the habits of full-time engineers working on a huge codebase — adopt what fits a solo non-coder and skip what doesn't. Second, the most repeated message is that none of it requires a fancy setup: Boris describes his own configuration as "surprisingly vanilla," which is proof the tool works well out of the box.

> **Go deeper (all public sources):** Boris Cherny's tip threads (Jan–Jun 2026); his talk "Mastering Claude Code in 30 Minutes"; the *AI & I* podcast episode with Cat Wu and Boris Cherny (Dan Shipper); Cat Wu and Fiona Fung on *Lenny's Podcast*; the official Claude/Anthropic YouTube channel; and Anthropic's report "When AI builds itself." Re-verify against current sources, since mechanics change weekly.

### 12.1 — Verification is the #1 lever (and it scales down to you)

Boris's most important tip, stated plainly: give Claude a way to verify its own work and it roughly **2–3× the quality** of the output. For his own work on claude.ai/code, Claude drives a real browser to test every UI change before it lands. The non-coder translation (Module 7): you don't need to read every line if you insist on a check you understand — a passing test, a screenshot that matches, a script that produces the right file. It's the same idea as the official docs, but worth hearing that the tool's creator treats it as the whole game.

### 12.2 — The self-improving CLAUDE.md ("compounding engineering")

This is the closest thing to the "self-improving loop" idea, and it's dead simple. The Claude Code team keeps one CLAUDE.md checked into the repo, and whenever they catch Claude doing something wrong, they add a line so it won't repeat the mistake — the whole team edits it several times a week. The habit that makes it automatic: after a correction, end with **"update your CLAUDE.md so you don't make that mistake again"** — Claude is eerily good at writing rules for itself. Boris calls this **"compounding engineering"** (a term from Dan Shipper): every bug you coach Claude through becomes a permanent rule, so the agent gets measurably better over time instead of repeating itself. The community "Compound" pattern (from the Viget team) uses the bug itself as the trigger, so you never have to remember to do it. For a solo builder this is the highest-ROI habit in the whole playbook — your CLAUDE.md becomes a living record of everything you've taught the agent. (Boris also wires this into code review: he tags `@claude` on a pull request to fold a lesson into the CLAUDE.md as part of the PR.)

### 12.3 — "Loop engineering": write loops, not prompts

The biggest shift in how the team talks about the tool in 2026. Boris Cherny says **"my job is to write loops"** and that loops are his favorite feature — he's "not prompting Claude anymore." The idea: instead of hand-holding the model turn by turn, you set up a loop that runs until a checkable condition is met. People describe a progression — prompt engineering → context engineering → harness engineering → **loop engineering** (the term was popularized by Google's Addy Osmani).

In practice this is the `/loop` command (a recurring in-session routine) and especially `/goal` (Claude works until a specific, checkable thing is true — Module 6.3). The single most important design choice in a loop, per Anthropic's harness work: **split the agent that writes the code from the agent that checks it**, because a model grading its own work is too lenient — a second agent with different instructions catches what the first reasoned itself into.

Non-coder takeaway: you don't need to build elaborate loops, but internalizing that "the craft is the stopping condition, not the prompt" tells you where to spend effort — define a clear, runnable "done," and let the tool iterate toward it.

### 12.4 — Pour your energy into the plan

Most of the team starts complex work in **Plan Mode** (Shift+Tab twice), iterates on the plan with Claude until it's solid, then switches to auto-accept so Claude can "one-shot" the implementation. Boris: **"a good plan is really important to avoid issues down the line."** A pattern worth stealing: have one Claude write the plan, then spin up a second Claude to review it "as a staff engineer" before you build. And when something goes sideways mid-build, the move isn't to keep pushing — it's to switch back to plan mode and re-plan. The team even tells Claude to enter plan mode for the *verification* step, not just the build.

### 12.5 — Work in parallel (the team's "single biggest unlock")

The top productivity tip from the Claude Code team is running **3–5 git worktrees at once**, each with its own Claude session, so multiple tasks progress without colliding (a worktree is multiple working folders of one repo — Module 9.4 / glossary). Boris numbers his terminal tabs 1–5 and uses system notifications to know when any Claude needs input; some engineers keep a dedicated "analysis" worktree just for reading logs and running data queries. This is advanced for a solo non-coder and safe to ignore early — but it's worth knowing the ceiling, and that the desktop app has native worktree support if you want to try it without terminal gymnastics.

### 12.6 — Turn anything you do more than once into a skill or command

Boris's rule: if you do something more than once a day, make it a slash command or skill, check it into git, and reuse it everywhere. The team shares commands like a one-step "commit, push, and open a PR." Two concrete ideas worth copying: a `/techdebt` command run at the end of every session to find and remove duplicated code, and a command that dumps the last seven days of your connected tools (chat, docs, tasks, GitHub) into one context block. This is the same logic as the stock-TA skill in Module 1 — encode a repeatable procedure once, use it forever.

### 12.7 — Prompting power moves the team actually uses

Don't accept the first solution. Patterns the team uses: make Claude your reviewer — ask it to "grill me on these changes" and refuse to open a PR until you pass its test; ask it to "prove to me this works" by diffing behavior between the old and new versions; and after a weak fix, tell it to scrap the approach and "implement the elegant solution" now that it understands the problem. For bugs, paste the failing thread or log and just say "fix" — or "go fix the failing CI tests" — without dictating how. And the context-over-cleverness rule, from practitioner Mejba Ahmed: a mediocre prompt with great context beats a perfect prompt with none.

### 12.8 — Claude Code as a learning tool (directly useful for building your course)

This is the most relevant section for someone building a training course for himself. The team uses Claude Code not just to write code but to *learn*:

- Turn on the **"Explanatory" or "Learning" output style** in `/config` so Claude explains the *why* behind each change as it works.
- Ask Claude to generate a **visual HTML presentation** explaining unfamiliar code or a concept — it makes surprisingly good slides (and recall from Module 5 that Claude Code can publish these as live, shareable Artifacts).
- Ask for **ASCII diagrams** of how a system or protocol works to build a mental model fast.
- Build a **spaced-repetition learning skill**: you explain your understanding of a topic, Claude asks follow-up questions to find the gaps, and it stores the result to quiz you later.

The payoff for your purposes: the same tool you're learning to build with can help you produce the course itself — explainer slides, diagrams, and quizzes — while teaching you the Module 0 fundamentals in context.

### 12.9 — The "second brain" pattern

Point Claude Code at a folder of your own notes — most people use an **Obsidian vault**, but any folder of markdown files works — and it becomes an AI-native "second brain." Why markdown: it's plain text, portable (no vendor lock-in), and Claude reads and writes it natively with no export step. What people do with it: have Claude turn rough captures into organized notes, surface non-obvious connections across months of notes, and synthesize an approach by pulling relevant ideas from across the vault. Two recurring lessons from practitioners: the magic is the same self-improving habit as 12.2 — ending each session by asking Claude **"what did we learn today?"** and saving the answer — and that a markdown vault is the natural *cross-project* memory that a per-repo CLAUDE.md can't be. (Even Dwarkesh Patel has shown pointing Claude Code at an Obsidian vault of research to turn it into interview questions.) This sits on the Claude Code / Cowork border — Cowork is the no-terminal way to do the same thing on your existing files (Module 1.5).

### 12.10 — Voice dictation, and "surprisingly vanilla"

Two closing notes. First, voice: the team recommends dictating prompts because you speak about **3× faster than you type**, and your prompts come out more detailed as a result (Claude Code has voice dictation built in — note the widely cited `fn`-twice shortcut is macOS-only; on Windows, check `/config` for the dictation setting). You're already doing exactly this from the iPhone app. Second, and most reassuring: Boris calls his own setup "surprisingly vanilla." The headline practices are just *plan well, verify, write mistakes back into CLAUDE.md, and reach for parallelism when you need it.* The tool is designed to work out of the box — resist the urge to over-configure before you've actually built something.

### 12.11 — The bigger picture (context, not a how-to)

For perspective on where this is heading: in its June 2026 report "When AI builds itself," Anthropic disclosed that as of May 2026 Claude wrote **more than 80%** of the code merged into Anthropic's own codebase, and that a typical engineer was merging roughly **8× as much code per day** as in 2024 — with humans shifting from typing code to directing and reviewing it. An automated Claude reviewer now screens every change before it can merge (the writer/reviewer split from 12.3, institutionalized). Two honest caveats the report itself stresses: lines-of-code overstates real productivity, and human judgment — choosing what to build and verifying what ships — remains the binding constraint. The encouraging lesson for a non-coder: the whole industry is converging on exactly the role this course trains you for — **directing and verifying an agent, not out-typing it.** One human footnote: Fiona Fung has noted that heavy agent use can make work feel "lonely," and the team responded with sessions where people watch each other use the tool — a reminder that watching someone else work is still one of the fastest ways to learn it.

> **Currency and sourcing caveat.** Module 12 is a snapshot of public statements from early-to-mid 2026; specific commands (`/loop`, `/goal`, output styles) and model defaults change frequently, and several quotes are relayed through secondary coverage of threads and podcasts rather than fetched from a primary transcript. Treat the *principles* as durable and re-verify the *mechanics* against code.claude.com/docs and the speakers' own current posts.

> **Milestone — Module 12 (capstone habits):** Adopt the two compounding habits for Ladder 3 and everything after: end every correction with "update your CLAUDE.md so you don't make that mistake again," and end every session with "what did we learn today?" written to a notes file. **You should now be able to:** run the insider loop — plan, verify, write the lesson down — with no fancy setup at all.

-----

