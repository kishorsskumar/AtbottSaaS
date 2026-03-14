import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Login from "./Login";
import ProjectsDashboard from "./ProjectsDashboard";
import FileManager from "./FileManager";
import AppBarAtbott from "./AppBarAtbott";
import "./styles/theme.css";

function RootApp() {
  const [user, setUser] = useState("");
  const [project, setProject] = useState("");

  if (!user) return <Login onLogin={setUser} />;
  if (!project) return <ProjectsDashboard user={user} onOpen={setProject} onLogout={() => setUser("")} />;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBarAtbott project={project} onExit={() => setProject("")} />
      <div style={{ flex: 1, overflow: "hidden" }}>
        <FileManager basePath={`projects/${project}`} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<RootApp />);
