import type { RenderRequest, RenderResponse } from "./shared/messages"

let offscreenReady = false
let idleTimer: ReturnType<typeof setTimeout> | null = null
const IDLE_TIMEOUT = 30_000 // Close offscreen doc after 30s of inactivity

/** Ensure the offscreen document exists */
async function ensureOffscreen(): Promise<void> {
  if (offscreenReady) return

  // Check if already exists
  const contexts = await chrome.runtime.getContexts({
    contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
  })

  if (contexts.length > 0) {
    offscreenReady = true
    return
  }

  await chrome.offscreen.createDocument({
    url: "src/offscreen/offscreen.html",
    reasons: [chrome.offscreen.Reason.DOM_PARSER],
    justification: "Render Mermaid diagrams using mermaid.js (requires DOM + Function())",
  })
  offscreenReady = true
}

/** Close the offscreen document after idle timeout */
function resetIdleTimer(): void {
  if (idleTimer) clearTimeout(idleTimer)
  idleTimer = setTimeout(async () => {
    try {
      await chrome.offscreen.closeDocument()
      offscreenReady = false
    } catch {
      // Already closed
    }
  }, IDLE_TIMEOUT)
}

/** Handle messages from content scripts (target: "background") */
chrome.runtime.onMessage.addListener(
  (message: RenderRequest, _sender: chrome.runtime.MessageSender, sendResponse: (r: RenderResponse) => void) => {
    if (message.type !== "RENDER_REQUEST" || message.target !== "background") return false

    handleRender(message)
      .then(sendResponse)
      .catch((err) => {
        sendResponse({
          type: "RENDER_RESPONSE",
          id: message.id,
          error: err instanceof Error ? err.message : "Unknown error",
        })
      })

    return true // Keep message channel open for async response
  }
)

async function handleRender(request: RenderRequest): Promise<RenderResponse> {
  await ensureOffscreen()
  resetIdleTimer()

  // Forward to offscreen document with target changed
  const response = await chrome.runtime.sendMessage({
    ...request,
    target: "offscreen",
  })
  return response as RenderResponse
}
