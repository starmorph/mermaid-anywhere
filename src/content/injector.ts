import type { RenderResponse } from "../shared/messages"
import { buildEditorUrl } from "../shared/constants"
import { SHADOW_STYLES } from "./styles"

let renderCounter = 0

/** Replace a code block element with a rendered Mermaid diagram */
export async function injectDiagram(element: HTMLElement): Promise<void> {
  const code = (element.textContent || "").trim()
  if (!code) return

  const id = `mermaid-anywhere-${++renderCounter}`

  // Create host element
  const host = document.createElement("div")
  host.setAttribute("data-mermaid-anywhere", id)
  host.style.cssText = "margin: 8px 0; border-radius: 8px; overflow: hidden;"

  // Attach Shadow DOM
  const shadow = host.attachShadow({ mode: "open" })

  // Inject styles
  const style = document.createElement("style")
  style.textContent = SHADOW_STYLES
  shadow.appendChild(style)

  // Loading skeleton
  const loader = document.createElement("div")
  loader.className = "loader"
  loader.textContent = "Rendering diagram..."
  shadow.appendChild(loader)

  // Replace original element
  const parent = element.closest("pre") || element
  parent.parentNode?.replaceChild(host, parent)

  // Request render from service worker
  try {
    const response = await chrome.runtime.sendMessage({
      type: "RENDER_REQUEST",
      target: "background",
      id,
      code,
    }) as RenderResponse

    loader.remove()

    if (response.error) {
      const errorEl = document.createElement("div")
      errorEl.className = "error"
      errorEl.textContent = `Mermaid error: ${response.error}`
      shadow.appendChild(errorEl)
      return
    }

    if (response.svg) {
      // Diagram container
      const diagram = document.createElement("div")
      diagram.className = "diagram"
      diagram.innerHTML = response.svg
      shadow.appendChild(diagram)

      // Toolbar
      const toolbar = createToolbar(code, response.svg)
      shadow.appendChild(toolbar)

      // Branding
      const branding = document.createElement("div")
      branding.className = "branding"
      branding.textContent = "Rendered by Mermaid Anywhere"
      shadow.appendChild(branding)
    }
  } catch (err) {
    loader.remove()
    const errorEl = document.createElement("div")
    errorEl.className = "error"
    errorEl.textContent = `Extension error: ${err instanceof Error ? err.message : "Unknown error"}`
    shadow.appendChild(errorEl)
  }
}

/** Copy text to clipboard using a temporary textarea (works in content scripts where
 *  navigator.clipboard.writeText is blocked due to Shadow DOM / missing focus) */
function copyToClipboard(text: string): boolean {
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0;"
  document.body.appendChild(textarea)
  textarea.select()
  let ok = false
  try {
    ok = document.execCommand("copy")
  } catch { /* noop */ }
  textarea.remove()
  return ok
}

/** Create the toolbar with Edit, Copy, and Show Code buttons */
function createToolbar(code: string, svg: string): HTMLElement {
  const toolbar = document.createElement("div")
  toolbar.className = "toolbar"

  // Edit in Mermaid Editor
  const editBtn = document.createElement("a")
  editBtn.className = "btn btn-primary"
  editBtn.href = buildEditorUrl(code)
  editBtn.target = "_blank"
  editBtn.rel = "noopener"
  editBtn.textContent = "Edit in Mermaid Editor"
  toolbar.appendChild(editBtn)

  // Copy SVG
  const copyBtn = document.createElement("button")
  copyBtn.className = "btn btn-secondary"
  copyBtn.textContent = "Copy SVG"
  copyBtn.addEventListener("click", () => {
    const success = copyToClipboard(svg)
    copyBtn.textContent = success ? "Copied!" : "Failed"
    setTimeout(() => { copyBtn.textContent = "Copy SVG" }, 2000)
  })
  toolbar.appendChild(copyBtn)

  // Show Code toggle
  const toggleBtn = document.createElement("button")
  toggleBtn.className = "btn btn-secondary"
  toggleBtn.textContent = "Show Code"
  let showingCode = false
  let codeBlock: HTMLElement | null = null

  toggleBtn.addEventListener("click", () => {
    const shadow = toolbar.getRootNode() as ShadowRoot
    const diagram = shadow.querySelector(".diagram") as HTMLElement
    if (!diagram) return

    showingCode = !showingCode

    if (showingCode) {
      diagram.style.display = "none"
      if (!codeBlock) {
        codeBlock = document.createElement("pre")
        codeBlock.className = "code-block"
        codeBlock.textContent = code
        diagram.parentNode?.insertBefore(codeBlock, diagram)
      }
      codeBlock.style.display = "block"
      toggleBtn.textContent = "Show Diagram"
    } else {
      diagram.style.display = "block"
      if (codeBlock) codeBlock.style.display = "none"
      toggleBtn.textContent = "Show Code"
    }
  })
  toolbar.appendChild(toggleBtn)

  return toolbar
}
