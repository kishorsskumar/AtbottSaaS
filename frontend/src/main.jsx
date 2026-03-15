import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import Login from "./Login";
import ProjectsDashboard from "./ProjectsDashboard";
import FileManager from "./FileManager";
import AppBarAtbott from "./AppBarAtbott";
import LivePreview from "./LivePreview";
import PromptConsole from "./PromptConsole";
import "./styles/theme.css";

function RootApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState("");
  const [htmlOut, setHtmlOut] = useState("");

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

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0d1117" }}>
      <AppBarAtbott project={project} onExit={() => setProject("")} />
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ width: "25%", minWidth: 220, borderRight: "1px solid #333", overflow: "hidden" }}>
          <FileManager basePath={`projects/${project}`} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <LivePreview html={htmlOut} />
          </div>
        </div>
      </div>
      <div style={{ height: 220, minHeight: 150 }}>
        <PromptConsole onHtmlOutput={setHtmlOut} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<RootApp />);
