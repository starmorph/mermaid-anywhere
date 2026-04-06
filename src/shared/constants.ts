/** Mermaid diagram keywords — used to detect untagged code blocks */
export const MERMAID_KEYWORDS = [
  "graph ",
  "graph\n",
  "flowchart ",
  "flowchart\n",
  "sequenceDiagram",
  "classDiagram",
  "stateDiagram",
  "erDiagram",
  "gantt",
  "pie ",
  "pie\n",
  "mindmap",
  "gitGraph",
  "timeline",
  "quadrantChart",
  "xychart-beta",
  "block-beta",
  "sankey-beta",
  "packet-beta",
  "architecture-beta",
  "kanban",
  "journey",
  "requirementDiagram",
  "C4Context",
  "C4Container",
  "C4Component",
  "C4Deployment",
  "C4Dynamic",
  "zenuml",
] as const

export const EDITOR_BASE_URL = "https://mermaideditor.io"

/** Build a URL to open code in Mermaid Editor */
export function buildEditorUrl(code: string): string {
  const encoded = encodeCodeParam(code)
  return `${EDITOR_BASE_URL}/?code=${encoded}&utm_source=extension&utm_medium=chrome&utm_campaign=edit_button`
}

/** base64url encode (same as mermaideditor.io's encodeCodeParam) */
function encodeCodeParam(code: string): string {
  const bytes = new TextEncoder().encode(code)
  const binary = String.fromCharCode(...bytes)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}
