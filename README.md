# Guide Reader

A phone- and laptop-friendly reader for long, structured guides written in Markdown. Table of contents, search, display settings, module progress, glossary tooltips, copy buttons for code, image lightbox, text-selection lookup, and offline install (PWA). No backend, no build step.

## How it's organized

| File | Role |
| --- | --- |
| `guide.json` | The only per-guide config: title, storage id, ordered list of content files |
| `content/*.md` | The guide itself, one or more Markdown files |
| `content/images/` | Images, referenced from the Markdown with relative paths |
| `index.html`, `reader.css`, `reader.js`, `sw.js`, `vendor/` | The engine. Same for every guide |
| `manifest.webmanifest`, `icon*.png`, `icon.svg`, `apple-touch-icon.png` | Home-screen install name and icons |

## Make a new guide from this template

1. Copy this repo (GitHub: *Use this template*, or copy the folder) and rename it.
2. Replace the files in `content/` with your Markdown, and list them in order in `guide.json`:
   ```json
   {
     "id": "photo-guide",
     "title": "AI Image Generation & Cinematography",
     "shortTitle": "Photo Guide",
     "files": ["content/module-1.md", "content/module-2.md"]
   }
   ```
   `id` namespaces saved progress and settings. Every GitHub Pages site under the same account shares one browser origin, so give each guide a unique `id`.
3. Update `name`, `short_name` and `description` in `manifest.webmanifest`, and the icons if you want.
4. Push, then enable GitHub Pages (Settings → Pages → deploy from the branch root).

## Writing content

- Headings: `#` for a part (optional, groups the contents list), `##` for a module, `###` for a section. If each file has its own `#` module title, set `{"path": "content/module-1.md", "shift": 1}` in `guide.json` to push every heading down one level.
- Modules are `##` headings that look like `MODULE 3: Title` or `Module 3 - Title`. Those get progress checkboxes and a "Next module" button. A different pattern can be set with `"modules": {"heading": "<regex with 2 capture groups: number, title>"}`.
- Images: `![Figure 1.1 caption](images/lighting-01.jpg)`. The path is relative to the Markdown file. A paragraph that contains only an image becomes a figure, with the alt text as the caption. Tapping an image opens it full screen.
- Glossary (optional): `"glossary": {"heading": "^Part\\s+1"}` marks `##` sections whose list items look like `- **Term** — definition`. Matching terms in the body get tap-for-definition tooltips.
- Lookup menu wording: `"lookupAudience"` sets the sentence that tells the AI who the reader is.

## Converting from Word

```
pandoc module-1.docx -t gfm --wrap=none --extract-media=content/images/module-1 -o content/module-1.md
```

Pandoc writes images as `content/images/module-1/media/image1.png`. Fix the paths in the Markdown to be relative to the file (`images/module-1/media/image1.png`), and add captions as alt text. Resize photos to roughly 1600px wide and compress them before committing; large images are the main thing that makes a guide slow on a phone.

## Running locally

```
python3 -m http.server
```

then open `http://localhost:8000`. Opening `index.html` directly from disk won't work, because browsers block `fetch()` on `file://`.
