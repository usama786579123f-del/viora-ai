import { useState, useEffect } from "react";

function CreditsPanel({ user, openPricing }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calcTime = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };
    calcTime();
    const t = setInterval(calcTime, 1000);
    return () => clearInterval(t);
  }, []);

  const maxCredits =
    user.plan === "free" ? 5
    : user.plan === "pro" ? 200
    : 999999;

  const percentage =
    user.plan === "ultra"
      ? 100
      : Math.min((user.credits / maxCredits) * 100, 100);

  const weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const heights = [45, 70, 55, 90, 75, 100];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr 1fr",
        gap: 22,
        marginBottom: 30,
      }}
    >

      {/* ===== CREDITS CARD ===== */}
      <div
        style={{
          padding: 28,
          borderRadius: 24,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top glow line */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%",
            height: 2,
            background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 13,
                color: "#94a3b8",
                fontWeight: 600,
                marginBottom: 8,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Available Credits
            </p>
            <h2
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: "white",
                lineHeight: 1,
              }}
            >
              {user.plan === "ultra" ? "∞" : user.credits}
            </h2>
          </div>

          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(236,72,153,0.2))",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            ⚡
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: 10,
            borderRadius: 999,
            background: "rgba(255,255,255,0.06)",
            overflow: "hidden",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${percentage}%`,
              background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
              borderRadius: 999,
              transition: "width 0.5s ease",
            }}
          />
        </div>

        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
          Plan:{" "}
          <strong style={{ color: "white" }}>
            {user.plan.toUpperCase()}
          </strong>
          {user.plan !== "ultra" && (
            <span style={{ color: "#94a3b8" }}>
              {" "}— {user.credits} / {maxCredits} credits
            </span>
          )}
        </p>

        {/* Daily Reset Timer */}
        {user.plan === "free" && (
          <div
            style={{
              padding: "14px 16px",
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: 14,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#94a3b8",
                fontWeight: 600,
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              🕐 Resets In
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: "#a78bfa",
                fontFamily: "monospace",
                letterSpacing: 2,
              }}
            >
              {timeLeft}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#475569",
                marginTop: 6,
              }}
            >
              5 free videos reset every midnight
            </div>
          </div>
        )}

        {/* Pro/Ultra — no timer needed */}
        {user.plan !== "free" && (
          <div
            style={{
              padding: "14px 16px",
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: 14,
              fontSize: 13,
              color: "#10b981",
              fontWeight: 600,
            }}
          >
            ✅ No daily limit — generate anytime!
          </div>
        )}
      </div>

      {/* ===== PLAN CARD ===== */}
      <div
        style={{
          padding: 28,
          borderRadius: 24,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%",
            height: 2,
            background: "linear-gradient(90deg,#ec4899,#8b5cf6)",
          }}
        />

        {/* Plan Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(236,72,153,0.2))",
            border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: 999,
            padding: "6px 16px",
            fontSize: 12,
            fontWeight: 800,
            color: "#a78bfa",
            letterSpacing: 1,
            marginBottom: 20,
            width: "fit-content",
          }}
        >
          {user.plan === "free" ? "🆓" : user.plan === "pro" ? "⚡" : "👑"}
          {" "}{user.plan.toUpperCase()} PLAN
        </div>

        <h3
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "white",
            marginBottom: 10,
          }}
        >
          {user.plan === "free"
            ? "Free Forever"
            : user.plan === "pro"
            ? "Pro Subscription"
            : "Ultra Subscription"}
        </h3>

        <p
          style={{
            fontSize: 14,
            color: "#64748b",
            lineHeight: 1.7,
            marginBottom: 24,
            flex: 1,
          }}
        >
          {user.plan === "free"
            ? "5 free videos every day. Upgrade to Pro for just $5/mo and unlock 200 videos + HD quality!"
            : user.plan === "pro"
            ? "200 videos/month. 1080p + 2K quality. No watermark. Priority queue."
            : "Unlimited videos. 4K quality. No watermark. Fastest generation. No limits ever."}
        </p>

        {/* Price display */}
        <div
          style={{
            marginBottom: 18,
            padding: "12px 16px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span style={{ fontSize: 28, fontWeight: 900, color: "white" }}>
            {user.plan === "free" ? "$0" : user.plan === "pro" ? "$5" : "$15"}
          </span>
          <span style={{ fontSize: 14, color: "#64748b" }}>
            {user.plan === "free" ? " forever" : " / month"}
          </span>
        </div>

        <button
          onClick={openPricing}
          style={{
            width: "100%",
            height: 50,
            border: "none",
            cursor: "pointer",
            borderRadius: 14,
            fontWeight: 700,
            fontSize: 14,
            color: "white",
            background:
              user.plan === "ultra"
                ? "rgba(255,255,255,0.08)"
                : "linear-gradient(135deg,#8b5cf6,#ec4899)",
            boxShadow:
              user.plan === "ultra"
                ? "none"
                : "0 8px 25px rgba(139,92,246,0.3)",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = 0.85)}
          onMouseLeave={(e) => (e.target.style.opacity = 1)}
        >
          {user.plan === "ultra"
            ? "⚙️ Manage Plan"
            : user.plan === "pro"
            ? "👑 Upgrade to Ultra"
            : "⚡ Upgrade — from $5/mo"}
        </button>
      </div>

      {/* ===== ANALYTICS CARD ===== */}
      <div
        style={{
          padding: 28,
          borderRadius: 24,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%",
            height: 2,
            background: "linear-gradient(90deg,#06b6d4,#8b5cf6)",
          }}
        />

        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "white",
            marginBottom: 8,
          }}
        >
          Generation Activity
        </h3>

        <p style={{ fontSize: 12, color: "#475569", marginBottom: 24 }}>
          This week's video generation
        </p>

        {/* Chart */}
        <div
          style={{
            height: 120,
            display: "flex",
            alignItems: "flex-end",
            gap: 10,
            marginBottom: 10,
          }}
        >
          {heights.map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                borderRadius: "8px 8px 0 0",
                background: "linear-gradient(180deg,#8b5cf6,#ec4899)",
                opacity: i === heights.length - 1 ? 1 : 0.5 + i * 0.08,
                transition: "opacity 0.3s",
              }}
            />
          ))}
        </div>

        {/* Labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {weeks.map((w) => (
            <span
              key={w}
              style={{
                fontSize: 11,
                color: "#475569",
                fontWeight: 600,
              }}
            >
              {w}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 20,
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "10px 12px",
              background: "rgba(139,92,246,0.08)",
              borderRadius: 10,
              border: "1px solid rgba(139,92,246,0.15)",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 800, color: "white" }}>
              {user.plan === "ultra" ? "∞" : user.credits}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
              Left Today
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: "10px 12px",
              background: "rgba(16,185,129,0.08)",
              borderRadius: 10,
              border: "1px solid rgba(16,185,129,0.15)",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 800, color: "#10b981" }}>
              {maxCredits === 999999 ? "∞" : maxCredits}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
              Total Limit
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default CreditsPanel;