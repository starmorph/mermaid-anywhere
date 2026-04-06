import { detectMermaidBlocks } from "./detector"
import { injectDiagram } from "./injector"

/** Track processed elements to avoid re-rendering */
const processed = new WeakSet<HTMLElement>()

/** Scan the page for Mermaid code blocks and render them */
function scan(root: ParentNode = document): void {
  const blocks = detectMermaidBlocks(root)

  for (const block of blocks) {
    if (processed.has(block)) continue
    processed.add(block)
    injectDiagram(block)
  }
}

// Initial scan on page load
scan()

// Watch for dynamically added content (ChatGPT, Confluence, SPAs)
let scanTimer: ReturnType<typeof setTimeout> | null = null

const observer = new MutationObserver(() => {
  if (scanTimer) clearTimeout(scanTimer)
  scanTimer = setTimeout(() => scan(), 200)
})

observer.observe(document.body, {
  childList: true,
  subtree: true,
})
