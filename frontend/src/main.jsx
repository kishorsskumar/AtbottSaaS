import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import Login from "./Login";
import ProjectsDashboard from "./ProjectsDashboard";
import { FileProvider, FileTree, CodeEditor } from "./FileManager";
import AppBarAtbott from "./AppBarAtbott";
import LivePreview from "./LivePreview";
import PromptConsole from "./PromptConsole";
import "./styles/theme.css";

function Workspace({ project, onExit }) {
  const [htmlOut, setHtmlOut] = useState("");

  return (
    <FileProvider basePath={`projects/${project}`}>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0d1117" }}>
        <AppBarAtbott project={project} onExit={onExit} />
        <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
          <div style={{ width: 220, minWidth: 180, maxWidth: 280, borderRight: "1px solid #30363d", overflow: "hidden" }}>
            <FileTree />
          </div>
          <div style={{ flex: 1, borderRight: "1px solid #30363d", overflow: "hidden" }}>
            <CodeEditor />
          </div>
          <div style={{ flex: 1, overflow: "hidden", background: "#fff" }}>
            <LivePreview html={htmlOut} />
          </div>
        </div>
        <div style={{ height: 180, borderTop: "1px solid #30363d", flexShrink: 0 }}>
          <PromptConsole onHtmlOutput={setHtmlOut} />
        </div>
      </div>
    </FileProvider>
  );
}

function RootApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState("");

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProject("");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return <Login onLogin={setUser} />;

  const userEmail = user.email || user?.user_metadata?.email || "admin";

  if (!project) {
    return <ProjectsDashboard user={userEmail} onOpen={setProject} onLogout={handleLogout} />;
  }

  return <Workspace project={project} onExit={() => setProject("")} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<RootApp />);
