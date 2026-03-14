import { useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    if (!email || !password) return setError("Please enter email and password.");
    setLoading(true);
    setError("");

    if (isSupabaseConfigured) {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email, password
      });
      setLoading(false);
      if (err) return setError(err.message);
      onLogin(data.session.user);
    } else {
      setLoading(false);
      onLogin({ email });
    }
  };

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      height: "100vh"
    }}>
      <div className="card" style={{ width: 500, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img src="/logo_atbott.png" alt="atBott logo" style={{ height: 80, marginBottom: 30 }} />

        <h3 style={{ marginTop: 0 }}>Sign In to atBott Admin</h3>
        <input placeholder="Email" type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "80%", marginTop: 10, padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
          onKeyDown={e => e.key === "Enter" && signIn()}
        />
        <input placeholder="Password" type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "80%", marginTop: 10, padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
          onKeyDown={e => e.key === "Enter" && signIn()}
        />
        <button className="btn-primary" style={{ marginTop: 20, width: "84%" }} onClick={signIn} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
        {error && <p style={{ color: "#e53935", marginTop: 10, fontSize: 14 }}>{error}</p>}

        <p style={{ marginTop: 30, fontStyle: "italic", fontSize: 13, color: "#777" }}>
          "Excellence is not a skill – it's an attitude."
        </p>
      </div>
    </div>
  );
}
