import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      height: "100vh"
    }}>
      <div className="card" style={{ width: 500, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img src="/logo_atbott.png" alt="atBott logo" style={{ height: 72, marginBottom: 10 }} />
        <h2 style={{ margin: 0 }}>atBott</h2>
        <p style={{ marginTop: 4, color: "#555" }}>Your Trusted Digital Partner</p>

        <h3 style={{ marginTop: 30 }}>Welcome Back</h3>
        <input placeholder="Email" type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "80%", marginTop: 10, padding: "10px", borderRadius: 6, border: "1px solid #ccc" }} />
        <input placeholder="Password" type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "80%", marginTop: 10, padding: "10px", borderRadius: 6, border: "1px solid #ccc" }} />
        <button className="btn-primary" style={{ marginTop: 20, width: "84%" }} onClick={() => onLogin(email)}>
          Sign In
        </button>

        <p style={{ marginTop: 30, fontStyle: "italic", fontSize: 13, color: "#777" }}>
          "Excellence is not a skill – it's an attitude."
        </p>
      </div>
    </div>
  );
}
