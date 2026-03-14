import { useEffect, useState } from "react";
import axios from "axios";

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
    <div style={{padding:20, background:"#181818", color:"#fff", height:"100vh"}}>
      <h2>Atbott SaaS Project Launcher</h2>
      <div style={{marginBottom: 16}}>
        <input
          value={name}
          onChange={e=>setName(e.target.value)}
          placeholder="New project name"
          style={{padding:"8px 12px", background:"#2a2a2a", color:"#fff", border:"1px solid #444", borderRadius:4, marginRight:8}}
          onKeyDown={e => e.key === 'Enter' && create()}
        />
        <button onClick={create} style={{padding:"8px 16px", background:"#28a", color:"#fff", border:"none", borderRadius:4, cursor:"pointer"}}>
          Create
        </button>
      </div>
      <ul style={{listStyle:"none", padding:0}}>
        {projects.map(p=>(
          <li key={p} style={{display:"flex", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #333"}}>
            <span onClick={()=>onOpen(p)} style={{cursor:"pointer", flex:1, color:"#6cf"}}>
              {p}
            </span>
            <button onClick={()=>del(p)} style={{background:"#a33", color:"#fff", border:"none", borderRadius:4, padding:"4px 10px", cursor:"pointer"}}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      {projects.length === 0 && <p style={{color:"#888"}}>No projects yet. Create one above.</p>}
    </div>
  );
}
