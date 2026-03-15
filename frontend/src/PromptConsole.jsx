import { useState } from "react";
import axios from "axios";

export default function PromptConsole({ onHtmlOutput }) {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const runPrompt = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("/ai_agent/run", { task: prompt });
      const text = res.data.content?.[0]?.text || JSON.stringify(res.data);
      setOutput(text);
      const htmlMatch = text.match(/<html[\s\S]*<\/html>/i);
      if (htmlMatch) onHtmlOutput(htmlMatch[0]);
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
      <textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Describe what to build (e.g., Create a login page with dark theme)..."
        style={{ width: "100%", height: 80, background: "#222", color: "#fff", border: "1px solid #444", borderRadius: 4, padding: 10, resize: "none", boxSizing: "border-box" }}
        onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) runPrompt(); }}
      />
      <button
        onClick={runPrompt}
        disabled={loading}
        style={{ marginTop: 8, background: "#16A0C6", color: "#fff", border: "none", borderRadius: 4, padding: "6px 14px", cursor: "pointer", alignSelf: "flex-start" }}
      >
        {loading ? "Running Claude..." : "Run Prompt"}
      </button>
      <pre style={{ marginTop: 12, whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: 13, flex: 1, overflow: "auto", color: "#ccc" }}>{output}</pre>
    </div>
  );
}
