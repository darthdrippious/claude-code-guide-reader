# PART II — GETTING SET UP

## MODULE 2: INSTALLATION & FIRST RUN (Windows)

> **Skip this module if you're already running Claude Code.** It's kept as reference for the course and for readers starting cold. Nothing here is required reading if `claude --version` already prints a version on your machine.

### 2.0 — Terminal 101 (restored — read this even if you skip the rest of the module)

The terminal is the one genuinely intimidating prerequisite, so here it is from scratch. The **terminal** is a window where you type text commands; the **shell** is the program inside it that interprets and runs them; the **command line** is the general name for working this way. People use *terminal / console / shell / CLI / prompt* loosely as synonyms. The text interface survives from the mainframe era because terse text commands are fast — which is also exactly why an AI agent can drive a computer through one.

On Windows, the built-in shell is **PowerShell**, and on Windows 11 the recommended way to run it is **Windows Terminal** (pre-installed — search "terminal" in the taskbar). The **prompt** is the symbol showing the terminal is waiting for input: PowerShell shows `PS C:\Users\You>`, the older Command Prompt (CMD) shows `C:\Users\You>` with no `PS`. That distinction matters because install commands differ between the two.

How it works: you type a command (say, `whoami`) and press Enter; the computer runs that program and prints the result. Starter commands worth knowing: `cd` (change directory/folder), `dir` (list a folder's contents; `ls` on Mac/Linux), `pwd` (print working directory — "where am I?"), `mkdir` (make a folder), `clear` (clear the screen). Three quality-of-life basics: **Tab** autocompletes file and folder names, **↑/↓** recall previous commands, and — the classic gotcha — in many terminals paste is **Ctrl+Shift+V** or right-click, not Ctrl+V.

One reassurance: after this module you'll rarely type commands yourself — you'll type *requests*, and Claude runs the commands. Terminal 101 exists so the screen never looks like magic.

### 2.1 — What you need

No free tier exists for Claude Code; it's included with paid Claude plans (Pro, Max, or — newly — Team). On Windows it now installs **natively, no WSL required**. Git for Windows is recommended so Claude can use the Bash tool (without it, Claude Code falls back to PowerShell as its shell tool). The native installer removed the old Node.js dependency entirely, so you only encounter Node/npm if you build JavaScript projects later — it's no longer part of getting started.

### 2.2 — Install commands (official, code.claude.com/docs/en/setup)

- **Native, Windows PowerShell (recommended):** `irm https://claude.ai/install.ps1 | iex` (no Administrator needed; close and reopen the terminal when it finishes). `irm` is Invoke-RestMethod and `iex` is Invoke-Expression; the script downloads the binary, updates PATH, and sets shell hooks.
- **Native, Windows CMD:** `curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd`. (If you see `The token '&&' is not a valid statement separator`, you're in PowerShell, not CMD.)
- **WinGet:** `winget install Anthropic.ClaudeCode` (does not auto-update; refresh with `winget upgrade Anthropic.ClaudeCode`).
- **WSL:** run the Linux installer `curl -fsSL https://claude.ai/install.sh | bash` inside your WSL distro, and launch `claude` there — not from PowerShell.

The native installer drops `claude.exe` in `%USERPROFILE%\.local\bin`, adds it to PATH, and auto-updates in the background. Use 64-bit Windows PowerShell — not x86, not CMD, not Git Bash (Git Bash throws "Raw mode is not supported" in the interactive CLI). ARM64 Windows is supported.

### 2.3 — Authentication, and the one pitfall that bills you wrong

Log in with your Claude subscription (OAuth opens a browser; if it can't redirect back, paste the login code into the terminal). The **critical pitfall**: if an `ANTHROPIC_API_KEY` environment variable is set on your system, Claude Code uses that key and bills you per-token through the API instead of using your subscription. To force subscription billing, run `claude logout` then `/login`, decline API-credit prompts, and confirm with `/status`.

### 2.4 — Pricing (reference only)

Pro $20/mo ($17 annual); Max 5x $100/mo; Max 20x $200/mo. **Team Standard now includes Claude Code** (it didn't previously — corrected here). The default model is **Claude Opus 4.8** (May 28, 2026; $5/$25 per million tokens; defaults to `high` effort in Claude Code); Sonnet 4.6 ($3/$15) is the everyday workhorse; Haiku 4.5 ($1/$5) is cheapest. Usage runs on two clocks — a rolling ~5-hour window plus a weekly cap — and the bucket is **shared across Chat, Claude Code, and Cowork**. Rate limits got more generous in May 2026 (5-hour limits doubled; +50% weekly through July 13, 2026). Programmatic use (`claude -p`, the Agent SDK, GitHub Actions) bills from a separate credit pool as of June 15, 2026; interactive use is unaffected.

### 2.5 — Windows quirks worth knowing

- **"claude is not recognized"** (the #1 complaint): PATH. Reopen the terminal; if still failing, add `%USERPROFILE%\.local\bin` via Win+R → `sysdm.cpl` → Environment Variables.
- **PowerShell "running scripts is disabled"**: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- **Antivirus false positives**: Defender/Bitdefender/Malwarebytes have quarantined Claude Code's skill ZIPs and slowed the toolchain; add a *narrow* folder exclusion (understanding it's a trust decision).
- **"Fake Claude Code" malware**: attackers push counterfeit installers/extensions via sponsored search results. Only install from claude.ai / code.claude.com.
- **OneDrive conflicts** (most non-coders have Documents/Desktop synced): documented config corruption, `EEXIST` write failures, and silent truncation. **Keep projects out of OneDrive — use `C:\dev\`** — and mind the 260-character path limit.
- **Microsoft Store popup** on install: dismiss and re-run, or install Git for Windows first.
- **No OS-level sandbox on native Windows** (see Module 4) — a real security gap to plan around.

### 2.6 — Cowork on Windows setup

If you use Cowork for file/knowledge tasks, its Windows setup differs from Claude Code's: it runs inside a lightweight VM, so it needs the **Virtual Machine Platform** feature enabled, **administrator rights to install** the VM service, **Windows 10 22H2 or later**, and a one-time **~2 GB VM image download**; Windows Home editions may need **Hyper-V** enabled separately, and ARM64 support is still in progress. The upside of that VM: it's the OS-level sandbox Claude Code lacks on Windows, which makes Cowork the *safer* surface for risky file operations.

### 2.7 — Verify it works

- `claude --version` prints a version (success).
- `where.exe claude` should return exactly one path (two = duplicate installs; remove one).
- `/doctor` (in a session) or `claude doctor` (from the shell) runs diagnostics; press `f` to auto-fix. `/status` shows your active model, permission mode, connected MCP servers, and which auth token is active. Distinction: `/doctor` tests your environment; `/status` reports current config.
- First launch in a folder asks "Do you trust the files in this folder?" — answer Yes for folders you control. (Known Windows bug: this can re-prompt every launch; the workaround is a `trustedDirectories` setting.)

### 2.8 — Your first session

The first five minutes, step by step. Open a terminal, `cd` into a project folder (a throwaway one for your first run), and type `claude`. That launches the interactive session — a **REPL** (read-eval-print loop): it reads what you type, acts, prints the result, and waits, keeping context across turns. You'll get the trust prompt; answer Yes. Then make one small, low-stakes request ("explain what's in this folder," or "create a file called hello.txt containing a haiku about traffic"). Watch what happens: Claude narrates its steps, shows any file change as a **diff**, and asks permission before acting. If it starts doing something you didn't want, press **Esc** — nothing bad happens, context is preserved. When you're done, exit with **`/exit`** or **Ctrl+D**. You can also skip the interactive session entirely for a one-off: `claude "explain what this project does"` runs once and returns. That's the whole loop — everything else in this course is refinement of those five minutes.

> **Milestone — Module 2:** Ladder 1, step one — make a folder at `C:\dev\hello-site`, start Claude Code in it, and complete a first session exactly as in 2.8: one small request, watch the diff, exit cleanly. **You should now be able to:** open a terminal without dread, launch and exit Claude Code, and run `/doctor` when something feels off.

-----

