# Claude Code for Non-Coders — A Beginner's Guide & Self-Study Course

*A self-study guide and course on software development fundamentals and building with Claude Code, written for non-coders. Thirteen modules run from the mental models underneath all software (Module 0) through the Claude ecosystem, setup, day-to-day use, and the practices Anthropic's own Claude Code team uses internally (Module 12), organized around a three-project hands-on ladder. Primary focus is Claude Code; Chat and Cowork appear wherever they're the better tool for the task. Treat every version-specific claim as a mid-2026 snapshot and re-verify against code.claude.com/docs before relying on it — see "A note on currency" below.*

-----

## A NOTE ON CURRENCY AND SOURCING

Claude Code ships multiple releases per week, so treat every version-specific claim here as a mid-2026 snapshot, not a permanent fact — run `claude --version`, `/status`, and `/doctor` to check your own setup against current docs. A few figures in this guide (usage-study percentages, a "five active skills" limit, a hook's override threshold) are drawn from secondary sources or couldn't be re-verified against a live primary source at the time of writing; these are flagged briefly where they appear and should be treated as directional rather than exact. See Appendix F for a fuller list of what's changed recently, and Appendix H for the general caveats.

-----

## HOW TO READ THIS COURSE

Work top to bottom the first time. Module 0 builds the mental models that make everything after it click — especially the one skill that determines whether a non-coder can actually direct an AI agent: reading code well enough to tell whether a change looks right. After that, Modules 1–5 are the core working model, Modules 6–8 are building real things, and 9–11 plus the appendices are for scaling and reference.

### Course map at a glance

- **Part I — Foundations:** Module 0 (how software works), Module 1 (the Claude ecosystem: Chat / Cowork / Code).
- **Part II — Getting set up:** Module 2 (install & config — skippable if you're running).
- **Part III — The core working model:** Module 3 (core concepts & safe setup), Module 4 (directing the agent day to day), Module 5 (power features: skills, subagents, MCP, hooks, workflows).
- **Part IV — Building real things:** Module 6 (planning), Module 7 (debugging & testing), Module 8 (deploying & automating).
- **Part V — Scaling & reference:** Module 9 (best practices & cost), Module 10 (troubleshooting), Module 11 (real-world use cases), Module 12 (the insider playbook: how Anthropic's team uses Claude Code), Appendices A–H, Glossary.

### The project ladder (the course's hands-on spine)

Every module now ends in a **Milestone**. The milestones build toward three real projects, ordered by risk and complexity:

1. **Ladder 1 — a live one-page site.** Build a single-page static site and deploy it with Netlify drag-and-drop. Payoff for Modules 0–4 and 8: a public URL, near-zero risk, no Git required yet.
2. **Ladder 2 — a file-organizer script.** A small Python script that sorts a *copy* of a messy folder, with a verification check Claude runs itself. Payoff for Modules 3–7: specs, permissions, backups, and the verify loop on real files.
3. **Ladder 3 — a database-backed tool (capstone).** A small tool with a spec, phases, tests, Git, and a real database — built with the full Explore→Plan→Code→Commit discipline. Payoff for Modules 6–8 and 12. Anything with an ingest → store → query shape works (a resume-parsing database, a personal tracker).

Ground rules for every milestone: work on a copy of real data, in a dedicated folder outside OneDrive, and commit (or copy the folder) before anything risky.

-----

