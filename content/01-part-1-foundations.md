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

