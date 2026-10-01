# PART III — THE CORE WORKING MODEL

## MODULE 3: CORE CONCEPTS & SAFE SETUP

This module pairs the fundamentals from Module 0 with the Claude Code features that use them. It's the foundation of every working session.

### 3.1 — Files, folders, and paths (tie-in: code literacy)

A **directory** is a folder; the file system is a tree of folders and files. A **path** is a file's address: an **absolute path** starts at the root (`C:\Users\You\project\index.html`); a **relative path** is relative to your current folder; `cd ..` goes up one level. Windows uses backslashes `\`; Mac/Linux/WSL use `/`. **Claude Code tie-in:** it works in your current "working directory," and you point it at files with `@` (e.g. `@src/index.html`), which makes it read that file before responding. Reading those files is where your Module 0.2 literacy gets exercised.

### 3.2 — Git and version control (this is your real safety net)

**Version control** tracks changes to files over time so you can see history, undo mistakes, and collaborate. **Git** is the version-control system that runs locally on your machine. Core vocabulary:

- **Repository ("repo")** — a project folder plus a hidden `.git` folder holding the full history of every change.
- **Commit** — a saved snapshot at a moment in time, with a message describing the change.
- **The everyday loop:** edit → **stage** (`git add`, mark what goes in the next snapshot) → **commit** (`git commit -m "message"`) → **push** to a remote (`git push`) → **pull** others' changes (`git pull`).
- **Branch** — a parallel line of work so you can build a feature without touching the main version (default branch: `main`). **Merge** combines a branch back in.
- **GitHub vs Git** — Git is the local system; GitHub is a website that hosts repos in the cloud (GitLab/Bitbucket are alternatives). A **pull request (PR)** proposes merging one branch into another for review.

**How Claude Code uses Git:** it stages changes, writes commit messages, creates branches, and opens PRs; Anthropic engineers reportedly delegate over 90% of their Git operations to it. You can literally say `claude "commit my changes with a descriptive message."` **Important limit (official):** Claude's built-in checkpoints only track changes Claude makes, not external processes — they are not a replacement for Git.

### 3.3 — A backup ladder for true non-coders (use this before risky changes)

You can ship real work for weeks before learning Git fully, as long as you protect yourself. Three tiers, lightest to safest:

1. **In-session undo:** checkpoints / `/rewind` (or Esc+Esc) restore a previous conversation and/or code state. Tracks only Claude's changes; not durable history.
2. **The low-tech copy:** before a big change, copy the whole project folder (`project` → `project-backup-2026-06-29`). Crude, zero new skills, genuinely protective.
3. **Git, eventually:** the only tier that gives real history, branching, and collaboration.

> **Windows data-loss warning:** `rm` (delete) run via Git Bash or WSL **bypasses the Recycle Bin entirely** — those deletions are permanent. This is precisely why a folder copy or a Git commit before risky work is real protection, not ceremony. (See the documented data-loss incidents in Appendix E, including files lost because they weren't in Git.)

### 3.4 — Dependencies and packages (tie-in: security)

A **dependency** is external code your project relies on so you don't rebuild common functionality; dependencies are listed in a manifest (for JavaScript, `package.json`) and installed into a folder (`node_modules`). **Claude Code tie-in:** Claude can run `npm install`, add dependencies, and update them, asking permission by default. Connect this to Module 0.6 — every dependency is code you're trusting, so favor popular, maintained packages and be wary of obscure ones an agent suggests.

### 3.5 — Environments and environment variables (tie-in: secrets)

A **local environment** is the setup on your own machine. **Dev vs production:** "dev" is where you build and test; "production" is the live version real users see. **Environment variables** are named values stored outside your code — used for configuration and secrets like API keys, so they aren't hard-coded (Module 0.6). Claude Code reads several of its own: `ANTHROPIC_API_KEY`, `CLAUDE_CODE_USE_POWERSHELL_TOOL`, `CLAUDE_CODE_EFFORT_LEVEL`, `CLAUDE_CODE_DISABLE_WORKFLOWS=1`, `MAX_MCP_OUTPUT_TOKENS`, and others. Note `MAX_THINKING_TOKENS` no longer applies to adaptive-thinking models (Opus 4.7+, 4.8).

### 3.6 — The context window (why long sessions get dumber)

Official: "Claude's context window holds your entire conversation, including every message, every file Claude reads, and every command output… LLM performance degrades as context fills." When it's getting full, Claude may forget earlier instructions or make more mistakes. The community notes degradation starting around 40% usage; lossy auto-compaction fires near ~95%. Manage it with `/context` (see usage), `/clear` (wipe history, keep file edits), and `/compact [instructions]` (summarize older messages, steerable: `/compact Focus on the API changes`). Guidance: `/compact` past ~80% usage, `/clear` when switching tasks. Prefer manual `/compact` at task boundaries over waiting for lossy auto-compaction.

### 3.7 — CLAUDE.md (the agent's persistent instructions)

Official: "CLAUDE.md is a special file that Claude reads at the start of every conversation. Include Bash commands, code style, and workflow rules." Create it with `/init` (it analyzes your codebase to detect build systems, test frameworks, and patterns), or press `#` mid-session to add a memory. **Levels** (all combine; more specific wins): `~/.claude/CLAUDE.md` (global), `./CLAUDE.md` (project root, check into Git to share), `./CLAUDE.local.md` (personal, gitignored). **Keep it short** — official guidance is that bloated CLAUDE.md files cause Claude to ignore your actual instructions; for each line ask "would removing this cause a mistake?" The community "~200 lines" figure is a rule of thumb, not a hard limit. You can add emphasis ("IMPORTANT," "YOU MUST") to improve compliance.

Sample minimal CLAUDE.md (official):

```
# Code style
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')

# Workflow
- Be sure to typecheck when you're done making a series of code changes
- Prefer running single tests, and not the whole test suite, for performance
```

That sample is developer-flavored (ES modules and "typecheck" are JavaScript-project conventions) — yours can be plain-English rules like "always ask before deleting files" or "explain each change in one sentence before making it."

A beginner-friendly companion pattern: keep a small set of "dev docs" in the repo — `plan.md`, `context.md`, `tasks.md` — as durable external memory you tell Claude to read at the start of a session, so a `/clear` doesn't lose the thread.

> **Milestone — Module 3:** In your `hello-site` folder, run `/init`, trim the generated CLAUDE.md to under ten plain-English lines, and make one backup-ladder pass: copy the folder, ask Claude for a change, then practice `/rewind`. **You should now be able to:** explain repo, commit, and branch in one sentence each, and protect your work three different ways before a risky change.


## MODULE 4: DIRECTING THE AGENT DAY TO DAY

### 4.1 — Giving instructions and reading diffs

You type natural-language requests and point Claude at files with `@file`. Claude reads files, proposes edits shown as **diffs** (exactly which lines change — this is where Module 0.2 pays off), and runs commands. You can paste images/screenshots: on Windows, paste a clipboard image with **Alt+V** (Ctrl+V pastes text only), or drag the image file into the window.

### 4.2 — The permission system and the six modes

By default Claude Code asks permission before actions that modify your system — file writes, Bash commands, MCP tools. Safe but tedious. There are **six** permission modes; only three are in the **Shift+Tab** cycle:

- **Shift+Tab cycles:** `default → acceptEdits → plan`.
- **`auto`** appears in the picker when you're eligible and opt in.
- **`bypassPermissions`** is set via flag/settings, never the base cycle.
- **`dontAsk`** denies everything not explicitly allowed (for scripted/unattended runs).

**`acceptEdits`** auto-applies edits *and* common filesystem Bash commands in the working dir (`mkdir, touch, rm, mv, cp, sed`; with the PowerShell tool, `Set-Content`/`Remove-Item` etc.) — but it does **not** approve everything: `npm`, `git push`, and `curl` still prompt. It stays interactive. Note what that list includes: **deletions** (`rm`, `Remove-Item`) inside your project folder — and Bash deletions bypass the Recycle Bin (Module 3.3) — so the backup ladder applies even in acceptEdits.

**Auto mode is the recommended middle ground for non-coders.** It uses a separate classifier model that auto-runs safe reads/edits while blocking risky actions — pushes to `main`, prod deploys, sending secrets, deleting pre-existing files. Anthropic found 93% of permission prompts were being approved anyway, which is why Auto mode exists. Prefer it over the "YOLO mode" flag below.

**"YOLO mode"** (`--dangerously-skip-permissions`) skips every prompt. Documented risks: destructive file edits/deletions, scope creep, and prompt injection (hidden text in a document making Claude exfiltrate files). Community consensus: never run it on your host machine — use a container/VM, a feature branch, and commit first. For this course's audience: use Auto mode instead.

### 4.3 — The Windows security caveat (and a new mitigation)

**Native Windows has no OS-level sandbox** (`/sandbox` is macOS/Linux/WSL2 only). Without it, deny rules only constrain Claude's *built-in* tools — a raw Bash command like `cat ~/.ssh/id_rsa` bypasses them. So native-Windows users have weaker protection than the Mac/Linux docs imply and should lean on permission prompts, work inside a dedicated folder, and consider WSL2 if they want true sandboxing. **A newer mitigation:** an `autoMode.classifyAllShell` setting routes *all* Bash/PowerShell commands through the auto-mode classifier instead of only flagged patterns — turn it on for stronger coverage on Windows. (And recall from Module 1 that Cowork's VM gives you real sandboxing for file tasks.)

### 4.4 — Slash commands worth knowing

Type `/` to see the menu (50+). Most-used: `/clear`, `/compact`, `/init`, `/memory`, `/model`, `/review`. Others:

- `/help`, `/context`, `/effort` (low → medium → high → xhigh → max, plus `ultracode`).
- `/review`, `/security-review`, `/code-review` (now supports `--fix`), `/ultrareview` (cloud bug-hunting, research preview).
- `/rewind` (Esc+Esc) — restore previous state; enhanced June 25, 2026 to restore context from *before* a `/clear`.
- `/cost` (alias for `/usage`), `/stats`, `/usage` — spend and rate-limit status.
- `/permissions`, `/agents`, `/plugin`, `/hooks`, `/doctor`, `/status`.
- `/resume` (alias `/continue`), `/rename`, `/branch` (alias `/fork`), `/cd` (switch working directory — useful across projects).
- `/btw` (side question without polluting context), `/terminal-setup` (fix VS Code/Cursor rendering), `/goal` (a completion condition Claude works toward, with a live time/turns/tokens overlay), `/workflows`, `/deep-research`, `/loop` (in-session recurring, ≤7 days), `/schedule`.

> Custom commands were merged into Skills (April 11, 2026); commands still work, and a skill wins over a same-named command.

### 4.5 — Effective prompting (official before/after patterns)

- **Scope it:** not "add tests for foo.py" but "write a test for foo.py covering the case where the user is logged out. avoid mocks."
- **Point to sources:** "look through ExecutionFactory's git history and summarize how its api came to be."
- **Reference a pattern:** point Claude at a good example file and say "follow the pattern."
- **Describe the symptom, not your theory:** "users report login fails after session timeout. check the auth flow in src/auth/, write a failing test that reproduces it, then fix it."
- **Provide rich context:** `@file` references, pasted screenshots, URLs (allowlist with `/permissions`), piping (`cat error.log | claude`).
- **Let Claude interview you** for bigger features: "I want to build [description]. Interview me in detail… keep interviewing until we've covered everything, then write a complete spec to SPEC.md."
- **Course-correct early:** Esc stops mid-action; "undo that" reverts; after two failed corrections, `/clear` and rewrite.

### 4.6 — How to stop or cancel a running task

- **Esc** interrupts the current action while preserving context.
- **Ctrl+C** stops or redirects.
- **Esc+Esc** opens the rewind menu (restore code and/or conversation).

Interrupt *early* rather than letting a wrong large change finish — it's far cheaper to redirect at step two than to clean up after step twenty.

### 4.7 — What happens when you hit a usage limit mid-task

You get a warning, then a message naming the limit and its reset time. **Nothing is charged or deleted, files stay on disk, the conversation is saved.** Three moves: wait (the ~5-hour window resets, often sooner), switch model (`/model sonnet`), or enable usage credits with a cap you set. Remember the two clocks (5-hour + weekly) and the shared bucket across Chat/Code/Cowork. And re-check for a stray `ANTHROPIC_API_KEY` silently billing the API (fix with `/login`). The usage dashboard can lag by days, so set a cap rather than watching a number.

> **Milestone — Module 4:** Finish Ladder 1's build — have Claude create the one-page site, interrupting it once on purpose with Esc just to prove you can, and reviewing every diff before accepting. **You should now be able to:** name all six permission modes, say what acceptEdits does and doesn't auto-approve, and stop a runaway task without panic.

## MODULE 5: POWER FEATURES — SKILLS, SUBAGENTS, MCP, HOOKS, WORKFLOWS

This is where Claude Code stops being a smart autocomplete and becomes a configurable platform. (Module 1.4 covered where Skills and Plugins work across surfaces; this module is how to build and use them.)

### 5.1 — Skills (your reusable procedures)

Official: "Skills extend Claude's knowledge with information specific to your project, team, or domain. Claude applies them automatically when relevant, or you can invoke them directly with /skill-name." A skill is a `SKILL.md` file in `.claude/skills/<name>/`. Non-coder framing: it's like writing a procedure for a new employee.

Writing best practices: a skill is **model-invoked** (Claude decides when to use it) unless you set `disable-model-invocation: true` for workflows you only trigger by hand. **The `description` field is what Claude reads to decide whether to trigger the skill — make it specific and trigger-rich.** YAML frontmatter fields: `name`, `description`, `allowed-tools`, `model`, `disable-model-invocation`. Skills load on demand so they don't bloat every session. Prefer several **narrow** skills (e.g. a "local website designer" + a "local SEO strategist") over one bloated mega-skill. Recall from Module 1 that the same skill works in Chat, Cowork, and Code, and Claude adapts it to the surface.

```
---
name: api-conventions
description: REST API design conventions for our services
---
# API Conventions
- Use kebab-case for URL paths
- Always include pagination for list endpoints
```

Custom slash commands live alongside skills (`.claude/commands/<name>.md`); the filename is the command name, and `$ARGUMENTS` (or `$1`, `$2`) inserts inputs.

```
---
name: fix-issue
description: Fix a GitHub issue by number
---
Fix issue #$ARGUMENTS following our coding standards
```

Usage: `/fix-issue 123`.

### 5.2 — Subagents (isolated helpers)

Official: subagents "run in their own context with their own set of allowed tools… useful for tasks that read many files or need specialized focus without cluttering your main conversation." Defined in `.claude/agents/<name>.md` or via `/agents`. Their verbose output stays isolated; only a summary returns to your main thread. Invoke explicitly: "Use a subagent to review this code for security issues."

```
---
name: security-reviewer
description: Reviews code for security vulnerabilities
tools: Read, Grep, Glob, Bash
model: opus
---
You are a senior security engineer. Review code for injection
vulnerabilities, auth flaws, secrets in code, and insecure data handling.
```

### 5.3 — MCP (connect Claude to your other tools)

MCP (Model Context Protocol) is "an open standard for connecting AI tools to external data sources" — think "a USB-C port for AI applications." It lets Claude Code read design docs in Google Drive, update Jira tickets, pull from Slack, or use custom tooling. Connect one with `claude mcp add`. Common servers: GitHub, Slack, Notion, Jira/Confluence, Figma, Google Drive, Linear, databases. **Security:** only connect to MCP servers from organizations you trust. Tool search (default in 2026) defers loading tool definitions to keep context low.

**Computer use (a newer capability).** In research preview for Pro/Max, available in both Cowork and Claude Code on macOS and Windows, Claude can navigate your screen directly — clicking, typing, opening apps — when it has no connector or tool for the job. Powerful, but note there's no sandbox between Claude and your apps; it relies on per-app permissions, an app blocklist, and prompt-injection scanning. Connect a proper tool/connector when one exists (it's faster and safer than screen navigation).

### 5.4 — Hooks (deterministic guardrails)

Official: "Hooks run scripts automatically at specific points in Claude's workflow. Unlike CLAUDE.md instructions which are advisory, hooks are deterministic and guarantee the action happens." Configured in `.claude/settings.json`; events include `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`/`SubagentStop`, `SessionStart`/`SessionEnd`, `PreCompact`. Uses: auto-run a formatter after every edit, or block writes to a protected folder. **On Windows, write the script in PowerShell and add `shell: powershell` to the hook entry.** Claude can write hooks for you. Key distinction for beginners: CLAUDE.md and hooks are deterministic (run every time); skills and subagents are probabilistic (Claude judges when to use them).

### 5.5 — Plugins, dynamic workflows, and Artifacts

- **Plugins** bundle skills, hooks, subagents, and MCP servers into one installable unit; browse with `/plugin`. Plugin skills are namespaced (e.g. `/security:scan`). Remember (Module 1.4): plugins run in Cowork and the Claude Code CLI, but not on the claude.ai website.
- **Dynamic workflows / `ultracode`** (May 28, 2026): Claude writes a JavaScript orchestration script that fans work across up to 1,000 subagents (16 concurrent), holds state outside the context window, and verifies via adversarial cross-checking — a separate agent tries to find faults rather than the author grading its own work. Triggered by the word "workflow," `/effort ultracode`, or `/deep-research`.
- **Workflows cost warning.** This is the advanced, expensive tier — it consumes substantially more tokens. Scope it tightly, turn Auto mode on, and use the "Once" approval to inspect the phase plan before it runs. (Flagship example: a ~750,000-line port of Bun from Zig to Rust over 11 days, 99.8% of tests passing.)
- **Artifacts in Claude Code:** a session can publish live, shareable web pages — a PR walkthrough, a dashboard, a release checklist — that update in place as the work progresses. Useful for showing non-technical stakeholders what the agent did without walking them through a terminal.

### 5.6 — Settings, plan mode, and thinking/effort

- **Settings:** `.claude/settings.json` (project) and `~/.claude/settings.json` (global) hold permissions, model choice, hooks, and attribution (whether commits credit Claude as co-author); `.claude/settings.local.json` is personal/gitignored. Put "harness-enforced" behavior — settings the *tool* enforces every time (permissions, model, attribution), as opposed to instructions the *model* follows — in settings.json rather than CLAUDE.md.
- **Plan mode:** Claude reads files and answers questions without making changes; press Ctrl+G to open the plan in your editor. Strong community convergence: use Plan Mode before any multi-file change — roughly "80% planning, 20% supervising." Skip it for trivial fixes.
- **Thinking → effort.** The old "think / ultrathink" keyword ladder is superseded by **adaptive thinking** (Opus 4.7+/4.8 decide per step whether to think) plus the `/effort` command. `high` is the Opus 4.8 default. Escalate effort only for architecture, cross-file refactors, and tricky bugs; it bills as more output tokens, so lower it for simple edits. The `opusplan` alias plans with Opus and implements with Sonnet.

> **Milestone — Module 5:** Write your first skill — a SKILL.md encoding one procedure you repeat (your stock-chart reading methodology is a perfect candidate) — and invoke it in two different surfaces. **You should now be able to:** explain deterministic (hooks, CLAUDE.md) vs probabilistic (skills, subagents), and say when a dynamic workflow is worth its token cost.


-----

