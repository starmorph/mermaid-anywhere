/** Shadow DOM styles — exported as string so we avoid loading CSS files */
export const SHADOW_STYLES = `
  :host {
    all: initial;
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #e2e8f0;
  }

  .loader {
    padding: 24px;
    text-align: center;
    color: #94a3b8;
    font-size: 13px;
    background: #1e293b;
    border-radius: 8px;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  .error {
    padding: 12px 16px;
    background: #450a0a;
    color: #fca5a5;
    border-radius: 8px;
    font-size: 13px;
    border: 1px solid #7f1d1d;
  }

  .diagram {
    background: #0f172a;
    border-radius: 8px 8px 0 0;
    padding: 16px;
    overflow-x: auto;
    display: flex;
    justify-content: center;
  }

  .diagram svg {
    max-width: 100%;
    height: auto;
  }

  .toolbar {
    display: flex;
    gap: 8px;
    padding: 8px 12px;
    background: #1e293b;
    border-top: 1px solid #334155;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    text-decoration: none;
    transition: background 0.15s, opacity 0.15s;
    line-height: 1.4;
  }

  .btn:hover {
    opacity: 0.85;
  }

  .btn-primary {
    background: #7c3aed;
    color: #fff;
  }

  .btn-secondary {
    background: #334155;
    color: #cbd5e1;
  }

  .code-block {
    background: #0f172a;
    color: #94a3b8;
    padding: 16px;
    border-radius: 8px 8px 0 0;
    font-family: "Fira Code", "JetBrains Mono", monospace;
    font-size: 13px;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-x: auto;
    margin: 0;
  }

  .branding {
    padding: 4px 12px;
    background: #1e293b;
    color: #475569;
    font-size: 10px;
    text-align: right;
    border-radius: 0 0 8px 8px;
    border-top: 1px solid #334155;
  }
`
