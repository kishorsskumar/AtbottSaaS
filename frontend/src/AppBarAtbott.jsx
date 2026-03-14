export default function AppBarAtbott({ project, onExit }) {
  return (
    <div style={{ background: "#111", padding: "8px 20px", display: "flex", alignItems: "center", gap: 12 }}>
      <img src="/logo_atbott.png" alt="atBott Logo" style={{ height: 36 }} />
      <span style={{ fontWeight: 600, fontSize: 16, color: "#fff", flex: 1 }}>
        {project ? project : "Atbott SaaS Workspace"}
      </span>
      {onExit && (
        <button
          style={{ background: "#16A0C6", color: "#fff", border: "none", padding: "6px 16px", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 }}
          onClick={onExit}
        >
          Dashboard
        </button>
      )}
    </div>
  );
}
