import { useState } from "react";

// Simple password hash (browser-safe)
const hashPassword = async (password) => {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  // Password strength
  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#eab308", "#22c55e", "#10b981"];
  const strength = getStrength(regPassword);

  // Get all users from localStorage
  const getUsers = () => {
    const users = localStorage.getItem("vioraUsers");
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users) => {
    localStorage.setItem("vioraUsers", JSON.stringify(users));
  };

  // ===== REGISTER =====
  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!regName.trim()) {
      setError("Please enter your full name"); return;
    }
    if (regName.trim().length < 2) {
      setError("Name must be at least 2 characters"); return;
    }
    if (!regEmail.trim()) {
      setError("Please enter your email"); return;
    }
    if (!regEmail.includes("@") || !regEmail.includes(".")) {
      setError("Please enter a valid email address"); return;
    }
    if (!regPassword) {
      setError("Please enter a password"); return;
    }
    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters"); return;
    }
    if (strength < 2) {
      setError("Password is too weak. Add numbers or uppercase letters"); return;
    }
    if (regPassword !== regConfirm) {
      setError("Passwords do not match"); return;
    }

    const users = getUsers();
    const exists = users.find(
      (u) => u.email.toLowerCase() === regEmail.toLowerCase()
    );

    if (exists) {
      setError("This email is already registered. Please login instead.");
      return;
    }

    setLoading(true);

    try {
      const hashedPassword = await hashPassword(regPassword);

      const newUser = {
        id: Date.now().toString(),
        name: regName.trim(),
        email: regEmail.toLowerCase().trim(),
        password: hashedPassword,
        plan: "free",
        credits: 5,
        watermarkEnabled: false,
        createdAt: new Date().toISOString(),
        lastResetDate: new Date().toISOString().split("T")[0],
      };

      users.push(newUser);
      saveUsers(users);

      setSuccess("✅ Account created! Redirecting to login...");
      setTimeout(() => {
        setMode("login");
        setLoginEmail(regEmail);
        setSuccess("");
        setRegName("");
        setRegEmail("");
        setRegPassword("");
        setRegConfirm("");
      }, 1800);
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ===== LOGIN =====
  const handleLogin = async () => {
    setError("");
    setSuccess("");

    if (!loginEmail.trim()) {
      setError("Please enter your email"); return;
    }
    if (!loginEmail.includes("@")) {
      setError("Please enter a valid email"); return;
    }
    if (!loginPassword) {
      setError("Please enter your password"); return;
    }

    setLoading(true);

    try {
      const users = getUsers();
      const user = users.find(
        (u) => u.email.toLowerCase() === loginEmail.toLowerCase().trim()
      );

      if (!user) {
        setError("No account found with this email. Please register first.");
        setLoading(false);
        return;
      }

      const hashedInput = await hashPassword(loginPassword);

      if (hashedInput !== user.password) {
        setError("Incorrect password. Please try again.");
        setLoading(false);
        return;
      }

      // Daily reset check
      const todayKey = new Date().toISOString().split("T")[0];
      let credits = user.credits;
      let lastResetDate = user.lastResetDate;

      if (user.plan === "free" && user.lastResetDate !== todayKey) {
        credits = 5;
        lastResetDate = todayKey;

        // Update in storage
        const updatedUsers = users.map((u) =>
          u.id === user.id
            ? { ...u, credits: 5, lastResetDate: todayKey }
            : u
        );
        saveUsers(updatedUsers);
      }

      setSuccess("✅ Login successful! Welcome back!");

      setTimeout(() => {
        onLogin({
          id: user.id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          credits,
          watermarkEnabled: user.watermarkEnabled,
          loggedIn: true,
          lastResetDate,
          rememberMe,
        });
      }, 800);
    } catch (err) {
      setError("Login failed. Try again.");
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      mode === "login" ? handleLogin() : handleRegister();
    }
  };

  // ===== STYLES =====
  const inputStyle = {
    width: "100%",
    height: 52,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: "0 18px",
    color: "white",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#94a3b8",
    marginBottom: 8,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050816",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "inherit",
        position: "relative",
        overflow: "hidden",
        padding: "20px",
      }}
    >
      {/* Background glows */}
      <div style={{
        position: "absolute", top: "-20%", left: "50%",
        transform: "translateX(-50%)",
        width: 700, height: 700,
        background: "radial-gradient(circle,rgba(139,92,246,0.12) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", right: "10%",
        width: 400, height: 400,
        background: "radial-gradient(circle,rgba(236,72,153,0.08) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 28,
          padding: "40px 38px",
          backdropFilter: "blur(30px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Top gradient line */}
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: 2,
          background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
          borderRadius: "28px 28px 0 0",
        }} />

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 68, height: 68,
            background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
            borderRadius: 20,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 30, fontWeight: 900, color: "white",
            margin: "0 auto 16px",
            boxShadow: "0 15px 35px rgba(139,92,246,0.35)",
          }}>
            V
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", marginBottom: 6 }}>
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            {mode === "login"
              ? "Sign in to your Viora AI account"
              : "Join Viora AI — Free forever"}
          </p>
        </div>

        {/* Mode Tabs */}
        <div style={{
          display: "flex",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14,
          padding: 4,
          marginBottom: 28,
        }}>
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError("");
                setSuccess("");
              }}
              style={{
                flex: 1, height: 42, border: "none", cursor: "pointer",
                borderRadius: 11, fontWeight: 700, fontSize: 14,
                color: mode === m ? "white" : "#64748b",
                background: mode === m
                  ? "linear-gradient(135deg,#8b5cf6,#ec4899)"
                  : "transparent",
                transition: "all 0.25s",
              }}
            >
              {m === "login" ? "🔑 Sign In" : "✨ Register"}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 12, padding: "12px 16px",
            color: "#f87171", fontSize: 14,
            marginBottom: 18, textAlign: "center",
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.25)",
            borderRadius: 12, padding: "12px 16px",
            color: "#34d399", fontSize: 14,
            marginBottom: 18, textAlign: "center",
          }}>
            {success}
          </div>
        )}

        {/* ===== LOGIN FORM ===== */}
        {mode === "login" && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => { setLoginEmail(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                style={inputStyle}
                onFocus={(e) => e.target.style.border = "1px solid rgba(139,92,246,0.6)"}
                onBlur={(e) => e.target.style.border = "1px solid rgba(255,255,255,0.1)"}
              />
            </div>

            <div style={{ marginBottom: 16, position: "relative" }}>
              <label style={labelStyle}>Password</label>
              <input
                type={showLoginPass ? "text" : "password"}
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => { setLoginPassword(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                style={{ ...inputStyle, paddingRight: 50 }}
                onFocus={(e) => e.target.style.border = "1px solid rgba(139,92,246,0.6)"}
                onBlur={(e) => e.target.style.border = "1px solid rgba(255,255,255,0.1)"}
              />
              <button
                onClick={() => setShowLoginPass(!showLoginPass)}
                style={{
                  position: "absolute", right: 14, top: 38,
                  background: "none", border: "none",
                  color: "#64748b", cursor: "pointer", fontSize: 18,
                }}
              >
                {showLoginPass ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Remember Me */}
            <div style={{
              display: "flex", alignItems: "center",
              gap: 10, marginBottom: 24,
            }}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#8b5cf6" }}
              />
              <label
                htmlFor="remember"
                style={{ fontSize: 14, color: "#94a3b8", cursor: "pointer" }}
              >
                Remember me
              </label>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: "100%", height: 54, border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                borderRadius: 14, fontWeight: 700, fontSize: 16,
                color: "white",
                background: loading
                  ? "rgba(139,92,246,0.4)"
                  : "linear-gradient(135deg,#8b5cf6,#ec4899)",
                boxShadow: loading ? "none" : "0 10px 30px rgba(139,92,246,0.3)",
                marginBottom: 12,
              }}
            >
              {loading ? "⏳ Signing In..." : "🚀 Sign In"}
            </button>

            <p style={{ textAlign: "center", color: "#475569", fontSize: 13 }}>
              No account?{" "}
              <span
                onClick={() => { setMode("register"); setError(""); }}
                style={{ color: "#a78bfa", cursor: "pointer", fontWeight: 700 }}
              >
                Register free →
              </span>
            </p>
          </div>
        )}

        {/* ===== REGISTER FORM ===== */}
        {mode === "register" && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                placeholder="Usama Khan"
                value={regName}
                onChange={(e) => { setRegName(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                style={inputStyle}
                onFocus={(e) => e.target.style.border = "1px solid rgba(139,92,246,0.6)"}
                onBlur={(e) => e.target.style.border = "1px solid rgba(255,255,255,0.1)"}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={regEmail}
                onChange={(e) => { setRegEmail(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                style={inputStyle}
                onFocus={(e) => e.target.style.border = "1px solid rgba(139,92,246,0.6)"}
                onBlur={(e) => e.target.style.border = "1px solid rgba(255,255,255,0.1)"}
              />
            </div>

            <div style={{ marginBottom: 8, position: "relative" }}>
              <label style={labelStyle}>Password</label>
              <input
                type={showRegPass ? "text" : "password"}
                placeholder="Min 6 characters"
                value={regPassword}
                onChange={(e) => { setRegPassword(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                style={{ ...inputStyle, paddingRight: 50 }}
                onFocus={(e) => e.target.style.border = "1px solid rgba(139,92,246,0.6)"}
                onBlur={(e) => e.target.style.border = "1px solid rgba(255,255,255,0.1)"}
              />
              <button
                onClick={() => setShowRegPass(!showRegPass)}
                style={{
                  position: "absolute", right: 14, top: 38,
                  background: "none", border: "none",
                  color: "#64748b", cursor: "pointer", fontSize: 18,
                }}
              >
                {showRegPass ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Password Strength */}
            {regPassword.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{
                  display: "flex", gap: 4, marginBottom: 6,
                }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 999,
                      background: i <= strength
                        ? strengthColor[strength]
                        : "rgba(255,255,255,0.08)",
                      transition: "background 0.3s",
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 12, color: strengthColor[strength], fontWeight: 600 }}>
                  {strengthLabel[strength]}
                </span>
              </div>
            )}

            <div style={{ marginBottom: 20, position: "relative" }}>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type={showRegConfirm ? "text" : "password"}
                placeholder="Re-enter password"
                value={regConfirm}
                onChange={(e) => { setRegConfirm(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                style={{
                  ...inputStyle,
                  paddingRight: 50,
                  border: regConfirm && regConfirm !== regPassword
                    ? "1px solid rgba(239,68,68,0.5)"
                    : regConfirm && regConfirm === regPassword
                    ? "1px solid rgba(16,185,129,0.5)"
                    : "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <button
                onClick={() => setShowRegConfirm(!showRegConfirm)}
                style={{
                  position: "absolute", right: 14, top: 38,
                  background: "none", border: "none",
                  color: "#64748b", cursor: "pointer", fontSize: 18,
                }}
              >
                {showRegConfirm ? "🙈" : "👁️"}
              </button>
              {regConfirm && (
                <div style={{ fontSize: 12, marginTop: 6, color: regConfirm === regPassword ? "#10b981" : "#ef4444" }}>
                  {regConfirm === regPassword ? "✅ Passwords match" : "❌ Passwords don't match"}
                </div>
              )}
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              style={{
                width: "100%", height: 54, border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                borderRadius: 14, fontWeight: 700, fontSize: 16,
                color: "white",
                background: loading
                  ? "rgba(139,92,246,0.4)"
                  : "linear-gradient(135deg,#8b5cf6,#ec4899)",
                boxShadow: loading ? "none" : "0 10px 30px rgba(139,92,246,0.3)",
                marginBottom: 12,
              }}
            >
              {loading ? "⏳ Creating Account..." : "✨ Create Free Account"}
            </button>

            <p style={{ textAlign: "center", color: "#475569", fontSize: 13 }}>
              Already have account?{" "}
              <span
                onClick={() => { setMode("login"); setError(""); }}
                style={{ color: "#a78bfa", cursor: "pointer", fontWeight: 700 }}
              >
                Sign in →
              </span>
            </p>
          </div>
        )}

        {/* Bottom badges */}
        <div style={{
          marginTop: 24,
          paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", justifyContent: "center", gap: 20,
        }}>
          {["🔒 SHA-256 Encrypted", "⚡ Instant Access", "🆓 Free Forever"].map((b) => (
            <span key={b} style={{ fontSize: 11, color: "#334155", fontWeight: 500 }}>
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Login;