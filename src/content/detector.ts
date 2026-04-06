import { MERMAID_KEYWORDS } from "../shared/constants"

/** CSS selectors that indicate a Mermaid code block */
const MERMAID_SELECTORS = [
  "pre > code.language-mermaid",     // GitHub, dev.to, etc.
  "pre > code.lang-mermaid",         // Some markdown renderers
  "code.mermaid",                     // Generic
  "div.mermaid",                      // Mermaid's own convention
  ".mermaid:not(svg):not(g)",         // Class-based, exclude SVG elements
]

/** Find all unprocessed Mermaid code blocks on the page */
export function detectMermaidBlocks(root: ParentNode = document): HTMLElement[] {
  const results: HTMLElement[] = []

  // 1. Check explicit selectors
  for (const selector of MERMAID_SELECTORS) {
    const elements = root.querySelectorAll<HTMLElement>(selector)
    for (const el of elements) {
      if (!el.closest("[data-mermaid-anywhere]")) {
        results.push(el)
      }
    }
  }

  // 2. Check <pre> blocks for Mermaid keyword patterns
  const preBlocks = root.querySelectorAll<HTMLPreElement>("pre")
  for (const pre of preBlocks) {
    if (pre.closest("[data-mermaid-anywhere]")) continue
    if (results.some((r) => r === pre || pre.contains(r) || r.contains(pre))) continue

    const text = (pre.textContent || "").trimStart()
    if (looksLikeMermaid(text)) {
      results.push(pre)
    }
  }

  return results
}

/** Check if text starts with a known Mermaid keyword */
function looksLikeMermaid(text: string): boolean {
  return MERMAID_KEYWORDS.some((kw) => text.startsWith(kw))
}
