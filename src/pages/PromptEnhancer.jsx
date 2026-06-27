import { useState } from "react";

function PromptEnhancer({ onBack, user, setUser, openPricing }) {
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [style, setStyle] = useState("Cinematic");
  const [quality, setQuality] = useState("Ultra");
  const [camera, setCamera] = useState("Dynamic");
  const [lighting, setLighting] = useState("Cinematic");
  const [loading, setLoading] = useState(false);
  const [enhanced, setEnhanced] = useState("");
  const [variations, setVariations] = useState([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("enhanced");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const styles = [
    { id: "Cinematic",   emoji: "🎬", desc: "Movie quality" },
    { id: "Horror",      emoji: "👻", desc: "Dark & scary" },
    { id: "Anime",       emoji: "🌸", desc: "Japanese animation" },
    { id: "Realistic",   emoji: "📸", desc: "Hyper realistic" },
    { id: "Fantasy",     emoji: "🧙", desc: "Magical world" },
    { id: "Sci-Fi",      emoji: "🚀", desc: "Futuristic" },
    { id: "Nature",      emoji: "🌿", desc: "Natural beauty" },
    { id: "Action",      emoji: "💥", desc: "High energy" },
    { id: "Romantic",    emoji: "❤️", desc: "Emotional" },
    { id: "Documentary", emoji: "📽️", desc: "Real & raw" },
    { id: "Vintage",     emoji: "🎞️", desc: "Old film style" },
    { id: "Abstract",    emoji: "🎨", desc: "Artistic" },
  ];

  const qualities = [
    { id: "Good",   desc: "720p quality" },
    { id: "High",   desc: "1080p quality" },
    { id: "Ultra",  desc: "4K quality" },
    { id: "Master", desc: "Cinema grade" },
  ];

  const cameraOptions = [
    { id: "Dynamic",  emoji: "🎥", desc: "Moving shots" },
    { id: "Aerial",   emoji: "🚁", desc: "Drone view" },
    { id: "Close-Up", emoji: "🔍", desc: "Detailed focus" },
    { id: "Wide",     emoji: "🌅", desc: "Landscape view" },
  ];

  const lightingOptions = [
    { id: "Cinematic",    emoji: "🎞️", desc: "Film lighting" },
    { id: "Golden Hour",  emoji: "🌅", desc: "Warm sunset" },
    { id: "Neon",         emoji: "🌈", desc: "Vibrant colors" },
    { id: "Dark",         emoji: "🌑", desc: "Low key moody" },
  ];

  const examples = [
    "A cat sitting on a chair",
    "Man walking in city",
    "Sunset over mountains",
    "Woman dancing in rain",
    "Car driving on road",
    "Dragon flying over castle",
  ];

  const enhancePrompt = async () => {
    if (!originalPrompt.trim()) {
      setError("Please enter a prompt to enhance");
      return;
    }

    setError("");
    setEnhanced("");
    setVariations([]);
    setLoading(true);

    const selectedStyle = styles.find((s) => s.id === style);

    const systemPrompt = `You are an expert AI video prompt engineer. You transform simple, basic prompts into highly detailed, professional prompts that produce stunning AI-generated videos. You understand cinematography, lighting, camera movements, and visual effects.`;

    const userPrompt = `Transform this basic prompt into professional AI video prompts.

Original Prompt: "${originalPrompt}"
Style: ${style} (${selectedStyle.desc})
Quality Level: ${quality}
Camera: ${camera}
Lighting: ${lighting}

Task 1 - ENHANCED PROMPT:
Create one ultra-detailed, professional prompt that will produce the best possible ${style} video. Include:
- Detailed scene description
- Camera movement: ${camera} shots
- Lighting: ${lighting} style
- Atmosphere and mood matching ${style}
- Technical quality: ${quality}, HDR, cinematic
- Motion and action details
- Color grading

Task 2 - VARIATIONS:
Create 3 different variations with different approaches (different camera angles, moods, or compositions).

Format EXACTLY like this:

ENHANCED:
[Your enhanced prompt here]

VARIATION1:
[First variation here]

VARIATION2:
[Second variation here]

VARIATION3:
[Third variation here]`;

    try {
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          max_tokens: 3000,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "API error");
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";
      if (!text) throw new Error("No response generated");

      const enhancedMatch = text.match(/ENHANCED:\s*([\s\S]*?)(?=VARIATION1:|$)/);
      const var1Match = text.match(/VARIATION1:\s*([\s\S]*?)(?=VARIATION2:|$)/);
      const var2Match = text.match(/VARIATION2:\s*([\s\S]*?)(?=VARIATION3:|$)/);
      const var3Match = text.match(/VARIATION3:\s*([\s\S]*?)$/);

      const enhancedText = enhancedMatch?.[1]?.trim() || text;
      const vars = [
        var1Match?.[1]?.trim(),
        var2Match?.[1]?.trim(),
        var3Match?.[1]?.trim(),
      ].filter(Boolean);

      setEnhanced(enhancedText);
      setVariations(vars);
      setActiveTab("enhanced");

      // Save history
      setHistory((prev) => [
        { id: Date.now(), original: originalPrompt, enhanced: enhancedText, style, quality, date: new Date().toLocaleString() },
        ...prev.slice(0, 9),
      ]);

    } catch (err) {
      setError("Failed to enhance: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getActiveText = () => {
    if (activeTab === "enhanced") return enhanced;
    if (activeTab === "variation1") return variations[0] || "";
    if (activeTab === "variation2") return variations[1] || "";
    if (activeTab === "variation3") return variations[2] || "";
    return "";
  };

  const copyActive = () => {
    navigator.clipboard.writeText(getActiveText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyVariation = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadAll = () => {
    let text = `Viora AI — Prompt Enhancer\nOriginal: ${originalPrompt}\nStyle: ${style} | Quality: ${quality}\n\n`;
    text += `=== ENHANCED ===\n${enhanced}\n\n`;
    variations.forEach((v, i) => {
      text += `=== VARIATION ${i + 1} ===\n${v}\n\n`;
    });
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `viora-prompt-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleFavorite = (text) => {
    setFavorites((prev) =>
      prev.includes(text) ? prev.filter((t) => t !== text) : [...prev, text]
    );
  };

  const wordCount = (text) => text.split(/\s+/).filter(Boolean).length;

  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 800,
    color: "#64748b", marginBottom: 10,
    textTransform: "uppercase", letterSpacing: 1,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050816", padding: "30px 20px", color: "white", fontFamily: "inherit", position: "relative", overflow: "hidden" }}>
      {/* Glows */}
      <div style={{ position: "absolute", top: "-10%", left: "30%", width: 600, height: 500, background: "radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, right: "10%", width: 400, height: 400, background: "radial-gradient(circle,rgba(236,72,153,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />

      {/* Back */}
      <button onClick={onBack} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "10px 20px", borderRadius: 12, cursor: "pointer", marginBottom: 30, fontSize: 14, fontWeight: 600, position: "relative", zIndex: 1 }}>
        ← Back
      </button>

      <div style={{ maxWidth: 1150, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-block", background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#a78bfa", padding: "8px 22px", borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 18 }}>
            ✨ AI Prompt Enhancer — Powered by DeepSeek AI
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 12, background: "linear-gradient(135deg,#ffffff,#a78bfa 50%,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI Video Prompt Enhancer
          </h1>
          <p style={{ color: "#64748b", fontSize: 17 }}>
            Simple prompt → Ultra professional video prompt in seconds
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 24, alignItems: "start" }}>

          {/* ===== LEFT ===== */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Input */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#8b5cf6,#ec4899)" }} />
              <label style={labelStyle}>✏️ Your Basic Prompt</label>
              <textarea
                value={originalPrompt}
                onChange={(e) => setOriginalPrompt(e.target.value)}
                placeholder="Enter simple prompt e.g: 'a cat walking in city'"
                style={{ width: "100%", height: 110, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 14px", color: "white", fontSize: 14, outline: "none", resize: "none", lineHeight: 1.6, boxSizing: "border-box", marginBottom: 12 }}
                onFocus={(e) => (e.target.style.border = "1px solid rgba(139,92,246,0.5)")}
                onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.1)")}
              />
              <div style={{ fontSize: 11, color: "#475569", marginBottom: 8, fontWeight: 600 }}>QUICK EXAMPLES:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {examples.map((ex) => (
                  <button key={ex} onClick={() => setOriginalPrompt(ex)} style={{ padding: "5px 10px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, background: "rgba(255,255,255,0.03)", color: "#94a3b8", cursor: "pointer", fontSize: 11, transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.target.style.background = "rgba(139,92,246,0.15)"; e.target.style.color = "white"; }}
                    onMouseLeave={(e) => { e.target.style.background = "rgba(255,255,255,0.03)"; e.target.style.color = "#94a3b8"; }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20 }}>
              <label style={labelStyle}>⭐ Output Quality</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                {qualities.map((q) => (
                  <button key={q.id} onClick={() => setQuality(q.id)} style={{ padding: "12px", border: quality === q.id ? "1px solid rgba(139,92,246,0.6)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 12, background: quality === q.id ? "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(236,72,153,0.2))" : "rgba(255,255,255,0.03)", color: quality === q.id ? "white" : "#64748b", cursor: "pointer", transition: "all 0.2s", textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: quality === q.id ? 700 : 500 }}>{q.id}</div>
                    <div style={{ fontSize: 11, color: quality === q.id ? "#a78bfa" : "#475569", marginTop: 2 }}>{q.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Camera */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20 }}>
              <label style={labelStyle}>🎥 Camera Style</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                {cameraOptions.map((c) => (
                  <button key={c.id} onClick={() => setCamera(c.id)} style={{ padding: "12px 8px", border: camera === c.id ? "1px solid rgba(139,92,246,0.6)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 12, background: camera === c.id ? "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(236,72,153,0.2))" : "rgba(255,255,255,0.03)", color: camera === c.id ? "white" : "#64748b", cursor: "pointer", transition: "all 0.2s", textAlign: "center" }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{c.emoji}</div>
                    <div style={{ fontSize: 12, fontWeight: camera === c.id ? 700 : 500 }}>{c.id}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lighting */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20 }}>
              <label style={labelStyle}>💡 Lighting Style</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                {lightingOptions.map((l) => (
                  <button key={l.id} onClick={() => setLighting(l.id)} style={{ padding: "12px 8px", border: lighting === l.id ? "1px solid rgba(139,92,246,0.6)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 12, background: lighting === l.id ? "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(236,72,153,0.2))" : "rgba(255,255,255,0.03)", color: lighting === l.id ? "white" : "#64748b", cursor: "pointer", transition: "all 0.2s", textAlign: "center" }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{l.emoji}</div>
                    <div style={{ fontSize: 12, fontWeight: lighting === l.id ? 700 : 500 }}>{l.id}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Enhance Button */}
            <button onClick={enhancePrompt} disabled={loading} style={{ width: "100%", height: 58, border: "none", cursor: loading ? "not-allowed" : "pointer", borderRadius: 16, fontWeight: 800, fontSize: 17, color: "white", background: loading ? "rgba(139,92,246,0.4)" : "linear-gradient(135deg,#8b5cf6,#ec4899)", boxShadow: loading ? "none" : "0 12px 35px rgba(139,92,246,0.35)", transition: "all 0.2s" }}>
              {loading ? "✨ Enhancing Prompt..." : "✨ Enhance Prompt"}
            </button>

            {error && (
              <div style={{ padding: "14px 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, color: "#f87171", fontSize: 14 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Before/After */}
            {enhanced && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20 }}>
                <label style={labelStyle}>📊 Before vs After</label>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 6 }}>❌ BEFORE:</div>
                  <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 10, fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>
                    {originalPrompt}
                  </div>
                </div>
                <div style={{ textAlign: "center", fontSize: 18, color: "#a78bfa", margin: "10px 0" }}>↓</div>
                <div>
                  <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 6 }}>✅ AFTER ({wordCount(enhanced)} words):</div>
                  <div style={{ padding: "10px 14px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 10, fontSize: 12, color: "#94a3b8", lineHeight: 1.6, maxHeight: 120, overflowY: "auto" }}>
                    {enhanced.slice(0, 200)}...
                  </div>
                </div>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>🕐 Recent Enhances</label>
                  <button onClick={() => setShowHistory(!showHistory)} style={{ fontSize: 11, color: "#a78bfa", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>
                    {showHistory ? "Less" : "More"}
                  </button>
                </div>
                {(showHistory ? history : history.slice(0, 3)).map((h) => (
                  <button key={h.id} onClick={() => { setOriginalPrompt(h.original); setEnhanced(h.enhanced); setStyle(h.style); }} style={{ width: "100%", padding: "9px 12px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, background: "rgba(255,255,255,0.02)", color: "white", cursor: "pointer", textAlign: "left", marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{h.original.slice(0, 40)}...</div>
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{h.style} • {h.quality} • {h.date}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== RIGHT ===== */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Style Grid */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20 }}>
              <label style={labelStyle}>🎭 Video Style</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {styles.map((s) => (
                  <button key={s.id} onClick={() => setStyle(s.id)} style={{ padding: "12px 8px", border: style === s.id ? "1px solid rgba(139,92,246,0.6)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 14, background: style === s.id ? "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(236,72,153,0.2))" : "rgba(255,255,255,0.03)", color: style === s.id ? "white" : "#64748b", cursor: "pointer", transition: "all 0.2s", textAlign: "center" }}>
                    <div style={{ fontSize: 22, marginBottom: 5 }}>{s.emoji}</div>
                    <div style={{ fontSize: 11, fontWeight: style === s.id ? 700 : 500 }}>{s.id}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Output */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#ec4899,#8b5cf6)" }} />

              {/* Tabs */}
              {(enhanced || loading) && (
                <div style={{ display: "flex", gap: 6, marginBottom: 16, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 4 }}>
                  {["enhanced", "variation1", "variation2", "variation3"].map((tab, i) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, height: 36, border: "none", cursor: "pointer", borderRadius: 9, fontWeight: 700, fontSize: 11, color: activeTab === tab ? "white" : "#64748b", background: activeTab === tab ? "linear-gradient(135deg,#8b5cf6,#ec4899)" : "transparent", transition: "all 0.2s" }}>
                      {i === 0 ? "✨ Best" : `V${i}`}
                    </button>
                  ))}
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div style={{ textAlign: "center", padding: "50px 20px" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 8 }}>Enhancing your prompt...</h3>
                  <p style={{ color: "#64748b", fontSize: 14 }}>{style} style • {quality} quality • {camera} camera • {lighting} lighting</p>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden", marginTop: 20, maxWidth: 250, margin: "20px auto 0" }}>
                    <div style={{ height: "100%", width: "65%", background: "linear-gradient(90deg,#8b5cf6,#ec4899)", borderRadius: 999 }} />
                  </div>
                </div>
              )}

              {/* Empty */}
              {!loading && !enhanced && (
                <div style={{ textAlign: "center", padding: "50px 20px", color: "#334155" }}>
                  <div style={{ fontSize: 48, marginBottom: 14 }}>✨</div>
                  <h3 style={{ fontSize: 16, color: "#475569", marginBottom: 6 }}>Enhanced prompt will appear here</h3>
                  <p style={{ fontSize: 13 }}>Enter basic prompt → Get professional version</p>
                </div>
              )}

              {/* Output Content */}
              {!loading && enhanced && (
                <div>
                  {/* Stats row */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                    {[
                      { label: "Words", value: wordCount(getActiveText()) },
                      { label: "Style", value: style },
                      { label: "Quality", value: quality },
                      { label: "Camera", value: camera },
                    ].map((item) => (
                      <div key={item.label} style={{ padding: "6px 12px", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)", borderRadius: 8, fontSize: 12, color: "#a78bfa", fontWeight: 600 }}>
                        {item.label}: <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>

                  {/* Active content */}
                  <div style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(139,92,246,0.15)", borderRadius: 14, padding: "18px 20px", fontSize: 14, color: "#e2e8f0", lineHeight: 1.8, marginBottom: 16, minHeight: 150, maxHeight: 280, overflowY: "auto", whiteSpace: "pre-wrap" }}>
                    {getActiveText() || "No variation available"}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    <button onClick={copyActive} style={{ flex: 1, height: 46, border: "none", cursor: "pointer", borderRadius: 12, fontWeight: 700, fontSize: 14, color: "white", background: copied ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#8b5cf6,#ec4899)", boxShadow: "0 6px 20px rgba(139,92,246,0.25)" }}>
                      {copied ? "✅ Copied!" : "📋 Copy Prompt"}
                    </button>
                    <button onClick={() => toggleFavorite(getActiveText())} style={{ height: 46, padding: "0 16px", border: "1px solid rgba(245,158,11,0.3)", cursor: "pointer", borderRadius: 12, fontWeight: 700, fontSize: 14, color: favorites.includes(getActiveText()) ? "#fbbf24" : "#64748b", background: favorites.includes(getActiveText()) ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.04)" }}>
                      {favorites.includes(getActiveText()) ? "⭐" : "☆"}
                    </button>
                    <button onClick={enhancePrompt} style={{ flex: 1, height: 46, border: "1px solid rgba(139,92,246,0.3)", cursor: "pointer", borderRadius: 12, fontWeight: 700, fontSize: 14, color: "white", background: "rgba(139,92,246,0.1)" }}>
                      🔄 Re-enhance
                    </button>
                    {enhanced && (
                      <button onClick={downloadAll} style={{ height: 46, padding: "0 16px", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", borderRadius: 12, fontWeight: 700, fontSize: 14, color: "white", background: "rgba(255,255,255,0.06)" }}>
                        ⬇️
                      </button>
                    )}
                  </div>

                  {/* Variations preview */}
                  {variations.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, color: "#475569", fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>OTHER VARIATIONS:</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {variations.map((v, i) => (
                          <div key={i} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, display: "flex", alignItems: "flex-start", gap: 10 }}>
                            <div style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(139,92,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#a78bfa", flexShrink: 0 }}>
                              V{i + 1}
                            </div>
                            <div style={{ flex: 1, fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
                              {v?.slice(0, 130)}...
                            </div>
                            <button onClick={() => copyVariation(v, i)} style={{ height: 28, padding: "0 10px", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", borderRadius: 7, fontWeight: 700, fontSize: 10, color: "white", background: copiedIndex === i ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)", flexShrink: 0 }}>
                              {copiedIndex === i ? "✅" : "📋"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Favorites */}
                  {favorites.length > 0 && (
                    <div style={{ marginTop: 16, padding: 16, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#fbbf24", marginBottom: 10 }}>⭐ SAVED FAVORITES ({favorites.length})</div>
                      {favorites.map((f, i) => (
                        <div key={i} style={{ padding: "10px 12px", background: "rgba(245,158,11,0.06)", borderRadius: 10, fontSize: 12, color: "#fde68a", lineHeight: 1.5, marginBottom: 6 }}>
                          {f.slice(0, 150)}...
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromptEnhancer;