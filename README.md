# Mermaid Anywhere — Chrome Extension

Render [Mermaid](https://mermaid.js.org/) diagrams on any web page. Automatically detects Mermaid code blocks on ChatGPT, GitHub, Stack Overflow, Confluence, and any other site — and replaces them with beautifully rendered SVG diagrams.

Built by [Starmorph](https://starmorph.com) · Full editor at [mermaideditor.io](https://mermaideditor.io)

## Features

- **Auto-detection** — Finds Mermaid code blocks via CSS class selectors and keyword matching
- **Live rendering** — Renders diagrams using Mermaid.js 11.x in an offscreen document
- **Style isolation** — Shadow DOM prevents style leakage between the page and rendered diagrams
- **SPA support** — MutationObserver catches dynamically loaded content (ChatGPT, Confluence)
- **Toolbar** — Edit in [Mermaid Editor](https://mermaideditor.io), Copy SVG, Show/Hide Code toggle on every diagram
- **Zero data collection** — No analytics, no telemetry, no tracking

## Supported Sites

Works on any site with Mermaid code blocks, including:

- ChatGPT / Claude / AI assistants
- GitHub (issues, PRs, README files)
- Stack Overflow
- Confluence / Jira
- Notion (exported pages)
- Any page with `language-mermaid` code blocks

## Architecture

```
Content Script (any page) → Service Worker → Offscreen Document (mermaid.js) → SVG back to Content Script
```

Mermaid v10+ uses `Function()` internally, which is blocked by Chrome extension CSP. The offscreen document pattern provides relaxed CSP with full DOM access, solving this cleanly without forking Mermaid.

## Development

```bash
pnpm install
pnpm dev       # Start dev server with HMR
pnpm build     # Production build to dist/
```

### Load in Chrome

1. Run `pnpm build`
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" → select the `dist/` folder

## Tech Stack

- TypeScript + Vite + [@crxjs/vite-plugin](https://crxjs.dev/vite-plugin)
- Manifest V3 (service worker + offscreen document)
- [Mermaid.js](https://mermaid.js.org/) 11.4.1
- Shadow DOM for style isolation

## Permissions

| Permission | Why |
|---|---|
| `activeTab` | Access the current tab to detect and render Mermaid code blocks |
| `offscreen` | Create an offscreen document for Mermaid.js rendering (CSP workaround) |

## Privacy

This extension collects zero user data. All rendering happens locally on your device. See [Privacy Policy](https://mermaideditor.io/privacy).

## Related

- [Mermaid Editor](https://mermaideditor.io) — Full-featured online Mermaid diagram editor with AI, live preview, and export
- [Mermaid.js](https://mermaid.js.org/) — The diagramming library that powers this extension

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

## License

[MIT](LICENSE)
