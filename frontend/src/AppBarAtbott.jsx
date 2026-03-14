import { AppBar, Toolbar, Typography } from "@mui/material";

export default function AppBarAtbott({ project, onExit }) {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#000" }}>
      <Toolbar sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <img src="/logo_atbott.png" alt="atBott Logo" style={{ height: 40 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          {project ? project : "Atbott SaaS Workspace"}
        </Typography>
        {onExit && (
          <button
            style={{ background: "#2196f3", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer" }}
            onClick={onExit}
          >
            Dashboard
          </button>
        )}
      </Toolbar>
    </AppBar>
  );
}
