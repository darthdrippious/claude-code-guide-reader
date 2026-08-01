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

# PART I — FOUNDATIONS

## MODULE 0: HOW SOFTWARE ACTUALLY WORKS (mental models to learn first)

You don't need to write code to build with an agent, but you do need a working picture of what the agent is doing. This module is that picture. Every section ends with *why it matters for directing or checking Claude* — because that's the whole point of learning it.

### 0.1 — Code, programs, and apps, and what "running" means

**Code** is just text written in a precise language that tells a computer what to do. A **program** (or **app**) is code that's been packaged so a computer can run it. "Running" (or "executing") means the computer reads those instructions one after another and acts on them — doing math, moving data around, drawing things on screen, sending messages over the internet.

There are two broad ways code gets run, and you'll hear both terms:

- **Interpreted** languages (JavaScript, Python) are read and executed on the fly by another program called an interpreter. There's no separate "build it first" step — you just run the file. This is most of what you'll touch as a beginner.
- **Compiled** languages (Rust, Go, C++) are translated ahead of time into a machine-native file (a "binary") that the computer runs directly. Faster to run, slower to change. (Claude Code itself ships as a compiled binary — that single `claude.exe` — which is why it starts instantly and doesn't need a language installed to run.)

*Why it matters:* when Claude says it's "running the file" or "building the project," you now know whether there's a compile step that can fail on its own (a whole class of errors) versus a language that just runs your file directly.

### 0.2 — Code literacy: reading well enough to review (the most important non-coder skill)

You will be shown code constantly — as **diffs** (the red/green view of exactly what changed). You don't need to write it, but you need to *read* it well enough to sanity-check the agent. The good news: the core building blocks are few, and they recur in almost every language.

- **Variable** — a named box that holds a value. `price = 19.99` means "store 19.99 under the name price." Reading code is largely tracking what's in which box.
- **Function** — a named, reusable block of steps that takes inputs and (usually) returns an output. `calculateTax(price)` is a function; `calculateTax(19.99)` calls it. When you see a descriptive function name, you can often understand a block without reading its insides.
- **Conditional** — a decision. `if (user is logged in) { show dashboard } else { show login }`. Reading the `if`/`else` tells you the branches the program can take.
- **Loop** — "do this for each item." `for each product in cart: add up the price`. Loops are how programs handle lists of things.
- **Data structures** — the two you'll see everywhere: a **list/array** (an ordered collection, like `[ "red", "green", "blue" ]`) and an **object/dictionary** (labeled fields, like `{ name: "Sam", age: 40 }`). Most real data is nested combinations of these.
- **Comments** — notes for humans the computer ignores (often after `//` or `#`). Good code explains itself in comments.

**A worked example — your first diff.** Suppose you asked Claude to "stop the discount from applying to sale items." It shows this change (red lines removed, green added):

```diff
  function finalPrice(item) {
    let price = item.price;
-   if (hasCoupon) {
+   if (hasCoupon && !item.onSale) {
      price = price * 0.9;
    }
    return price;
  }
```

Read it with the building blocks above: `finalPrice` is a function taking an `item`; `price` is a variable; the `if` is a conditional deciding whether the 10% discount (`* 0.9`) applies. The only change is the condition: before, any coupon triggered the discount; now it also requires the item *not* be on sale (`!` means "not"). Check the three review questions — does the change match the request (yes), was anything else touched (no), was anything deleted you wanted kept (no). You just reviewed code.

How to actually review a diff without coding: read the function and variable *names* (well-named code is half-readable as English), check that the change matches what you asked for, look for anything deleting or overwriting something you wanted kept, and if a block is opaque, ask Claude "explain this change in plain English and tell me what could go wrong." That last move is the non-coder's superpower — you're not reading every line, you're spot-checking intent and risk.

*Why it matters:* this is the skill that closes the loop. If you can't read a diff at all, "looks done" is the agent's only signal and you can't catch mistakes. Even basic literacy lets you reject a bad change before it ships.

### 0.3 — How the web works (you'll build web things, so learn this)

Most non-coder builds are websites or web apps, so this model pays off immediately.

- **Client and server.** The **client** is the program in front of the user — usually a web browser. The **server** is a computer elsewhere that holds data and does work the client asks for. They talk over the internet.
- **Frontend and backend.** The **frontend** is everything the user sees and clicks (runs in the browser; built with HTML for structure, CSS for styling, JavaScript for behavior). The **backend** is the server-side logic and data the user never sees directly.
- **Request and response.** The whole web is clients sending **requests** ("give me this page," "save this form") and servers sending **responses** ("here's the page," "saved, here's the result"). The protocol they use is **HTTP** (the `https://` in a URL; the `s` means encrypted).
- **API.** An **API** (Application Programming Interface) is a defined set of requests a server agrees to answer — the menu of things you can ask it to do. "The frontend calls the API to load your orders" means the browser sends a request to a specific address and the server responds with order data. APIs are how separate pieces of software talk to each other.
- **Database.** A **database** is structured, persistent storage — think a set of giant, queryable spreadsheets the backend reads from and writes to. It's where data lives between visits (your account, your posts, your orders).
- **JSON.** **JSON** is the plain-text format that data usually travels in between client and server — just labeled fields and lists, e.g. `{ "name": "Sam", "orders": 3 }`. You'll see it everywhere; it's human-readable, which is why you can often eyeball whether an API response looks right.
- **State.** **State** is "what's true right now" — who's logged in, what's in the cart, which tab is open. A lot of bugs are really state bugs: the program's idea of what's true got out of sync with reality.

**A worked example — one click, traced end to end.** You click "Save note" in a web app. The **frontend** (JavaScript in your browser — the client) gathers the note text and sends an HTTP **request** to the server: `POST /api/notes` with a **JSON** body like `{ "text": "Call the plumber" }`. The **backend** receives it at that **API** endpoint, validates the input (is there text? is the user logged in — a check against **state**?), writes a new row to the **database**, and sends back a **response**: `{ "id": 512, "saved": true }`. The frontend reads that JSON and updates the page. Every web feature you'll ever build is a variation of that round trip — and when something breaks, the first debugging question is *which leg failed*: did the request go out, did the server error, or did the page just not update?

*Why it matters:* when Claude proposes "a frontend that calls an API which reads a database," you now know the shape of what you're building, can answer its architecture questions sensibly, and can tell when a problem is a frontend issue (looks wrong) versus a backend/data issue (wrong information).

### 0.4 — A map of languages and frameworks (so the agent's choices aren't a mystery)

As a non-coder you usually won't pick the language — but you should understand the choice Claude makes, and be able to push back.

- **Languages** are the base. **JavaScript** (and its stricter cousin **TypeScript**) runs both the frontend and, via Node.js, the backend — it's the default for most web apps. **Python** is the go-to for automation, data analysis, and scripting (and is famously readable). **HTML/CSS** aren't programming languages exactly but are how web pages are structured and styled. Others (Rust, Go, Java, C#) exist for performance or specific ecosystems; you'll rarely need them early.
- **Library vs framework.** A **library** is a bag of pre-built tools you call when you want them (e.g. a date-formatting library). A **framework** is a structure you build *inside* — it calls your code and dictates the overall shape (e.g. **React** for interactive frontends, **Astro** or **Next.js** for websites, **Express** for backends). Rule of thumb: you use a library; you live in a framework.
- **Why Claude picks what it picks.** It defaults to popular, well-documented stacks because there's more reliable training data and community support, which means fewer dead ends. If it picks something and you don't know why, ask: "why this stack for my project, and what are two alternatives and their tradeoffs?" A good answer in plain English is a green flag; hand-waving is a prompt to dig in.

*Why it matters:* you can make an informed yes/no on the agent's technical direction instead of rubber-stamping it, and you won't be lost when a tutorial or error message references a framework by name.

### 0.5 — The software development lifecycle (the discipline behind the tool)

Claude Code's "Explore → Plan → Code → Commit" loop (Module 6) is one instance of a general practice professionals follow. Knowing the general shape keeps you from skipping steps that matter.

The lifecycle, in plain terms: **requirements** (decide what it should do, and just as importantly what it shouldn't) → **design/architecture** (decide the major pieces and how they connect) → **build** (write it, in small increments) → **test** (prove each piece works) → **deploy** (publish it so others can use it) → **maintain** (fix, update, and improve over time). Real work loops back constantly — you learn something while building that changes the design.

Two principles from this that matter most for agent work: **work in small, verifiable increments** (a thin slice that actually runs beats a giant half-finished feature — see "vertical slices" in Module 6), and **decide what "done" means before you start** (a check the agent can run, not a vibe — see Module 7). Both are baked into how you should prompt Claude.

*Why it matters:* you'll recognize Claude's loop as a disciplined subset of how software is actually built, and you'll know when to insist on a step (like writing down requirements first) that the excitement of "just build it" tempts everyone to skip.

### 0.6 — Security fundamentals for a builder (don't ship these mistakes)

You don't need to be a security engineer, but you're about to put things into the world, so internalize a short list.

- **Secrets stay out of code.** API keys, passwords, and tokens are **secrets**. They belong in **environment variables** or a secrets manager, never typed directly into your code files. The single most common beginner leak is committing a secret to a public GitHub repo, where bots scrape it within minutes.
- **Know what not to commit.** A `.gitignore` file tells Git which files to never save into history — secrets, the big `node_modules` folder, local config. If you take one habit from this section: ask Claude to set up `.gitignore` early and confirm no keys are tracked.
- **Never trust user input.** Anything a user can type, an attacker can abuse. **Input validation** (checking and cleaning input) prevents whole categories of attacks like **injection** (sneaking commands in through a form field). You don't implement this by hand — but you should *ask* "is user input validated here?" when a feature accepts input.
- **HTTPS, not HTTP.** Serve sites over encrypted HTTPS (hosting platforms do this for free now). Plain HTTP sends data in the clear.
- **Dependencies are someone else's code.** Every package you install is code you're trusting. Stick to popular, maintained ones; be wary of obscure packages an agent suggests. (This is the same supply-chain caution behind the real "fake Claude Code" malware in Module 2.)

*Why it matters:* an agent will happily build something functional and insecure if you don't ask. These five questions catch the great majority of beginner security mistakes before they go live.

### 0.7 — Debugging and error messages as a transferable skill

Things will break. Debugging is the skill of figuring out *why* — and it's learnable without being a coder.

- **An error message is a clue, not a wall.** Read it. It usually names the file, the line, and what went wrong ("undefined is not a function," "connection refused"). Even if the jargon is opaque, the *location* and *category* are useful.
- **A stack trace** is the breadcrumb trail of what the program was doing when it failed, most-recent step on top. You don't need to parse it — but pasting the whole thing to Claude gives it far more to work with than "it broke."
- **Logs** are the messages a program prints about what it's doing; "add some logging" means "make the program tell us more about what's happening" so you can locate the failure.
- **The transferable habit:** reproduce the problem reliably, isolate where it happens, change one thing at a time, and confirm the fix. This is exactly what you'll have Claude do in Module 7 — and you'll direct it better because you understand the method, not just the magic word.

**A worked example — reading a real error.** Claude runs your script and this appears:

```
Traceback (most recent call last):
  File "organize.py", line 42, in <module>
    move_file(entry, target_folder)
  File "organize.py", line 17, in move_file
    shutil.move(src, dest)
FileNotFoundError: [Errno 2] No such file or directory: 'C:\\dev\\inbox\\report.pdf'
```

Extract the three clues without knowing any Python: the **category** (`FileNotFoundError` — something tried to use a file that isn't there), the **location** (`organize.py`, line 17, inside `move_file`, which was called from line 42), and the **specifics** (the exact path it looked for). That's already a good bug report: "the script fails at line 17 trying to move `report.pdf`, which doesn't exist at that path — maybe it was already moved, or the path is built wrong." Paste the whole trace to Claude and say exactly that — you've just done the *isolate* step of debugging.

*Why it matters:* you'll stop saying "it doesn't work" (which forces guessing) and start handing over the error, the steps to reproduce it, and a way to verify the fix — which is the difference between a frustrating session and a five-minute one.

> **Module 0 takeaway.** You're not learning to code; you're learning enough to *direct and audit* something that codes for you. The payoff is concentrated in two habits: read every diff well enough to judge intent and risk (0.2), and define a runnable "done" before you start (0.5, 0.7). Everything in the rest of this course leans on those.

> **Milestone — Module 0:** Ask Claude (in chat) for a 10-line code diff containing one deliberate mistake, and try to spot it using only 0.2's building blocks before asking for the answer. **You should now be able to:** read a small diff for intent and risk, sketch the client→API→database round trip, and name the three clues in any error message.

-----

## MODULE 1: THE CLAUDE ECOSYSTEM — CHAT, COWORK, AND CLAUDE CODE

Anthropic isn't one product anymore. Knowing which surface to open for a given task is the single highest-leverage habit in this whole course, and it's where most people waste effort by reaching for the wrong one. They all run on the same underlying model — the difference is what each one can *do* and where it works.

### 1.0 — What Claude Code Is, and Why a Non-Coder Can Use It

Before the surface map, the thing itself. Per the official overview, Claude Code is "an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools." **"Agentic" means it acts like an agent:** it takes a goal, decides which steps to take, uses tools (reading files, running commands), looks at the results, and tries again — rather than producing one block of text and stopping. The best beginner analogy (eesel AI): **"a brilliant junior developer who lives inside your terminal."** Because it operates on your machine, it can take direct action — edit files, run commands, create Git commits — instead of just talking back.

How that differs from chat, in one image (Dan Shipper, Every): the chat app is "like a hotel room… you start fresh each time. Claude Code is like having your own apartment with AI in it." And one honest caveat worth keeping (XDA's non-coder field test): for pure one-shot "build this from scratch" tasks, "you're just using a regular Claude that happens to save its output as a file" — the real advantage shows up when Claude reads your actual files, runs things, and iterates against feedback. Configuration and iteration are the differentiator, not the one-shot build.

**And the reason this course exists at all:** Anthropic's own usage research ("How Claude Code is used in practice," ~400,000 sessions from ~235,000 people, Oct 2025–Apr 2026) found that people in software occupations reach verified success in about 30% of sessions while people from *other* professions reach about 26% — nearly the same rate — and management occupations scored slightly *above* engineers, possibly because directing an agent is a management skill. The study's key line: expertise is task-specific — "an accountant who has never used Python, but tells Claude exactly which reconciliation rules a Python script must enforce… is an expert at that task." You already have domain expertise; this course adds the directing-and-verifying layer. *(These figures are from the named Anthropic study; treat as directional.)*

### 1.1 — The "Ask / Do / Build" model

- **Ask → Claude chat** (claude.ai in a browser, or the Claude app on desktop/iPhone). Conversational. You ask, it answers. It can search the web, analyze images and files you upload, create files, and run code in a limited way — but it doesn't autonomously work on the files on your computer. Use it for quick questions and brainstorming; it's your thinking partner, not your task executor.
- **Do → Cowork** (a mode in the Claude desktop app). Agentic knowledge work on your actual machine: organizing files, turning notes into a report, extracting data from PDFs into a spreadsheet, running a task on a schedule. It runs inside an isolated virtual machine, sandboxed from your system, which makes it safer than giving an AI direct filesystem access. No terminal required. **Corrected from earlier drafts: Cowork is on Windows** — it launched on Windows February 10, 2026 with full feature parity to macOS and reached general availability on both platforms April 9, 2026.
- **Build → Claude Code** (terminal, IDE extension, the desktop "Code" tab, or the web). The agent that reads your whole codebase, makes coordinated changes across many files, runs commands and tests, commits, and opens pull requests. This is the focus of the course.

The one-line memory aid that the community has converged on: **chat to think, Cowork to delegate, Code to build.**

### 1.2 — "Is chatting to Claude Code the same as the chat window?" (your question, answered)

Same brain, different powers and different context. They are not interchangeable.

The chat window is conversational and lives anywhere — browser or app, no setup. Claude Code is *agentic*: it has tools (read/write files, run shell commands, use Git) and it's scoped to a **working folder**. That scoping is the practical catch — a session starts scoped to a working folder (switchable later with `/cd`), which is how it knows which files to read and which CLAUDE.md to follow. So you *can* use Claude Code as a chatbot (many people do), but for a quick one-off question you'd have to open a terminal and navigate to a folder first, which is why reaching for the chat app is simply more convenient when the AI doesn't need to touch anything on your computer.

Worth knowing: the **desktop "Code" tab** is Claude Code with a friendlier interface — it's Claude Code with a desktop UI, adding a visual diff view and a cleaner chat interface than the terminal. Same engine as the CLI, just easier to look at. If the terminal ever feels like the obstacle, that's your bridge.

### 1.3 — Your "plan in chat, then build in Code" workflow is a recommended pattern

The habit you already have — talking to chat first to map out the approach, then moving to Claude Code — is exactly right, not a workaround. The recommended pattern is to use Chat for exploration: when you're still figuring out what you need, Chat helps you clarify the goal before handing off to Code. Chat is a low-stakes place to think out loud, pressure-test an idea, and rough out a plan; Claude Code is where that plan gets executed against real files.

Two upgrades to that workflow:

- **Use a Project for the thinking phase.** Claude.ai **Projects** are a persistent workspace with custom instructions, uploaded reference material, and memory across chats — so your planning conversations and reference docs stay in one place instead of scattered across one-off chats. (You're in one right now.) Plan in a Project, then carry the resulting spec into Claude Code.
- **Hand off a written artifact, not a memory.** End the chat phase by having Claude write the plan to a file (a `SPEC.md` or a short brief). Claude Code starts fresh with no memory of your chat conversation, so the plan has to travel as text. This is the clean handoff (more in Module 6).

**Projects vs Skills, since both hold "context":** a Project is a persistent *context container* — custom instructions, uploaded reference files, and memory that scope a set of chats to one body of work. A Skill is a portable *procedure* — "here's how I do this repeatable task" — that travels with you across Chat, Cowork, and Code (1.4). Projects hold what Claude should *know*; skills hold how Claude should *do* a thing. They compose: plan inside a Project with your methodology skills enabled.

### 1.4 — Where Skills and Plugins live across surfaces (and your stock-chart question)

This is the part you were unsure about, and the answer is the reverse of what you guessed.

**Skills work everywhere.** Skills work across Chat, Cowork, and Claude Code, and that composability is a key advantage; reportedly up to five can be active at once in a single conversation (a secondary-source figure). Officially, Skills are available on Free, Pro, Max, Team, and Enterprise plans, the feature requires code execution to be enabled, and it's in beta for Claude Code and for API users. So your assumption that you can't use skills in the chat window is outdated — you can, as long as "Code execution and file creation" is turned on. A skill is just a packaged procedure or body of knowledge ("here's how I want this kind of task handled"), and Claude adapts a skill to whatever surface it's in — the same skill might produce a Word document in one place and a detailed data breakdown in another.

**Plugins do not work in chat.** This is the real surface restriction to remember: plugins install into Cowork and can run via the Claude Code CLI, but they don't run on the claude.ai website. A plugin is a bundle (skills + connectors + hooks), so the bundled experience is a Cowork/Code thing.

**Now your example — building a stock technical-analysis tool.** The key insight: *skills are not the reason to choose Code or Cowork over chat, because skills work in all three.* What separates the surfaces is execution and file access. Concretely:

- In **chat**, you can upload a chart image and have Claude reason about it — support and resistance, a 200-day moving-average crossover, what a pattern might suggest. With a **skill** that encodes *your* methodology ("how I read a 200-day MA, which conditions I treat as entry or exit markers"), Claude applies that same lens every time without you re-explaining it. Great for interpreting and learning, one chart at a time.
- In **Claude Code or Cowork**, that identical skill still applies — *plus* the agent can actually run code: pull historical price data, compute the moving averages itself, generate an annotated chart, or backtest your rule against a CSV of past prices and hand you a spreadsheet or report. That's the leap. Chat *reasons about* the analysis; Code/Cowork can *compute it and produce deliverables.*

So the honest answer to "is Code/Cowork better than chat here, because of skills?" — it's better when you need **computation, data, or a file as output**, not because of skills (those travel with you). If you just want Claude to interpret a chart you paste in, chat with your skill enabled is the lighter tool. If you want it to fetch data, calculate indicators, and produce a backtest, that's Claude Code (or Cowork for a no-terminal version). And don't over-build: a skill is worth creating for a method you'll reuse — for a one-off question, just ask.

> **A note, not advice:** this is about how to *build* analysis tooling, not a suggestion to trade on it. A backtested rule describes the past, not the future, and markets carry real risk. The software lesson holds regardless of the subject: skills encode a repeatable method; the surface determines whether Claude can also do the heavy computation and produce the file.

### 1.5 — When to pull in Cowork from a Code-centric workflow

You're focused on Claude Code, which is right for building. Reach for **Cowork** specifically when the task is *get something done with the files and apps already on your computer* rather than *build a project*: triaging a messy folder, extracting data out of a stack of PDFs, turning a directory of notes into a formatted report, or running a recurring desktop chore. Cowork makes the most sense for someone who works primarily with documents and doesn't have a developer setup; heavy Claude Code users often find Code already covers these once it has the right access — Claude Code can replace Cowork for many tasks when you give it the same connectors, plugins, and skills. Practical rule: if it needs your existing files/apps and *no* real codebase, Cowork is the low-friction choice; if it's a project you're building and iterating on, stay in Code.

### 1.6 — Quick decision guide

- A question, an explanation, a draft, or brainstorming an approach → **Chat** (and keep the planning in a Project).
- A finished document, organized files, data pulled out of PDFs, or a scheduled desktop chore → **Cowork**.
- Anything where code gets written, run, debugged, deployed, or version-controlled → **Claude Code**.
- Still figuring out what you want → **Chat first**, then hand a written plan to Code.

> **Milestone — Module 1:** Route three of your own real tasks through this decision guide (one *ask*, one *do*, one *build*) and notice which surface you'd have wrongly defaulted to. **You should now be able to:** pick the right surface without thinking, and explain why skills travel across surfaces but plugins don't.


-----

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

# GLOSSARY

## Part 1 — Software fundamentals (read alongside Module 0)

- **API (Application Programming Interface)** — the defined set of requests a server agrees to answer; how separate programs talk to each other.
- **Array / list** — an ordered collection of values, e.g. `["red","green","blue"]`.
- **Backend** — the server-side logic and data a user never sees directly.
- **Bug** — a mistake that makes a program behave wrong or crash.
- **CI (Continuous Integration)** — an automated system that runs your tests and checks every time code is pushed, so broken changes get caught before they merge; "the CI is failing" means those automated checks found a problem.
- **Client** — the program in front of the user (usually the browser) that sends requests.
- **Compile / compiled language** — translating code ahead of time into a machine-native file (binary) the computer runs directly (e.g. Rust, Go).
- **Conditional** — a decision point in code (`if`/`else`) that selects which branch runs.
- **Database** — structured, persistent storage the backend reads from and writes to.
- **Dependency / package** — external code your project relies on, installed and tracked via a manifest.
- **Deploy / deployment** — publishing your project to a live server so anyone can reach it at a public URL.
- **Diff** — a line-by-line view of what changed between two versions of a file (red removed, green added).
- **Environment (dev vs production)** — where you build/test (dev) vs the live version real users see (production).
- **Fixture** — a known-good sample input or expected output saved in the project, used by tests to compare against ("diff the output against a fixture").
- **Framework** — a structure you build inside that calls your code and dictates the overall shape (e.g. React, Astro).
- **Frontend** — everything the user sees and clicks, running in the browser (HTML/CSS/JavaScript).
- **Function** — a named, reusable block of steps that takes inputs and usually returns an output.
- **HTTP / HTTPS** — the request/response protocol browsers use to fetch pages; the `s` means encrypted.
- **Injection** — an attack that sneaks commands in through user input; prevented by input validation.
- **Interpret / interpreted language** — code read and run on the fly by an interpreter, with no separate build step (e.g. JavaScript, Python).
- **JSON** — the plain-text format data usually travels in: labeled fields and lists, e.g. `{"name":"Sam"}`.
- **Library** — a bag of pre-built tools you call when you want them.
- **Linter** — a tool that automatically scans code for style problems and common mistakes without running it; a formatter is its cousin that fixes layout.
- **Loop** — "do this for each item" — how programs process lists.
- **npm** — JavaScript's package manager: the tool that installs and tracks a project's dependencies (`npm install`).
- **Object / dictionary** — a value with labeled fields, e.g. `{name:"Sam", age:40}`.
- **Race condition** — a bug where two things happen in an unpredictable order and the code only works if they happen in one particular order; notoriously intermittent and hard to reproduce.
- **Refactor** — restructuring code to make it cleaner or simpler without changing what it does; tests are what prove the behavior didn't change.
- **Request / response** — a client asking a server for something and the server answering.
- **Runtime** — the environment that executes a program (e.g. Node.js runs JavaScript outside the browser).
- **SaaS (Software as a Service)** — software sold as a hosted subscription used in the browser, rather than a program you install and own.
- **Scaffolding** — generating the boilerplate skeleton of a project (folders, config, starter files) before the real features are built.
- **Secret** — an API key, password, or token that must stay out of code (use environment variables).
- **Server** — a computer elsewhere that holds data and does work the client requests.
- **Stack trace** — the breadcrumb trail of what a program was doing when it failed, most-recent step on top.
- **State** — "what's true right now" in a program (who's logged in, what's in the cart).
- **Static site** — a site of fixed files served as-is to every visitor, no per-request computation.
- **Technical debt** — the accumulated cost of quick-and-dirty choices: code that works now but is messy or duplicated, making every future change slower until it's cleaned up.
- **Type checking ("typecheck")** — an automated pass that verifies data types line up (e.g. you're not passing text where a number is expected) without running the program; catches a whole class of bugs early.
- **Variable** — a named box that holds a value.

## Part 2 — Claude Code & Infrastructure

- **Agentic** — an AI that takes a goal, chooses steps, uses tools, checks results, and iterates, rather than producing one block of text and stopping.
- **CDN (Content Delivery Network)** — globally distributed servers that cache your site's files so visitors load them from nearby.
- **CLI (Command-Line Interface)** — driving a program by typing text commands rather than clicking.
- **Fan-out** — splitting one big job into many parallel sub-jobs (e.g. looping `claude -p` over many files).
- **Headless / non-interactive mode** — running Claude Code without the chat UI by passing the prompt on the command line (`claude -p`), so it runs in scripts/CI.
- **IDE (Integrated Development Environment)** — a text editor plus built-in tools for running/debugging code (e.g. VS Code).
- **JSONL (JSON Lines)** — a file with one JSON record per line; how Claude Code stores session logs (why session files get large).
- **Monorepo** — one repository holding multiple projects/packages together (hence parent/child CLAUDE.md files).
- **REPL (Read-Eval-Print Loop)** — an interactive prompt that reads input, acts, prints the result, and waits — keeping context across turns. Typing `claude` opens one.
- **TLS** — the encryption layer underneath HTTPS; "sent over TLS" means transmitted encrypted.
- **Tracer bullet** — a thin end-to-end slice built early to prove the whole path works.
- **TUI (Text User Interface)** — a keyboard-driven interface drawn with text in the terminal.
- **Vertical slice** — a feature built through every layer at once (database + logic + UI), vs. building one whole layer at a time.
- **WSL (Windows Subsystem for Linux)** — a real Linux environment inside Windows; needed for OS-level sandboxing, no longer required to install Claude Code.
- **Worktree (git worktree)** — multiple working folders checked out from one Git repo at once, so parallel sessions don't overwrite each other.

*End of guide.*
