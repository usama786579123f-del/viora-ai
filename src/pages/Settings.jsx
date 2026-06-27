import { useState } from "react";

function Settings({ user, setUser, onLogout, onBack, openPricing }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saved, setSaved] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Password change
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passError, setPassError] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Avatar color picker
  const [avatarColor, setAvatarColor] = useState(
    user.avatarColor || "linear-gradient(135deg,#8b5cf6,#ec4899)"
  );

  const avatarColors = [
    "linear-gradient(135deg,#8b5cf6,#ec4899)",
    "linear-gradient(135deg,#06b6d4,#8b5cf6)",
    "linear-gradient(135deg,#10b981,#06b6d4)",
    "linear-gradient(135deg,#f59e0b,#ef4444)",
    "linear-gradient(135deg,#ec4899,#f59e0b)",
    "linear-gradient(135deg,#6366f1,#8b5cf6)",
  ];

  const handleSaveProfile = () => {
    if (!name.trim()) return;
    if (!email.trim() || !email.includes("@")) return;

    // Update in users list too
    const users = JSON.parse(
      localStorage.getItem("vioraUsers") || "[]"
    );
    const updatedUsers = users.map((u) =>
      u.email === user.email
        ? { ...u, name: name.trim(), email: email.trim(), avatarColor }
        : u
    );
    localStorage.setItem("vioraUsers", JSON.stringify(updatedUsers));

    setUser((prev) => ({
      ...prev,
      name: name.trim(),
      email: email.trim(),
      avatarColor,
    }));

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleChangePassword = async () => {
    setPassMsg("");
    setPassError("");

    if (!currentPass) {
      setPassError("Enter current password");
      return;
    }
    if (!newPass) {
      setPassError("Enter new password");
      return;
    }
    if (newPass.length < 6) {
      setPassError("New password must be at least 6 characters");
      return;
    }
    if (newPass !== confirmPass) {
      setPassError("Passwords do not match");
      return;
    }

    // Hash passwords
    const hashPassword = async (password) => {
      const msgBuffer = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    };

    const hashedCurrent = await hashPassword(currentPass);
    const hashedNew = await hashPassword(newPass);

    const users = JSON.parse(
      localStorage.getItem("vioraUsers") || "[]"
    );
    const found = users.find((u) => u.email === user.email);

    if (!found) {
      setPassError("User not found");
      return;
    }

    if (found.password !== hashedCurrent) {
      setPassError("Current password is incorrect");
      return;
    }

    const updatedUsers = users.map((u) =>
      u.email === user.email ? { ...u, password: hashedNew } : u
    );
    localStorage.setItem("vioraUsers", JSON.stringify(updatedUsers));

    setPassMsg("✅ Password changed successfully!");
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
    setTimeout(() => setPassMsg(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("vioraUser");
    localStorage.removeItem("vioraVideos");
    onLogout();
  };

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

  const strengthColor = [
    "", "#ef4444", "#f59e0b", "#eab308", "#22c55e", "#10b981",
  ];
  const strengthLabel = [
    "", "Weak", "Fair", "Good", "Strong", "Very Strong",
  ];
  const strength = getStrength(newPass);

  const inputStyle = {
    width: "100%",
    height: 52,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 13,
    padding: "0 16px",
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

  const tabs = [
    { id: "profile", icon: "👤", label: "Profile" },
    { id: "security", icon: "🔒", label: "Security" },
    { id: "account", icon: "📊", label: "Account" },
    { id: "danger", icon: "⚠️", label: "Logout" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050816",
        padding: "30px 20px",
        color: "white",
        fontFamily: "inherit",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "-10%", left: "40%",
          width: 500, height: 400,
          background:
            "radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Back */}
      <button
        onClick={onBack}
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "white",
          padding: "10px 20px",
          borderRadius: 12,
          cursor: "pointer",
          marginBottom: 30,
          fontSize: 14,
          fontWeight: 600,
          position: "relative",
          zIndex: 1,
        }}
      >
        ← Back to Dashboard
      </button>

      <div
        style={{
          maxWidth: 750,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            marginBottom: 6,
          }}
        >
          Account Settings
        </h1>
        <p style={{ color: "#64748b", marginBottom: 28 }}>
          Manage your profile, security and account preferences
        </p>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 5,
            gap: 4,
            marginBottom: 28,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                height: 44,
                border: "none",
                cursor: "pointer",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 13,
                color: activeTab === tab.id ? "white" : "#64748b",
                background:
                  activeTab === tab.id
                    ? tab.id === "danger"
                      ? "linear-gradient(135deg,#ef4444,#dc2626)"
                      : "linear-gradient(135deg,#8b5cf6,#ec4899)"
                    : "transparent",
                transition: "all 0.25s",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ===== PROFILE TAB ===== */}
        {activeTab === "profile" && (
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: 30,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 2,
                background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
                borderRadius: "24px 24px 0 0",
              }}
            />

            {/* Avatar Section */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginBottom: 28,
                padding: "0 0 24px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 22,
                  background: avatarColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  fontWeight: 900,
                  color: "white",
                  boxShadow: "0 10px 30px rgba(139,92,246,0.3)",
                  flexShrink: 0,
                }}
              >
                {name?.[0]?.toUpperCase() || "U"}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "white",
                    marginBottom: 4,
                  }}
                >
                  {user.name}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#64748b",
                    marginBottom: 12,
                  }}
                >
                  {user.email}
                </div>

                {/* Avatar Color Picker */}
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      marginBottom: 8,
                      fontWeight: 600,
                    }}
                  >
                    Avatar Color:
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {avatarColors.map((color, i) => (
                      <button
                        key={i}
                        onClick={() => setAvatarColor(color)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: color,
                          border:
                            avatarColor === color
                              ? "2px solid white"
                              : "2px solid transparent",
                          cursor: "pointer",
                          boxShadow:
                            avatarColor === color
                              ? "0 0 12px rgba(255,255,255,0.4)"
                              : "none",
                          transition: "all 0.2s",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Name */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.border =
                    "1px solid rgba(139,92,246,0.6)")
                }
                onBlur={(e) =>
                  (e.target.style.border =
                    "1px solid rgba(255,255,255,0.1)")
                }
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.border =
                    "1px solid rgba(139,92,246,0.6)")
                }
                onBlur={(e) =>
                  (e.target.style.border =
                    "1px solid rgba(255,255,255,0.1)")
                }
              />
            </div>

            {/* Username display */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Username</label>
              <div
                style={{
                  ...inputStyle,
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.02)",
                  color: "#64748b",
                  fontSize: 14,
                }}
              >
                @{name?.toLowerCase().replace(/\s+/g, "") || "username"}
              </div>
            </div>

            {/* Save */}
            <button
              onClick={handleSaveProfile}
              style={{
                width: "100%",
                height: 52,
                border: "none",
                cursor: "pointer",
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 15,
                color: "white",
                background: saved
                  ? "linear-gradient(135deg,#10b981,#059669)"
                  : "linear-gradient(135deg,#8b5cf6,#ec4899)",
                boxShadow: "0 8px 25px rgba(139,92,246,0.25)",
                transition: "background 0.3s",
              }}
            >
              {saved ? "✅ Profile Saved!" : "💾 Save Profile"}
            </button>
          </div>
        )}

        {/* ===== SECURITY TAB ===== */}
        {activeTab === "security" && (
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: 30,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 2,
                background: "linear-gradient(90deg,#06b6d4,#8b5cf6)",
                borderRadius: "24px 24px 0 0",
              }}
            />

            <h3
              style={{
                fontSize: 18,
                fontWeight: 800,
                marginBottom: 6,
                color: "white",
              }}
            >
              🔒 Change Password
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "#64748b",
                marginBottom: 24,
              }}
            >
              Keep your account secure with a strong password
            </p>

            {/* Error */}
            {passError && (
              <div
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  color: "#f87171",
                  fontSize: 14,
                  marginBottom: 18,
                }}
              >
                ⚠️ {passError}
              </div>
            )}

            {/* Success */}
            {passMsg && (
              <div
                style={{
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.25)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  color: "#34d399",
                  fontSize: 14,
                  marginBottom: 18,
                }}
              >
                {passMsg}
              </div>
            )}

            {/* Current Password */}
            <div style={{ marginBottom: 18, position: "relative" }}>
              <label style={labelStyle}>Current Password</label>
              <input
                type={showCurrentPass ? "text" : "password"}
                value={currentPass}
                onChange={(e) => {
                  setCurrentPass(e.target.value);
                  setPassError("");
                }}
                placeholder="Enter current password"
                style={{ ...inputStyle, paddingRight: 50 }}
                onFocus={(e) =>
                  (e.target.style.border =
                    "1px solid rgba(139,92,246,0.6)")
                }
                onBlur={(e) =>
                  (e.target.style.border =
                    "1px solid rgba(255,255,255,0.1)")
                }
              />
              <button
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                style={{
                  position: "absolute",
                  right: 14, top: 38,
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  fontSize: 18,
                }}
              >
                {showCurrentPass ? "🙈" : "👁️"}
              </button>
            </div>

            {/* New Password */}
            <div style={{ marginBottom: 8, position: "relative" }}>
              <label style={labelStyle}>New Password</label>
              <input
                type={showNewPass ? "text" : "password"}
                value={newPass}
                onChange={(e) => {
                  setNewPass(e.target.value);
                  setPassError("");
                }}
                placeholder="Min 6 characters"
                style={{ ...inputStyle, paddingRight: 50 }}
                onFocus={(e) =>
                  (e.target.style.border =
                    "1px solid rgba(139,92,246,0.6)")
                }
                onBlur={(e) =>
                  (e.target.style.border =
                    "1px solid rgba(255,255,255,0.1)")
                }
              />
              <button
                onClick={() => setShowNewPass(!showNewPass)}
                style={{
                  position: "absolute",
                  right: 14, top: 38,
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  fontSize: 18,
                }}
              >
                {showNewPass ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Strength Bar */}
            {newPass.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    marginBottom: 6,
                  }}
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 999,
                        background:
                          i <= strength
                            ? strengthColor[strength]
                            : "rgba(255,255,255,0.08)",
                        transition: "background 0.3s",
                      }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: strengthColor[strength],
                    fontWeight: 600,
                  }}
                >
                  {strengthLabel[strength]}
                </span>
              </div>
            )}

            {/* Confirm Password */}
            <div
              style={{
                marginBottom: 24,
                position: "relative",
              }}
            >
              <label style={labelStyle}>Confirm New Password</label>
              <input
                type={showConfirmPass ? "text" : "password"}
                value={confirmPass}
                onChange={(e) => {
                  setConfirmPass(e.target.value);
                  setPassError("");
                }}
                placeholder="Re-enter new password"
                style={{
                  ...inputStyle,
                  paddingRight: 50,
                  border:
                    confirmPass && confirmPass !== newPass
                      ? "1px solid rgba(239,68,68,0.5)"
                      : confirmPass && confirmPass === newPass
                      ? "1px solid rgba(16,185,129,0.5)"
                      : "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <button
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                style={{
                  position: "absolute",
                  right: 14, top: 38,
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  fontSize: 18,
                }}
              >
                {showConfirmPass ? "🙈" : "👁️"}
              </button>
              {confirmPass && (
                <div
                  style={{
                    fontSize: 12,
                    marginTop: 6,
                    color:
                      confirmPass === newPass
                        ? "#10b981"
                        : "#ef4444",
                  }}
                >
                  {confirmPass === newPass
                    ? "✅ Passwords match"
                    : "❌ Passwords don't match"}
                </div>
              )}
            </div>

            <button
              onClick={handleChangePassword}
              style={{
                width: "100%",
                height: 52,
                border: "none",
                cursor: "pointer",
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 15,
                color: "white",
                background:
                  "linear-gradient(135deg,#06b6d4,#8b5cf6)",
                boxShadow:
                  "0 8px 25px rgba(6,182,212,0.2)",
              }}
            >
              🔒 Update Password
            </button>
          </div>
        )}

        {/* ===== ACCOUNT TAB ===== */}
        {activeTab === "account" && (
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: 30,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 2,
                background: "linear-gradient(90deg,#10b981,#06b6d4)",
                borderRadius: "24px 24px 0 0",
              }}
            />

            <h3
              style={{
                fontSize: 18,
                fontWeight: 800,
                marginBottom: 20,
              }}
            >
              📊 Account Overview
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                marginBottom: 24,
              }}
            >
              {[
                {
                  label: "Current Plan",
                  value: user.plan.toUpperCase(),
                  icon: "👑",
                  color: "#a78bfa",
                },
                {
                  label: "Credits Left",
                  value:
                    user.plan === "ultra"
                      ? "Unlimited"
                      : user.credits,
                  icon: "⚡",
                  color: "#10b981",
                },
                {
                  label: "Watermark",
                  value: user.watermarkEnabled ? "On" : "Off ✅",
                  icon: "🔖",
                  color: "#94a3b8",
                },
                {
                  label: "Daily Reset",
                  value:
                    user.plan === "free"
                      ? "Every midnight"
                      : "No limit",
                  icon: "🔄",
                  color: "#94a3b8",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 16,
                    padding: "16px 18px",
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 8 }}>
                    {item.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      marginBottom: 4,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: item.color,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Upgrade CTA */}
            {user.plan !== "ultra" && (
              <div
                style={{
                  background:
                    "linear-gradient(135deg,rgba(139,92,246,0.12),rgba(236,72,153,0.08))",
                  border: "1px solid rgba(139,92,246,0.2)",
                  borderRadius: 16,
                  padding: "20px 22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "white",
                      marginBottom: 4,
                    }}
                  >
                    ⚡ Upgrade Your Plan
                  </div>
                  <div
                    style={{ fontSize: 13, color: "#64748b" }}
                  >
                    Get more credits, 4K quality from $5/mo
                  </div>
                </div>
                <button
                  onClick={openPricing}
                  style={{
                    height: 44,
                    padding: "0 20px",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 13,
                    color: "white",
                    background:
                      "linear-gradient(135deg,#8b5cf6,#ec4899)",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  Upgrade →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== DANGER / LOGOUT TAB ===== */}
        {activeTab === "danger" && (
          <div
            style={{
              background: "rgba(239,68,68,0.04)",
              border: "1px solid rgba(239,68,68,0.12)",
              borderRadius: 24,
              padding: 30,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 2,
                background: "linear-gradient(90deg,#ef4444,#dc2626)",
                borderRadius: "24px 24px 0 0",
              }}
            />

            <h3
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#f87171",
                marginBottom: 8,
              }}
            >
              ⚠️ Danger Zone
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "#64748b",
                marginBottom: 28,
                lineHeight: 1.7,
              }}
            >
              Logging out will end your current session. Your
              videos and data will remain saved. You can log
              back in anytime with your email and password.
            </p>

            {!showLogoutConfirm ? (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                style={{
                  width: "100%",
                  height: 54,
                  border: "1px solid rgba(239,68,68,0.3)",
                  cursor: "pointer",
                  borderRadius: 14,
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#f87171",
                  background: "rgba(239,68,68,0.08)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background =
                    "rgba(239,68,68,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background =
                    "rgba(239,68,68,0.08)";
                }}
              >
                🚪 Logout from Viora AI
              </button>
            ) : (
              <div
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 18,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    fontSize: 40,
                    textAlign: "center",
                    marginBottom: 12,
                  }}
                >
                  🚪
                </div>
                <p
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontWeight: 700,
                    marginBottom: 6,
                    textAlign: "center",
                  }}
                >
                  Are you sure you want to logout?
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "#64748b",
                    textAlign: "center",
                    marginBottom: 22,
                  }}
                >
                  You will need to login again to access your account
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    style={{
                      height: 50,
                      border: "1px solid rgba(255,255,255,0.1)",
                      cursor: "pointer",
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: 14,
                      color: "white",
                      background: "rgba(255,255,255,0.06)",
                    }}
                  >
                    ✕ Cancel
                  </button>

                  <button
                    onClick={handleLogout}
                    style={{
                      height: 50,
                      border: "none",
                      cursor: "pointer",
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: 14,
                      color: "white",
                      background:
                        "linear-gradient(135deg,#ef4444,#dc2626)",
                      boxShadow:
                        "0 6px 20px rgba(239,68,68,0.3)",
                    }}
                  >
                    🚪 Yes, Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;