import mermaid from "mermaid"
import type { RenderRequest, RenderResponse } from "../shared/messages"

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
})

/** Listen for render requests forwarded from the service worker (target: "offscreen") */
chrome.runtime.onMessage.addListener(
  (message: RenderRequest, _sender: chrome.runtime.MessageSender, sendResponse: (r: RenderResponse) => void) => {
    if (message.type !== "RENDER_REQUEST" || message.target !== "offscreen") return false

    renderDiagram(message.id, message.code)
      .then(sendResponse)
      .catch((err) => {
        sendResponse({
          type: "RENDER_RESPONSE",
          id: message.id,
          error: err instanceof Error ? err.message : "Render failed",
        })
      })

    return true
  }
)

async function renderDiagram(
  id: string,
  code: string
): Promise<RenderResponse> {
  try {
    const { svg } = await mermaid.render(id, code)
    return { type: "RENDER_RESPONSE", id, svg }
  } catch (err) {
    return {
      type: "RENDER_RESPONSE",
      id,
      error: err instanceof Error ? err.message : "Invalid diagram syntax",
    }
  }
}
