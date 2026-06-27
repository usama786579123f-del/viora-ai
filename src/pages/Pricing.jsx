import { useState } from "react";

function Pricing({ onSelectPlan, onBack }) {
  const [loading, setLoading] = useState(null);
  const [billing, setBilling] = useState("monthly"); // "monthly" | "yearly"

  const subscribe = (plan) => {
    setLoading(plan);
    setTimeout(() => {
      onSelectPlan(plan);
      setLoading(null);
    }, 1500);
  };

  const plans = [
    {
      id: "free",
      name: "FREE",
      monthlyPrice: 0,
      yearlyPrice: 0,
      period: "forever",
      badge: null,
      credits: "5 videos/day",
      quality: "1080p",
      features: [
        { text: "5 Videos Daily (auto reset)", ok: true },
        { text: "1080p Quality", ok: true },
        { text: "No Watermark / No Logo", ok: true },
        { text: "Basic AI Prompts", ok: true },
        { text: "Gallery Access", ok: true },
        { text: "2K / 4K Quality", ok: false },
        { text: "Priority Queue", ok: false },
        { text: "AI Voice Features", ok: false },
      ],
      btnText: "Start Free",
      highlight: false,
    },
    {
      id: "pro",
      name: "PRO",
      monthlyPrice: 5,
      yearlyPrice: 3,
      period: "/month",
      badge: "🔥 Most Popular",
      credits: "200 videos/month",
      quality: "2K",
      features: [
        { text: "200 Videos / Month", ok: true },
        { text: "1080p + 2K Quality", ok: true },
        { text: "No Watermark / No Logo", ok: true },
        { text: "Priority Queue", ok: true },
        { text: "Advanced AI Prompts", ok: true },
        { text: "All Templates", ok: true },
        { text: "AI Voice (50+ Languages)", ok: true },
        { text: "4K Quality", ok: false },
      ],
      btnText: "Get Pro",
      highlight: true,
    },
    {
      id: "ultra",
      name: "ULTRA",
      monthlyPrice: 15,
      yearlyPrice: 10,
      period: "/month",
      badge: "👑 Best Value",
      credits: "Unlimited videos",
      quality: "4K",
      features: [
        { text: "Unlimited Videos", ok: true },
        { text: "4K Quality", ok: true },
        { text: "No Watermark / No Logo", ok: true },
        { text: "Fastest Generation", ok: true },
        { text: "All Pro Features", ok: true },
        { text: "AI Voice (50+ Languages)", ok: true },
        { text: "API Access", ok: true },
        { text: "Priority Support 24/7", ok: true },
      ],
      btnText: "Get Ultra",
      highlight: false,
    },
  ];

  const getPrice = (plan) => {
    if (plan.monthlyPrice === 0) return "$0";
    const price =
      billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
    return `$${price}`;
  };

  const getSaving = (plan) => {
    if (plan.monthlyPrice === 0) return null;
    const saved =
      (plan.monthlyPrice - plan.yearlyPrice) * 12;
    return `Save $${saved}/year`;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050816",
        padding: "40px 30px",
        color: "white",
        fontFamily: "inherit",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glows */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 500,
          background:
            "radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "white",
          padding: "10px 20px",
          borderRadius: 12,
          cursor: "pointer",
          marginBottom: 40,
          fontSize: 14,
          fontWeight: 600,
          position: "relative",
          zIndex: 1,
        }}
      >
        ← Back
      </button>

      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 40,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(139,92,246,0.12)",
            border: "1px solid rgba(139,92,246,0.25)",
            color: "#a78bfa",
            padding: "8px 22px",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 18,
            letterSpacing: 0.5,
          }}
        >
          ⚡ Simple & Affordable Pricing
        </div>

        <h1
          style={{
            fontSize: 46,
            fontWeight: 900,
            marginBottom: 12,
            background:
              "linear-gradient(135deg,#ffffff,#a78bfa 60%,#ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Start Creating Today
        </h1>

        <p style={{ color: "#64748b", fontSize: 17, marginBottom: 32 }}>
          No hidden fees. Cancel anytime. Free plan always available.
        </p>

        {/* Billing Toggle */}
        <div
          style={{
            display: "inline-flex",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 5,
            gap: 4,
          }}
        >
          {["monthly", "yearly"].map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              style={{
                padding: "10px 24px",
                border: "none",
                cursor: "pointer",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 14,
                color: billing === b ? "white" : "#64748b",
                background:
                  billing === b
                    ? "linear-gradient(135deg,#8b5cf6,#ec4899)"
                    : "transparent",
                transition: "all 0.25s",
                position: "relative",
              }}
            >
              {b === "monthly" ? "Monthly" : "Yearly"}
              {b === "yearly" && (
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: 10,
                    fontWeight: 800,
                    background: "#10b981",
                    color: "white",
                    padding: "2px 7px",
                    borderRadius: 999,
                  }}
                >
                  -40%
                </span>
              )}
            </button>
          ))}
        </div>

        {billing === "yearly" && (
          <div
            style={{
              marginTop: 12,
              fontSize: 14,
              color: "#10b981",
              fontWeight: 600,
            }}
          >
            🎉 Yearly plan — pay less, save more!
          </div>
        )}
      </div>

      {/* Plans Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 22,
          maxWidth: 1050,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: plan.highlight
                ? "linear-gradient(160deg,rgba(139,92,246,0.15),rgba(236,72,153,0.1))"
                : "rgba(255,255,255,0.03)",
              border: plan.highlight
                ? "1px solid rgba(139,92,246,0.5)"
                : "1px solid rgba(255,255,255,0.08)",
              borderRadius: 26,
              padding: "32px 28px",
              position: "relative",
              transition: "transform 0.3s, box-shadow 0.3s",
              boxShadow: plan.highlight
                ? "0 0 40px rgba(139,92,246,0.15)"
                : "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow =
                "0 20px 50px rgba(139,92,246,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = plan.highlight
                ? "0 0 40px rgba(139,92,246,0.15)"
                : "none";
            }}
          >
            {/* Top gradient line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background:
                  "linear-gradient(90deg,#8b5cf6,#ec4899)",
                borderRadius: "26px 26px 0 0",
              }}
            />

            {/* Popular Badge */}
            {plan.badge && (
              <div
                style={{
                  position: "absolute",
                  top: -14,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background:
                    "linear-gradient(135deg,#8b5cf6,#ec4899)",
                  padding: "6px 20px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  boxShadow: "0 4px 15px rgba(139,92,246,0.4)",
                }}
              >
                {plan.badge}
              </div>
            )}

            {/* Plan name */}
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#64748b",
                letterSpacing: 2,
                marginBottom: 14,
                marginTop: plan.badge ? 10 : 0,
              }}
            >
              {plan.name}
            </div>

            {/* Price */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 4,
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: 54,
                  fontWeight: 900,
                  color: "white",
                  lineHeight: 1,
                }}
              >
                {getPrice(plan)}
              </span>
              <span style={{ fontSize: 15, color: "#64748b" }}>
                {plan.monthlyPrice === 0 ? " forever" : "/mo"}
              </span>
            </div>

            {/* Yearly saving */}
            {billing === "yearly" && plan.monthlyPrice > 0 && (
              <div
                style={{
                  fontSize: 13,
                  color: "#10b981",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                🎉 {getSaving(plan)}
              </div>
            )}

            {/* Billed yearly note */}
            {billing === "yearly" && plan.monthlyPrice > 0 && (
              <div
                style={{
                  fontSize: 12,
                  color: "#475569",
                  marginBottom: 16,
                }}
              >
                Billed ${plan.yearlyPrice * 12}/year
              </div>
            )}

            {/* Credits badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(139,92,246,0.12)",
                border: "1px solid rgba(139,92,246,0.2)",
                borderRadius: 10,
                padding: "7px 14px",
                fontSize: 13,
                fontWeight: 700,
                color: "#a78bfa",
                marginBottom: 10,
              }}
            >
              ⚡ {plan.credits}
            </div>

            {/* Quality badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(6,182,212,0.1)",
                border: "1px solid rgba(6,182,212,0.2)",
                borderRadius: 10,
                padding: "7px 14px",
                fontSize: 13,
                fontWeight: 700,
                color: "#22d3ee",
                marginBottom: 22,
                marginLeft: 8,
              }}
            >
              🎬 {plan.quality}
            </div>

            {/* Features */}
            <div style={{ marginBottom: 26 }}>
              {plan.features.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 14,
                    color: f.ok ? "#cbd5e1" : "#334155",
                    marginBottom: 10,
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ fontSize: 15, flexShrink: 0 }}>
                    {f.ok ? "✅" : "❌"}
                  </span>
                  {f.text}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => subscribe(plan.id)}
              disabled={loading === plan.id}
              style={{
                width: "100%",
                height: 54,
                border: "none",
                cursor:
                  loading === plan.id ? "not-allowed" : "pointer",
                borderRadius: 15,
                fontWeight: 800,
                fontSize: 15,
                color: "white",
                background:
                  plan.id === "free"
                    ? "rgba(255,255,255,0.08)"
                    : "linear-gradient(135deg,#8b5cf6,#ec4899)",
                boxShadow:
                  plan.id !== "free"
                    ? "0 10px 28px rgba(139,92,246,0.3)"
                    : "none",
                opacity: loading === plan.id ? 0.6 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {loading === plan.id
                ? "⏳ Processing..."
                : plan.id === "free"
                ? "Start Free →"
                : billing === "yearly"
                ? `Get ${plan.name} Yearly →`
                : `Get ${plan.name} →`}
            </button>
          </div>
        ))}
      </div>

      {/* Yearly comparison */}
      {billing === "yearly" && (
        <div
          style={{
            maxWidth: 1050,
            margin: "30px auto 0",
            padding: "20px 28px",
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.15)",
            borderRadius: 18,
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: 16,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#10b981",
              }}
            >
              ${(5 - 3) * 12}/year
            </div>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              Pro Plan — you save this
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#10b981",
              }}
            >
              ${(15 - 10) * 12}/year
            </div>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              Ultra Plan — you save this
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "white",
              }}
            >
              🎉 Best Deal
            </div>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              Pay once, use all year
            </div>
          </div>
        </div>
      )}

      {/* Free plan — no watermark note */}
      <div
        style={{
          textAlign: "center",
          marginTop: 30,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "12px 24px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14,
            fontSize: 14,
            color: "#64748b",
            lineHeight: 1.7,
          }}
        >
          ✅ Free plan includes{" "}
          <strong style={{ color: "white" }}>
            NO watermark & NO logo
          </strong>{" "}
          — so you enjoy the quality and upgrade when ready!
          <br />
          🔒 Secure payment &nbsp;•&nbsp; Cancel anytime
          &nbsp;•&nbsp; No credit card for free
        </div>
      </div>
    </div>
  );
}

export default Pricing;