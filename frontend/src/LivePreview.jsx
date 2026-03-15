import { useState, useEffect } from "react";

export default function LivePreview({ html }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);
    setUrl(blobUrl);
    return () => URL.revokeObjectURL(blobUrl);
  }, [html]);

  if (!html) {
    return <div style={{ color: "#999", padding: 10 }}>Live Preview: waiting for HTML output...</div>;
  }

  return (
    <iframe
      src={url}
      style={{ width: "100%", height: "100%", border: "none", background: "#fff" }}
      title="Live Preview"
    />
  );
}
