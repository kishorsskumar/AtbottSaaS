import { useEffect, useState } from "react";
import axios from "axios";
import { AppBar, Toolbar, Typography } from "@mui/material";

export default function ProjectsDashboard({ onOpen }) {
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
    await axios.delete("/projects/delete", { data: { name: n }});
    refresh();
  };

  return (
    <div style={{ height: "100vh", background: "#0d1117", color: "#fff" }}>
      <AppBar position="static" sx={{ background: "#000" }}>
        <Toolbar sx={{ gap: 2 }}>
          <img src="/logo_atbott.png" alt="atBott Logo" style={{ height: 48 }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Atbott SaaS Project Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
        <div style={{ marginBottom: 20, display: "flex", gap: 8 }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="New project name"
            style={{ padding: "10px 14px", background: "#161b22", color: "#fff", border: "1px solid #30363d", borderRadius: 6, flex: 1, fontSize: 14 }}
            onKeyDown={e => e.key === 'Enter' && create()}
          />
          <button onClick={create} style={{ padding: "10px 20px", background: "#2196f3", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
            Create
          </button>
        </div>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {projects.map(p => (
            <li key={p} style={{ display: "flex", alignItems: "center", padding: "12px 16px", marginBottom: 8, background: "#161b22", borderRadius: 8, border: "1px solid #30363d" }}>
              <span onClick={() => onOpen(p)} style={{ cursor: "pointer", flex: 1, color: "#58a6ff", fontSize: 15, fontWeight: 500 }}>
                {p}
              </span>
              <button onClick={() => del(p)} style={{ background: "#da3633", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
        {projects.length === 0 && <p style={{ color: "#8b949e", textAlign: "center", marginTop: 40 }}>No projects yet. Create one above.</p>}
      </div>
    </div>
  );
}
