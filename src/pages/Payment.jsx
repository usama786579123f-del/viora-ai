import { useState } from "react";

const VALID_COUPONS = {
  "VIORA20": { discount: 20, type: "percent", desc: "20% off" },
  "VIORA50": { discount: 50, type: "percent", desc: "50% off" },
  "SAVE1": { discount: 1, type: "flat", desc: "$1 off" },
  "WELCOME": { discount: 30, type: "percent", desc: "30% welcome discount" },
};

function Payment({ plan, billing, user, onSuccess, onBack }) {
  const [method, setMethod] = useState(null);
  const [step, setStep] = useState("select");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [referral, setReferral] = useState("");
  const [referralValid, setReferralValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txnId, setTxnId] = useState("");
  const [txnError, setTxnError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // ===== PRICES (USD) =====
  const prices = {
    pro:   { monthly: 3,  yearly: 2  },
    ultra: { monthly: 8,  yearly: 5  },
  };

  const basePrice =
    plan === "free"
      ? 0
      : billing === "yearly"
      ? prices[plan]?.yearly * 12
      : prices[plan]?.monthly;

  let finalPrice = basePrice;
  if (couponApplied) {
    if (couponApplied.type === "percent") {
      finalPrice = Math.round((basePrice - (basePrice * couponApplied.discount) / 100) * 100) / 100;
    } else {
      finalPrice = Math.max(0, basePrice - couponApplied.discount);
    }
  }
  if (referralValid) {
    finalPrice = Math.round(finalPrice * 0.9 * 100) / 100;
  }

  const applyCoupon = () => {
    setCouponError("");
    const code = coupon.trim().toUpperCase();
    if (!code) { setCouponError("Enter a coupon code"); return; }
    if (VALID_COUPONS[code]) {
      setCouponApplied(VALID_COUPONS[code]);
    } else {
      setCouponError("Invalid coupon code");
      setCouponApplied(null);
    }
  };

  const checkReferral = () => {
    const ref = referral.trim().toUpperCase();
    const users = JSON.parse(localStorage.getItem("vioraUsers") || "[]");
    const found = users.find((u) => u.referralCode && u.referralCode.toUpperCase() === ref);
    if (found && found.email !== user?.email) {
      setReferralValid(true);
    } else {
      setReferralValid(false);
      alert("Invalid referral code");
    }
  };

  const validatePhone = (num) => {
    const cleaned = num.replace(/\s/g, "");
    return /^(03\d{9}|3\d{9}|\+923\d{9})$/.test(cleaned);
  };

  const handlePaymentSubmit = () => {
    setTxnError("");
    setPhoneError("");

    if (!phone.trim()) { setPhoneError("Enter your mobile number"); return; }
    if (!validatePhone(phone)) { setPhoneError("Enter valid Pakistani number (03XXXXXXXXX)"); return; }
    if (!txnId.trim()) { setTxnError("Enter Transaction ID"); return; }
    if (txnId.trim().length < 6) { setTxnError("Transaction ID is too short"); return; }

    setLoading(true);

    const order = {
      id: "ORD-" + Date.now(),
      userEmail: user?.email,
      userName: user?.name,
      plan,
      billing,
      amount: finalPrice,
      currency: "USD",
      method,
      phone: phone.trim(),
      txnId: txnId.trim(),
      coupon: couponApplied ? coupon.toUpperCase() : null,
      referral: referralValid ? referral.toUpperCase() : null,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem("vioraOrders") || "[]");
    orders.push(order);
    localStorage.setItem("vioraOrders", JSON.stringify(orders));

    setTimeout(() => {
      setLoading(false);
      setStep("success");
      setTimeout(() => { onSuccess(plan, order.id); }, 3000);
    }, 2000);
  };

  const card = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "22px 24px",
    marginBottom: 18,
    position: "relative",
  };

  const inputStyle = {
    width: "100%", height: 52,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 13, padding: "0 16px",
    color: "white", fontSize: 15, outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block", fontSize: 13,
    fontWeight: 600, color: "#94a3b8", marginBottom: 8,
  };

  if (step === "success") {
    return (
      <div style={{
        minHeight: "100vh", background: "#050816",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "inherit",
      }}>
        <div style={{ textAlign: "center", padding: 40, maxWidth: 500 }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%",
            background: "linear-gradient(135deg,#10b981,#059669)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 48, margin: "0 auto 24px",
            boxShadow: "0 20px 50px rgba(16,185,129,0.3)",
          }}>✅</div>

          <h1 style={{ fontSize: 32, fontWeight: 900, color: "white", marginBottom: 12 }}>
            Payment Submitted!
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
            Your payment is being verified.<br />
            Your <strong style={{ color: "#a78bfa" }}>{plan?.toUpperCase()}</strong> plan
            will be activated within <strong style={{ color: "white" }}>a few minutes.</strong>
          </p>

          <div style={{
            background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: 16, padding: "16px 20px", marginBottom: 24,
            fontSize: 14, color: "#94a3b8", lineHeight: 1.8,
          }}>
            📧 Confirmation: <strong style={{ color: "white" }}>{user?.email}</strong><br />
            📱 Keep your Transaction ID safe
          </div>

          <p style={{ color: "#475569", fontSize: 13 }}>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#050816",
      padding: "30px 20px", color: "white",
      fontFamily: "inherit", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "-10%", left: "30%",
        width: 600, height: 400,
        background: "radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />

      <button onClick={onBack} style={{
        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
        color: "white", padding: "10px 20px", borderRadius: 12, cursor: "pointer",
        marginBottom: 30, fontSize: 14, fontWeight: 600, position: "relative", zIndex: 1,
      }}>
        ← Back
      </button>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 380px",
        gap: 28, maxWidth: 1000, margin: "0 auto",
        position: "relative", zIndex: 1,
      }}>

        {/* LEFT */}
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 900, marginBottom: 6 }}>Complete Payment</h1>
          <p style={{ color: "#64748b", marginBottom: 28, fontSize: 15 }}>
            Choose your payment method below
          </p>

          {/* Method */}
          <div style={{ ...card }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
              Payment Method
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { id: "jazzcash", label: "JazzCash", icon: "💜", color: "#7c3aed" },
                { id: "easypaisa", label: "EasyPaisa", icon: "💚", color: "#059669" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  style={{
                    padding: 16,
                    border: method === m.id ? `2px solid ${m.color}` : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    background: method === m.id
                      ? `rgba(${m.id === "jazzcash" ? "124,58,237" : "5,150,105"},0.12)`
                      : "rgba(255,255,255,0.03)",
                    cursor: "pointer", color: "white", textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{m.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Mobile Account</div>
                  {method === m.id && (
                    <div style={{ marginTop: 8, fontSize: 12, color: m.color, fontWeight: 700 }}>✓ Selected</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          {method && (
            <div style={{
              ...card,
              border: method === "jazzcash" ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(5,150,105,0.3)",
              background: method === "jazzcash" ? "rgba(124,58,237,0.06)" : "rgba(5,150,105,0.06)",
            }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, color: method === "jazzcash" ? "#a78bfa" : "#34d399" }}>
                {method === "jazzcash" ? "💜 JazzCash Instructions" : "💚 EasyPaisa Instructions"}
              </div>
              <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.9 }}>
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "14px 16px" }}>
                  <strong style={{ color: "white" }}>Step 1:</strong> Open your {method === "jazzcash" ? "JazzCash" : "EasyPaisa"} app<br />
                  <strong style={{ color: "white" }}>Step 2:</strong> Go to <strong style={{ color: "white" }}>Send Money</strong><br />
                  <strong style={{ color: "white" }}>Step 3:</strong> Send{" "}
                  <strong style={{ color: "#a78bfa", fontSize: 16 }}>${finalPrice}</strong> USD equivalent to Viora AI account<br />
                  <strong style={{ color: "white" }}>Step 4:</strong> Copy the <strong style={{ color: "white" }}>Transaction ID</strong><br />
                  <strong style={{ color: "white" }}>Step 5:</strong> Paste it below and submit
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          {method && (
            <div style={{ ...card }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, color: "white" }}>
                📋 Enter Payment Details
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Your Mobile Number</label>
                <input
                  type="tel" placeholder="03XXXXXXXXX"
                  value={phone} onChange={(e) => { setPhone(e.target.value); setPhoneError(""); }}
                  style={{ ...inputStyle, border: phoneError ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)" }}
                />
                {phoneError && <div style={{ color: "#f87171", fontSize: 12, marginTop: 6 }}>⚠️ {phoneError}</div>}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Transaction ID / Reference Number</label>
                <input
                  type="text" placeholder="e.g. TXN123456789"
                  value={txnId} onChange={(e) => { setTxnId(e.target.value); setTxnError(""); }}
                  style={{ ...inputStyle, border: txnError ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)" }}
                />
                {txnError && <div style={{ color: "#f87171", fontSize: 12, marginTop: 6 }}>⚠️ {txnError}</div>}
              </div>

              <button
                onClick={handlePaymentSubmit}
                disabled={loading}
                style={{
                  width: "100%", height: 58, border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  borderRadius: 15, fontWeight: 800, fontSize: 17, color: "white",
                  background: loading ? "rgba(139,92,246,0.4)" : "linear-gradient(135deg,#8b5cf6,#ec4899)",
                  boxShadow: loading ? "none" : "0 12px 35px rgba(139,92,246,0.35)",
                }}
              >
                {loading ? "⏳ Verifying..." : `✅ Confirm Payment — $${finalPrice}`}
              </button>

              <p style={{ textAlign: "center", color: "#334155", fontSize: 12, marginTop: 12 }}>
                🔒 Your payment details are secure and encrypted
              </p>
            </div>
          )}
        </div>

        {/* RIGHT — Order Summary */}
        <div>
          <div style={{ ...card, position: "sticky", top: 20 }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
              borderRadius: "20px 20px 0 0",
            }} />

            <div style={{ fontSize: 15, fontWeight: 800, color: "white", marginBottom: 20 }}>
              🛒 Order Summary
            </div>

            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 14,
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "white" }}>{plan?.toUpperCase()} Plan</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{billing === "yearly" ? "Billed yearly" : "Billed monthly"}</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "white" }}>${basePrice}</div>
            </div>

            {/* Coupon */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>🎟️ Coupon Code</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text" placeholder="Enter code"
                  value={coupon}
                  onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponError(""); setCouponApplied(null); }}
                  style={{ ...inputStyle, flex: 1, height: 46, fontSize: 14 }}
                />
                <button onClick={applyCoupon} style={{
                  height: 46, padding: "0 16px", border: "none", cursor: "pointer",
                  borderRadius: 12, fontWeight: 700, fontSize: 13, color: "white",
                  background: "linear-gradient(135deg,#8b5cf6,#ec4899)", whiteSpace: "nowrap",
                }}>Apply</button>
              </div>
              {couponError && <div style={{ color: "#f87171", fontSize: 12, marginTop: 6 }}>⚠️ {couponError}</div>}
              {couponApplied && <div style={{ color: "#10b981", fontSize: 13, marginTop: 6, fontWeight: 600 }}>✅ {couponApplied.desc}</div>}
            </div>

            {/* Referral */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>👥 Referral Code</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text" placeholder="Friend's code"
                  value={referral}
                  onChange={(e) => { setReferral(e.target.value.toUpperCase()); setReferralValid(false); }}
                  style={{ ...inputStyle, flex: 1, height: 46, fontSize: 14 }}
                />
                <button onClick={checkReferral} style={{
                  height: 46, padding: "0 16px", border: "none", cursor: "pointer",
                  borderRadius: 12, fontWeight: 700, fontSize: 13, color: "white",
                  background: "rgba(255,255,255,0.08)", whiteSpace: "nowrap",
                }}>Check</button>
              </div>
              {referralValid && <div style={{ color: "#10b981", fontSize: 13, marginTop: 6, fontWeight: 600 }}>✅ Referral valid — extra 10% off!</div>}
            </div>

            {/* Price breakdown */}
            <div style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: "14px 16px", marginBottom: 18,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#64748b", marginBottom: 8 }}>
                <span>Base Price</span><span>${basePrice}</span>
              </div>
              {couponApplied && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#10b981", marginBottom: 8 }}>
                  <span>Coupon ({couponApplied.desc})</span>
                  <span>-${(basePrice - finalPrice).toFixed(2)}</span>
                </div>
              )}
              {referralValid && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#10b981", marginBottom: 8 }}>
                  <span>Referral (10% off)</span>
                  <span>-${(basePrice * 0.1).toFixed(2)}</span>
                </div>
              )}
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 18, fontWeight: 900, color: "white",
                paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)",
              }}>
                <span>Total</span>
                <span style={{
                  background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  ${finalPrice}
                </span>
              </div>
            </div>

            {/* Badges */}
            {["🔒 256-bit encrypted", "✅ Instant activation", "🔄 Cancel anytime", "📞 24/7 support"].map((b) => (
              <div key={b} style={{ fontSize: 13, color: "#475569", marginBottom: 6 }}>{b}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;