import { useEffect, useState } from "react";
import axios from "axios";

export default function ProjectsDashboard({ user, onOpen, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");

  const refresh = async () => {
    const res = await axios.get("/projects/");
    setProjects(res.data.projects);
  };
  useEffect(() => { refresh(); }, []);

  const create = async () => {
    if (!name.trim()) return;
    await axios.post("/projects/create", { name });
    setName("");
    refresh();
  };
  const del = async (n) => {
    await axios.delete("/projects/delete", { data: { name: n } });
    refresh();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f6f9fc" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e8eb", padding: "12px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <img src="/logo_atbott.png" alt="atBott Logo" style={{ height: 40 }} />
        <span style={{ fontWeight: 700, fontSize: 18, color: "#111" }}>Atbott SaaS Project Dashboard</span>
        <span style={{ marginLeft: "auto", color: "#555", fontSize: 14 }}>{user}</span>
        <button onClick={onLogout} style={{ background: "none", border: "1px solid #ccc", borderRadius: 6, padding: "6px 14px", cursor: "pointer", color: "#555", fontSize: 13 }}>
          Logout
        </button>
      </div>
      <div style={{ padding: 32, maxWidth: 700, margin: "0 auto" }}>
        <div style={{ marginBottom: 20, display: "flex", gap: 8 }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="New project name"
            style={{ padding: "10px 14px", border: "1px solid #ccc", borderRadius: 6, flex: 1, fontSize: 14 }}
            onKeyDown={e => e.key === "Enter" && create()}
          />
          <button className="btn-primary" onClick={create}>
            Create
          </button>
        </div>
        <div>
          {projects.map(p => (
            <div key={p} className="card" style={{ display: "flex", alignItems: "center", marginBottom: 12, padding: "14px 20px" }}>
              <span onClick={() => onOpen(p)} style={{ cursor: "pointer", flex: 1, color: "#16A0C6", fontSize: 15, fontWeight: 600 }}>
                {p}
              </span>
              <button onClick={() => del(p)} style={{ background: "#e53935", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>
                Delete
              </button>
            </div>
          ))}
        </div>
        {projects.length === 0 && <p style={{ color: "#999", textAlign: "center", marginTop: 40 }}>No projects yet. Create one above.</p>}
      </div>
    </div>
  );
}
