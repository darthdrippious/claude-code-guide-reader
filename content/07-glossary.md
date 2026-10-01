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
