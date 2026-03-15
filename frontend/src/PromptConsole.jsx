import { useState } from "react";
import axios from "axios";

function extractHtml(text) {
  const fenceMatch = text.match(/```html\s*([\s\S]*?)```/i);
  if (fenceMatch) return fenceMatch[1].trim();

  const fullMatch = text.match(/<!DOCTYPE html[\s\S]*<\/html>/i);
  if (fullMatch) return fullMatch[0].trim();

  const htmlTagMatch = text.match(/<html[\s\S]*<\/html>/i);
  if (htmlTagMatch) return htmlTagMatch[0].trim();

  if (/<(?:div|section|header|main|body|form|table|ul|h[1-6])\b/i.test(text)) {
    const bodyContent = text.replace(/```[\s\S]*?```/g, '').trim();
    if (bodyContent.length > 50) {
      return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:sans-serif;margin:20px;}</style></head><body>${bodyContent}</body></html>`;
    }
  }

  return null;
}

export default function PromptConsole({ onHtmlOutput }) {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const runPrompt = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await axios.post("/ai_agent/run", { task: prompt });
      const text = res.data.content?.[0]?.text || JSON.stringify(res.data);
      setOutput(text);
      const html = extractHtml(text);
      if (html) onHtmlOutput(html);
    } catch (e) {
      setOutput("Error: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: "#111", color: "#fff",
      borderTop: "1px solid #333", padding: 10,
      display: "flex", flexDirection: "column", height: "100%"
    }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe what to build (e.g., Create a login page with dark theme)..."
          style={{ flex: 1, height: 60, background: "#222", color: "#fff", border: "1px solid #444", borderRadius: 4, padding: 10, resize: "none", boxSizing: "border-box", fontSize: 14 }}
          onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) runPrompt(); }}
        />
        <button
          onClick={runPrompt}
          disabled={loading}
          style={{ background: loading ? "#555" : "#16A0C6", color: "#fff", border: "none", borderRadius: 4, padding: "10px 18px", cursor: loading ? "wait" : "pointer", fontWeight: "bold", whiteSpace: "nowrap" }}
        >
          {loading ? "Running..." : "Run Prompt"}
        </button>
      </div>
      <pre style={{ marginTop: 8, whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: 12, flex: 1, overflow: "auto", color: "#aaa", maxHeight: 100 }}>{output}</pre>
    </div>
  );
}
