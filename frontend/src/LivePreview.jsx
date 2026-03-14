import { useEffect, useRef } from 'react';
export default function LivePreview({ url }) {
  const frame = useRef();
  useEffect(() => { if (frame.current) frame.current.src = url; }, [url]);
  return (
    <div style={{ flex: 1, border: "1px solid #333", marginTop: 10 }}>
      <iframe ref={frame} style={{ width: "100%", height: "100%" }} title="Live Preview" />
    </div>
  );
}
