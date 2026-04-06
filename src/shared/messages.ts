/** Message types for communication between content script ↔ service worker ↔ offscreen document */

export interface RenderRequest {
  type: "RENDER_REQUEST"
  target: "background" | "offscreen"
  id: string
  code: string
}

export interface RenderResponse {
  type: "RENDER_RESPONSE"
  id: string
  svg?: string
  error?: string
}

export type ExtensionMessage = RenderRequest | RenderResponse
