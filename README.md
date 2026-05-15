# Site Annotate

A zero-dependency, drop-in visual annotation widget for collecting page feedback for AI coding agents. **Works on static sites only** — it reads and writes to `localStorage` and injects UI directly into the DOM.

## Demo

> TODO: add GIF or screenshot of the widget in action

## Quick start

### Option 1: Ask your coding agent

Paste this prompt into Claude Code, Codex, OpenCode, Pi, or any agent with file-editing capabilities:

```
Add the Site Annotate widget to this project. Download https://raw.githubusercontent.com/fariqussalam/site-annotate/main/dist/annotator.js into scripts/annotator.js and inject <script src="scripts/annotator.js"></script> before the closing </body> tag.
```

### Option 2: Copy the built file

Download `dist/annotator.js` and include it before `</body>`:

```html
<script src="scripts/annotator.js"></script>
```

### Option 3: Clone and build

```bash
git clone https://github.com/fariqussalam/site-annotate.git
cd site-annotate
npm install
npm run build
```

Then copy `dist/annotator.js` into your static site.

## Use

The annotator adds a floating toolbar. Press **Cmd/Ctrl + Shift + A** to enter selection mode, click an element, add feedback, then copy annotations as Markdown.

Annotations are stored in `localStorage` under `siteannotate:annotations`.

## Development

```bash
npm install
npm run build
```

Then open `demo/index.html` in your browser.
