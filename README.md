# Site Annotate

zero-dependency, drop-in visual annotation widget for collecting page feedback for AI coding agents. **Only Tested on html static sites**.

## Demo

[Demo](https://github.com/user-attachments/assets/ed248857-c98f-4ad2-9a45-8324a6996c75)

## Quick start

### Option 1: Ask your coding agent

Paste this prompt into Claude Code, Codex, OpenCode, Pi, etc:

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

## Usage

The annotator adds a floating toolbar. Click annotate, click an element, add feedback, then copy annotations as Markdown.

## Development

```bash
npm install
npm run build
```

Then open `demo/index.html` in your browser.
