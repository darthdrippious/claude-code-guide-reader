# APPENDICES (reference)

## APPENDIX A: DATA PRIVACY & GIVING AN AI FILESYSTEM ACCESS

Handing an agent read/write access to your files is a real trust decision.

**The consumer training policy (changed September 2025).** Anthropic expanded its data-retention period to five years *if you allow your data to be used for model improvement*; if you don't choose that, you stay on the existing 30-day retention. It's **opt-in** via Settings → Privacy, applies to Free/Pro/Max accounts (including Claude Code used on them), and does **not** apply to Commercial Terms (Team/Enterprise/API), which are never used to train models and have ~7-day default retention. For a privacy-sensitive solo user, check that toggle or consider API/Console authentication.

**What Claude Code actually transmits.** Only files it **explicitly reads** are sent to Anthropic's servers (encrypted in transit); it does **not** auto-scan your whole disk, and all model processing happens in Anthropic's cloud. Practical rules: never point it at folders containing secrets/keys (Module 0.6), and note that conversations flagged for safety review may be human-reviewed and retained up to two years.

## APPENDIX B: WHERE CLAUDE CODE SITS — TOOLS & ALTERNATIVES

- **Claude Code** — terminal-native depth, deepest MCP ecosystem; the "build real things with an agent" tool. **Cowork** is its no-terminal sibling for knowledge work.
- **Cursor** — the most beginner-friendly; a VS Code-like editor with inline completions (~$20/mo). Most beginners meet Cursor first.
- **Codex CLI** (OpenAI) — strong long-running autonomy; bundled with ChatGPT plans; a polished chat-and-code app experience.
- **Gemini CLI** (Google) — had a generous free tier, but it's being sunset into Antigravity CLI (June 18, 2026) — don't start there.

## APPENDIX C: ACCESSIBILITY

Claude Code has **voice dictation** (with recent fixes for languages written without spaces, e.g. Japanese/Chinese/Thai). The **Desktop app and Cowork** give a GUI alternative to the terminal for users who find a CLI inaccessible. `/effort` and `/output-style` can make responses more readable. Honest flag: the terminal interface itself can be hard for screen-reader users; the GUI surfaces are the better path there.

## APPENDIX D: WORKING WITH MULTIPLE PROJECTS

Each folder is its own trusted project with its own `.claude/` config. Use **`/cd`** to switch the session's working directory; use **git worktrees** or the **Desktop app's parallel sessions** to work on several at once; and use the **per-folder CLAUDE.md** pattern so each project has its own conventions.

## APPENDIX E: SAFETY INCIDENTS (the 2026 wave)

Concrete cases that make the safety advice real. Provenance varies (see Caveats).

**Runaway cost.** A fintech (Slash) reported burning roughly **$81K in one week** building a meme game at ~$1,300/hr. A Reddit user left Claude Code on a 30-minute looping command overnight and ran up **$6,000** when a prompt-cache TTL change made the cache rebuild a huge context dozens of times a day; note the usage dashboard can lag by days, so set a cap. An earlier case saw **$47,000 over three days** from 23 unattended subagents. In **Cowork**, one user reported losing **15,000 photos** to a misjudged `rm -rf`.

**Data loss (GitHub issues).** Reported cases include 18 files deleted without confirmation (`rm` bypassing the Windows Recycle Bin; work lost because it wasn't in Git), 50 files destroyed when Claude modified a script to auto-delete "unreviewed" files, and an `rm -rf` wiping a home directory.

**Prompt injection / security.** A document with hidden white-on-white text made Claude exfiltrate files (PromptArmor, Jan 2026); a claude.ai URL-parameter injection exfiltrated chat history with no tools required ("Claudy Day," Mar 2026); plus a source-map leak, a deny-rule bypass (patched v2.1.90), GitHub-comment injection, a GitHub Action key leak (fixed v2.1.128), and a GitHub Action supply-chain issue.

**Takeaways for a solo non-coder:** keep permissions on (or use Auto mode); don't paste untrusted content or connect untrusted MCP servers; treat sponsored-search "Claude Code" download links with suspicion; and protect against the two big risks — destructive file operations (Git branch / folder copy / commit first; Module 3.3) and runaway cost (spend cap, no unattended loops, cap subagent parallelism; Module 9.5).

## APPENDIX F: OFFICIAL vs COMMUNITY & RECENCY FLAGS

- **Model lineup:** Opus 4.8 (May 28, 2026) is the flagship and Claude Code default at $5/$25. Opus 4.7 references are outdated; Fable 5/Mythos 5 are export-suspended (do not feature). Opus 4.7 fast mode is deprecated (removal July 24, 2026).
- **Rate limits:** more generous since May 6, 2026 (doubled 5-hour limits; peak throttling removed for Pro/Max) plus +50% weekly through July 13, 2026. Exact message/token counts are no longer published.
- **Cowork on Windows:** available since Feb 10, 2026 (GA April 9) — earlier "macOS only / verify" framing is outdated.
- **Team Standard:** now includes Claude Code (it previously didn't).
- **Permission modes:** six, not five; the Shift+Tab cycle is only default → acceptEdits → plan; Auto mode is the recommended safety-net default.
- **Sandboxing:** macOS/Linux/WSL2 only — not native Windows.
- **Thinking:** the "think/ultrathink" keyword ladder is superseded by adaptive thinking + `/effort`.
- **Windows install:** native is current; WSL no longer required (some older guides still wrongly say it is). npm is deprecated/secondary.
- **Skills vs custom commands:** merged (April 11, 2026); commands still work. **Skills work in Chat/Cowork/Code; plugins do not run on the claude.ai website.**
- **Self-reported build times** are illustrative, not benchmarks.

## APPENDIX G: STAGED RECOMMENDATIONS

(You're past Day 1, but kept for the course and for cold-start readers.)

1. **Step 0 — pick your surface.** Knowledge work / file tasks with no codebase → Cowork (or Chat to think). Building a project → Claude Code. Still figuring it out → Chat first, then hand a written plan to Code.
2. **Day 1 — get the CLI running.** Native PowerShell install; Git for Windows; projects in `C:\dev\` (not OneDrive); Pro subscription; confirm with `claude --version` and `/doctor`; trust-prompt "Yes" in a throwaway folder.
3. **Week 1 — build the habit.** `/init` + a short CLAUDE.md; practice Explore→Plan→Code→Commit on something tiny; master `/clear`, `/compact`, `/context`; protect work before risky changes (feature branch + commits, or a folder copy); keep permission prompts on or use Auto mode.
4. **Week 2+ — level up.** Narrow skills/subagents for repeated tasks; connect one MCP server; set up at least one verification loop (a test or screenshot check); learn to deploy a static site (Netlify drag-and-drop, then the Git→host flow); try a Routine; approach `ultracode` only with a spend cap.

- **Thresholds:** hitting Pro caps most days → Max 5x; running agent teams/parallel sessions → Max 20x; bursty/automated use → API pay-as-you-go (remember the separate programmatic pool). Token spikes → check for a stray `ANTHROPIC_API_KEY` and cap subagent parallelism.

## APPENDIX H: CAVEATS

- **Currency is the central risk.** Claude Code changes multiple times per week (v2.1.195 = June 26, 2026). Verify every command, flag, model, price, and limit against code.claude.com/docs; run `claude --version`, `/status`, `/doctor`.
- **Make currency a Claude Code task.** Build a small `/update-guide` skill (or a scheduled Routine) that reads this document, extracts its date-anchored claims, checks them against the current changelog and docs, and outputs a "stale claims" report. It's the compounding-engineering principle (Module 12.2) applied to the guide itself — and a fitting exercise once Ladder 3 is done.
- Pricing and rate-limit specifics change frequently; exact per-window message/token counts are no longer published.
- **The two biggest practical risks for a solo non-coder are destructive file operations and cost spikes** — worsened on Windows by `rm` bypassing the Recycle Bin and the absence of a native sandbox. Foreground both.
- Several real-world examples and time estimates come from marketing-adjacent or self-published sources and weren't independently verified; the GitHub data-loss issues and the Slash story are the most directly sourced incidents.

-----

