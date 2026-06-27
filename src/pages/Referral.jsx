import { useState } from "react";

function Referral({ user, setUser, onBack }) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const referralCode = user.referralCode || "N/A";
  const referralLink = `https://vioraai.com/register?ref=${referralCode}`;

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // Get referred users from localStorage
  const allUsers = JSON.parse(
    localStorage.getItem("vioraUsers") || "[]"
  );
  const referredUsers = allUsers.filter(
    (u) => u.referredBy === referralCode
  );

  const totalEarnings = user.referralEarnings || 0;
  const totalReferrals = user.referralCount || referredUsers.length;

  const rewards = [
    {
      count: 1,
      reward: "5 Extra Credits",
      icon: "⚡",
      color: "#8b5cf6",
    },
    {
      count: 3,
      reward: "15 Extra Credits",
      icon: "🎁",
      color: "#ec4899",
    },
    {
      count: 5,
      reward: "1 Month Pro Free",
      icon: "👑",
      color: "#f59e0b",
    },
    {
      count: 10,
      reward: "3 Months Ultra Free",
      icon: "🚀",
      color: "#10b981",
    },
  ];

  const shareMessages = [
    {
      platform: "WhatsApp",
      icon: "💬",
      color: "#25d366",
      url: `https://wa.me/?text=Join%20Viora%20AI%20-%20Best%20AI%20Video%20Generator!%20Use%20my%20code%20${referralCode}%20and%20get%20bonus%20credits!%20${referralLink}`,
    },
    {
      platform: "Twitter",
      icon: "🐦",
      color: "#1da1f2",
      url: `https://twitter.com/intent/tweet?text=Just%20found%20the%20best%20AI%20video%20tool!%20@VioraAI%20Use%20my%20code%20${referralCode}%20for%20bonus%20credits!&url=${referralLink}`,
    },
    {
      platform: "Facebook",
      icon: "📘",
      color: "#1877f2",
      url: `https://www.facebook.com/sharer/sharer.php?u=${referralLink}`,
    },
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
      {/* Glow effects */}
      <div
        style={{
          position: "absolute",
          top: "-10%", left: "30%",
          width: 600, height: 500,
          background:
            "radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%", right: "10%",
          width: 400, height: 400,
          background:
            "radial-gradient(circle,rgba(236,72,153,0.08) 0%,transparent 70%)",
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
        ← Back
      </button>

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontSize: 56,
              marginBottom: 16,
            }}
          >
            🎁
          </div>
          <h1
            style={{
              fontSize: 38,
              fontWeight: 900,
              marginBottom: 12,
              background:
                "linear-gradient(135deg,#ffffff,#a78bfa 50%,#ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Refer & Earn Rewards
          </h1>
          <p style={{ color: "#64748b", fontSize: 17 }}>
            Share your code — earn credits and free plans!
          </p>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 18,
            marginBottom: 28,
          }}
        >
          {[
            {
              label: "Total Referrals",
              value: totalReferrals,
              icon: "👥",
              color: "#8b5cf6",
            },
            {
              label: "Credits Earned",
              value: totalEarnings,
              icon: "⚡",
              color: "#ec4899",
            },
            {
              label: "Active Friends",
              value: referredUsers.filter((u) => u.loggedIn).length,
              icon: "🟢",
              color: "#10b981",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: "22px 24px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: 2,
                  background: `linear-gradient(90deg,${stat.color},transparent)`,
                }}
              />
              <div style={{ fontSize: 28, marginBottom: 10 }}>
                {stat.icon}
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 900,
                  color: stat.color,
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 13, color: "#64748b" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Referral Code Card */}
        <div
          style={{
            background:
              "linear-gradient(135deg,rgba(139,92,246,0.12),rgba(236,72,153,0.08))",
            border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: 24,
            padding: 28,
            marginBottom: 24,
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

          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#a78bfa",
              marginBottom: 18,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            🎟️ Your Referral Code
          </h3>

          {/* Code Box */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 64,
                background: "rgba(0,0,0,0.3)",
                border: "2px dashed rgba(139,92,246,0.4)",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 900,
                color: "white",
                letterSpacing: 4,
                fontFamily: "monospace",
              }}
            >
              {referralCode}
            </div>

            <button
              onClick={copyCode}
              style={{
                height: 64,
                padding: "0 24px",
                border: "none",
                cursor: "pointer",
                borderRadius: 16,
                fontWeight: 800,
                fontSize: 15,
                color: "white",
                background: copied
                  ? "linear-gradient(135deg,#10b981,#059669)"
                  : "linear-gradient(135deg,#8b5cf6,#ec4899)",
                boxShadow: "0 8px 24px rgba(139,92,246,0.3)",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {copied ? "✅ Copied!" : "📋 Copy Code"}
            </button>
          </div>

          {/* Referral Link */}
          <div style={{ marginBottom: 6 }}>
            <div
              style={{
                fontSize: 12,
                color: "#64748b",
                fontWeight: 600,
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Referral Link
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 46,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 14px",
                  fontSize: 13,
                  color: "#64748b",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {referralLink}
              </div>
              <button
                onClick={copyLink}
                style={{
                  height: 46,
                  padding: "0 16px",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 13,
                  color: "white",
                  background: linkCopied
                    ? "rgba(16,185,129,0.3)"
                    : "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                }}
              >
                {linkCopied ? "✅ Copied!" : "🔗 Copy Link"}
              </button>
            </div>
          </div>
        </div>

        {/* Share Buttons */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              marginBottom: 16,
              color: "white",
            }}
          >
            📤 Share On Social Media
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 12,
            }}
          >
            {shareMessages.map((s) => (
              <button
                key={s.platform}
                onClick={() => window.open(s.url, "_blank")}
                style={{
                  height: 52,
                  border: "none",
                  cursor: "pointer",
                  borderRadius: 14,
                  fontWeight: 700,
                  fontSize: 14,
                  color: "white",
                  background: `${s.color}22`,
                  border: `1px solid ${s.color}44`,
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${s.color}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${s.color}22`;
                }}
              >
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                {s.platform}
              </button>
            ))}
          </div>
        </div>

        {/* Rewards Tiers */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              marginBottom: 18,
              color: "white",
            }}
          >
            🏆 Reward Tiers
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 12,
            }}
          >
            {rewards.map((r) => {
              const achieved = totalReferrals >= r.count;
              return (
                <div
                  key={r.count}
                  style={{
                    padding: "16px 18px",
                    borderRadius: 16,
                    background: achieved
                      ? `rgba(${
                          r.color === "#8b5cf6"
                            ? "139,92,246"
                            : r.color === "#ec4899"
                            ? "236,72,153"
                            : r.color === "#f59e0b"
                            ? "245,158,11"
                            : "16,185,129"
                        },0.12)`
                      : "rgba(255,255,255,0.02)",
                    border: achieved
                      ? `1px solid ${r.color}44`
                      : "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 30 }}>{r.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: achieved ? "white" : "#64748b",
                        marginBottom: 4,
                      }}
                    >
                      {r.reward}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: achieved ? r.color : "#475569",
                        fontWeight: 600,
                      }}
                    >
                      {r.count} referral{r.count > 1 ? "s" : ""}{" "}
                      needed
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      color: achieved ? "#10b981" : "#334155",
                    }}
                  >
                    {achieved ? "✅" : "🔒"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Referred Users List */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: 24,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              marginBottom: 18,
              color: "white",
            }}
          >
            👥 Your Referred Friends ({referredUsers.length})
          </h3>

          {referredUsers.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "30px 20px",
                color: "#334155",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>
                👥
              </div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>
                No referrals yet
              </div>
              <div
                style={{ fontSize: 13, marginTop: 6 }}
              >
                Share your code to start earning rewards!
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {referredUsers.map((u, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background:
                        "linear-gradient(135deg,#8b5cf6,#ec4899)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      fontWeight: 800,
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    {u.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "white",
                      }}
                    >
                      {u.name}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#64748b" }}
                    >
                      {u.email}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#10b981",
                      background: "rgba(16,185,129,0.1)",
                      border: "1px solid rgba(16,185,129,0.2)",
                      borderRadius: 8,
                      padding: "4px 10px",
                    }}
                  >
                    ✅ Joined
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Referral;