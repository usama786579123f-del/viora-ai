import { useState } from "react";

const API = "https://viora-ai-production.up.railway.app";

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!loginEmail || !loginPassword) { setError("Please fill all fields"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); setLoading(false); return; }
      localStorage.setItem("vioraToken", data.token);
      setSuccess("✅ Login successful!");
      setTimeout(() => {
        onLogin({ ...data.user, loggedIn: true, name: data.user.email.split("@")[0] });
      }, 800);
    } catch (err) {
      setError("Server error. Try again.");
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError("");
    if (!regName || !regEmail || !regPassword) { setError("Please fill all fields"); return; }
    if (regPassword !== regConfirm) { setError("Passwords do not match"); return; }
    if (regPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Register failed"); setLoading(false); return; }
      localStorage.setItem("vioraToken", data.token);
      setSuccess("✅ Account created!");
      setTimeout(() => {
        onLogin({ ...data.user, loggedIn: true, name: regName });
      }, 800);
    } catch (err) {
      setError("Server error. Try again.");
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", height: 52,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 14, padding: "0 18px",
    color: "white", fontSize: 15, outline: "none", boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block", fontSize: 13, fontWeight: 600,
    color: "#94a3b8", marginBottom: 8,
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050816",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "inherit", padding: "20px",
    }}>
      <div style={{
        width: "100%", maxWidth: 480,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 28, padding: "40px 38px",
        backdropFilter: "blur(30px)", position: "relative",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, width: "100%", height: 2,
          background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
          borderRadius: "28px 28px 0 0",
        }} />

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 68, height: 68,
            background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
            borderRadius: 20, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 30, fontWeight: 900,
            color: "white", margin: "0 auto 16px",
            boxShadow: "0 15px 35px rgba(139,92,246,0.35)",
          }}>V</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", marginBottom: 6 }}>
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            {mode === "login" ? "Sign in to your Viora AI account" : "Join Viora AI — Free forever"}
          </p>
        </div>

        <div style={{
          display: "flex", background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, padding: 4, marginBottom: 28,
        }}>
          {["login", "register"].map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }}
              style={{
                flex: 1, height: 42, border: "none", cursor: "pointer",
                borderRadius: 11, fontWeight: 700, fontSize: 14,
                color: mode === m ? "white" : "#64748b",
                background: mode === m ? "linear-gradient(135deg,#8b5cf6,#ec4899)" : "transparent",
              }}>
              {m === "login" ? "🔑 Sign In" : "✨ Register"}
            </button>
          ))}
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 12, padding: "12px 16px", color: "#f87171",
            fontSize: 14, marginBottom: 18, textAlign: "center",
          }}>⚠️ {error}</div>
        )}

        {success && (
          <div style={{
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
            borderRadius: 12, padding: "12px 16px", color: "#34d399",
            fontSize: 14, marginBottom: 18, textAlign: "center",
          }}>{success}</div>
        )}

        {mode === "login" ? (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" placeholder="you@example.com" value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 24, position: "relative" }}>
              <label style={labelStyle}>Password</label>
              <input type={showLoginPass ? "text" : "password"} placeholder="Enter your password"
                value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: 50 }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
              <button onClick={() => setShowLoginPass(!showLoginPass)} style={{
                position: "absolute", right: 14, top: 38,
                background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 18,
              }}>{showLoginPass ? "🙈" : "👁️"}</button>
            </div>
            <button onClick={handleLogin} disabled={loading} style={{
              width: "100%", height: 54, border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              borderRadius: 14, fontWeight: 700, fontSize: 16, color: "white",
              background: loading ? "rgba(139,92,246,0.4)" : "linear-gradient(135deg,#8b5cf6,#ec4899)",
              marginBottom: 12,
            }}>{loading ? "⏳ Signing In..." : "🚀 Sign In"}</button>
            <p style={{ textAlign: "center", color: "#475569", fontSize: 13 }}>
              No account?{" "}
              <span onClick={() => { setMode("register"); setError(""); }}
                style={{ color: "#a78bfa", cursor: "pointer", fontWeight: 700 }}>
                Register free →
              </span>
            </p>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Full Name</label>
              <input type="text" placeholder="Usama Khan" value={regName}
                onChange={(e) => setRegName(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" placeholder="you@example.com" value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 14, position: "relative" }}>
              <label style={labelStyle}>Password</label>
              <input type={showRegPass ? "text" : "password"} placeholder="Min 6 characters"
                value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: 50 }} />
              <button onClick={() => setShowRegPass(!showRegPass)} style={{
                position: "absolute", right: 14, top: 38,
                background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 18,
              }}>{showRegPass ? "🙈" : "👁️"}</button>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Confirm Password</label>
              <input type="password" placeholder="Re-enter password" value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                style={inputStyle} />
            </div>
            <button onClick={handleRegister} disabled={loading} style={{
              width: "100%", height: 54, border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              borderRadius: 14, fontWeight: 700, fontSize: 16, color: "white",
              background: loading ? "rgba(139,92,246,0.4)" : "linear-gradient(135deg,#8b5cf6,#ec4899)",
              marginBottom: 12,
            }}>{loading ? "⏳ Creating..." : "✨ Create Free Account"}</button>
            <p style={{ textAlign: "center", color: "#475569", fontSize: 13 }}>
              Already have account?{" "}
              <span onClick={() => { setMode("login"); setError(""); }}
                style={{ color: "#a78bfa", cursor: "pointer", fontWeight: 700 }}>
                Sign in →
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;