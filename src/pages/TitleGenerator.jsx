import { useState } from "react";

function TitleGenerator({ onBack, user, setUser, openPricing }) {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [platform, setPlatform] = useState("YouTube");
  const [style, setStyle] = useState("Viral");
  const [count, setCount] = useState("10");
  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState([]);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [allCopied, setAllCopied] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const languages = [
    "English", "Urdu", "Hindi", "Arabic",
    "Spanish", "French", "Turkish", "Bengali",
    "Punjabi", "German",
  ];

  const platforms = [
    { id: "YouTube",   icon: "▶️" },
    { id: "TikTok",   icon: "🎵" },
    { id: "Instagram", icon: "📸" },
    { id: "Facebook", icon: "📘" },
    { id: "Twitter",  icon: "🐦" },
    { id: "Blog",     icon: "📝" },
  ];

  const styles = [
    { id: "Viral",        emoji: "🔥", desc: "Maximum clicks & shares" },
    { id: "Horror",       emoji: "👻", desc: "Dark & scary" },
    { id: "Thriller",     emoji: "😱", desc: "Edge of seat" },
    { id: "Clickbait",    emoji: "💥", desc: "Curiosity driven" },
    { id: "Educational",  emoji: "📚", desc: "Informative & clear" },
    { id: "Motivational", emoji: "💪", desc: "Inspiring & powerful" },
    { id: "Comedy",       emoji: "😂", desc: "Funny & entertaining" },
    { id: "News",         emoji: "📰", desc: "Breaking & urgent" },
    { id: "Mystery",      emoji: "🔍", desc: "Suspense & intrigue" },
    { id: "Romantic",     emoji: "❤️", desc: "Emotional & touching" },
    { id: "Documentary",  emoji: "🎬", desc: "Real & factual" },
    { id: "Gaming",       emoji: "🎮", desc: "Epic & exciting" },
  ];

  const counts = ["5", "10", "15", "20"];

  const generateTitles = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setError("");
    setTitles([]);
    setSearchFilter("");
    setLoading(true);

    const selectedStyle = styles.find((s) => s.id === style);

    const systemPrompt = `You are a world-class viral title writer and SEO expert. You create irresistible, high-CTR titles that get maximum clicks, views, and engagement. You write in ${language} language only. Your titles are platform-optimized for ${platform}.`;

    const userPrompt = `Generate exactly ${count} ultra-viral ${style} titles in ${language} language for ${platform}.

Topic: ${topic}
Style: ${style} (${selectedStyle.desc})
Platform: ${platform}
Language: ${language} ONLY

Requirements:
- Every title must be in ${language} language
- Style: ${style} ${selectedStyle.emoji}
- Platform optimized for ${platform}
- Maximum engagement and CTR
- Use power words, numbers, emotions
- Include emojis where appropriate
- Mix different title formats:
  * Question titles
  * Number titles (Top 10, 5 Reasons...)
  * Shock/surprise titles
  * How-to titles
  * Story titles
  * Secret/reveal titles

IMPORTANT: Return ONLY a numbered list of titles, nothing else.
Format:
1. Title here
2. Title here
...`;

    try {
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          max_tokens: 2000,
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
      if (!text) throw new Error("No titles generated");

      const parsed = text
        .split("\n")
        .filter((line) => line.match(/^\d+\./))
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter((t) => t.length > 0);

      const finalTitles = parsed.length > 0
        ? parsed
        : text.split("\n").map((l) => l.trim()).filter((l) => l.length > 5);

      setTitles(finalTitles);

      // Save to history
      setHistory((prev) => [
        { id: Date.now(), topic, platform, style, language, count: finalTitles.length, titles: finalTitles, date: new Date().toLocaleString() },
        ...prev.slice(0, 9),
      ]);

    } catch (err) {
      setError("Failed to generate: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyTitle = (title, index) => {
    navigator.clipboard.writeText(title);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(titles.map((t, i) => `${i + 1}. ${t}`).join("\n"));
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2500);
  };

  const toggleFavorite = (title) => {
    setFavorites((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const downloadTitles = () => {
    const text = `Viora AI — Title Generator\nTopic: ${topic} | Platform: ${platform} | Style: ${style}\n\n` +
      titles.map((t, i) => `${i + 1}. ${t}`).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `viora-titles-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredTitles = titles.filter((t) =>
    t.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const favoriteTitles = titles.filter((t) => favorites.includes(t));

  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 800,
    color: "#64748b", marginBottom: 10,
    textTransform: "uppercase", letterSpacing: 1,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050816", padding: "30px 20px", color: "white", fontFamily: "inherit", position: "relative", overflow: "hidden" }}>
      {/* Glows */}
      <div style={{ position: "absolute", top: "-10%", left: "30%", width: 600, height: 500, background: "radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, right: "10%", width: 400, height: 400, background: "radial-gradient(circle,rgba(236,72,153,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />

      {/* Back */}
      <button onClick={onBack} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "10px 20px", borderRadius: 12, cursor: "pointer", marginBottom: 30, fontSize: 14, fontWeight: 600, position: "relative", zIndex: 1 }}>
        ← Back
      </button>

      <div style={{ maxWidth: 1150, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-block", background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#a78bfa", padding: "8px 22px", borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 18 }}>
            💡 AI Title Generator — Powered by DeepSeek AI
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 12, background: "linear-gradient(135deg,#ffffff,#a78bfa 50%,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Viral Title Generator
          </h1>
          <p style={{ color: "#64748b", fontSize: 17 }}>
            Any platform • Any style • Any language — Maximum CTR titles
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24, alignItems: "start" }}>

          {/* ===== LEFT ===== */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Topic */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#8b5cf6,#ec4899)" }} />
              <label style={labelStyle}>📌 Topic / Idea</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Ghost encounters in abandoned hospital, weight loss journey, viral cooking recipe..."
                style={{ width: "100%", height: 100, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 14px", color: "white", fontSize: 14, outline: "none", resize: "none", lineHeight: 1.6, boxSizing: "border-box" }}
                onFocus={(e) => (e.target.style.border = "1px solid rgba(139,92,246,0.5)")}
                onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.1)")}
              />
              <div style={{ fontSize: 12, color: "#334155", marginTop: 5, textAlign: "right" }}>{topic.length} chars</div>
            </div>

            {/* Platform */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20 }}>
              <label style={labelStyle}>📱 Platform</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {platforms.map((p) => (
                  <button key={p.id} onClick={() => setPlatform(p.id)} style={{ height: 50, border: platform === p.id ? "1px solid rgba(139,92,246,0.6)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 12, background: platform === p.id ? "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(236,72,153,0.2))" : "rgba(255,255,255,0.03)", color: platform === p.id ? "white" : "#64748b", cursor: "pointer", fontWeight: platform === p.id ? 700 : 500, fontSize: 12, transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                    <span style={{ fontSize: 16 }}>{p.icon}</span>
                    <span>{p.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20 }}>
              <label style={labelStyle}>🌍 Language</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 7 }}>
                {languages.map((lang) => (
                  <button key={lang} onClick={() => setLanguage(lang)} style={{ height: 40, border: language === lang ? "1px solid rgba(139,92,246,0.6)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 10, background: language === lang ? "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(236,72,153,0.2))" : "rgba(255,255,255,0.03)", color: language === lang ? "white" : "#94a3b8", cursor: "pointer", fontWeight: language === lang ? 700 : 500, fontSize: 12, transition: "all 0.2s" }}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20 }}>
              <label style={labelStyle}>🔢 How Many Titles</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                {counts.map((c) => (
                  <button key={c} onClick={() => setCount(c)} style={{ height: 46, border: count === c ? "1px solid rgba(139,92,246,0.6)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 11, background: count === c ? "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(236,72,153,0.2))" : "rgba(255,255,255,0.03)", color: count === c ? "white" : "#64748b", cursor: "pointer", fontWeight: count === c ? 800 : 500, fontSize: 16, transition: "all 0.2s" }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate */}
            <button onClick={generateTitles} disabled={loading} style={{ width: "100%", height: 58, border: "none", cursor: loading ? "not-allowed" : "pointer", borderRadius: 16, fontWeight: 800, fontSize: 17, color: "white", background: loading ? "rgba(139,92,246,0.4)" : "linear-gradient(135deg,#8b5cf6,#ec4899)", boxShadow: loading ? "none" : "0 12px 35px rgba(139,92,246,0.35)", transition: "all 0.2s" }}>
              {loading ? "✨ Generating Titles..." : "💡 Generate Titles"}
            </button>

            {error && (
              <div style={{ padding: "14px 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, color: "#f87171", fontSize: 14 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Favorites Panel */}
            {favoriteTitles.length > 0 && (
              <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 20, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <label style={{ ...labelStyle, marginBottom: 0, color: "#fbbf24" }}>⭐ Favorites ({favoriteTitles.length})</label>
                  <button onClick={() => { navigator.clipboard.writeText(favoriteTitles.join("\n")); }} style={{ fontSize: 11, color: "#fbbf24", background: "none", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontWeight: 700 }}>
                    📋 Copy All
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {favoriteTitles.map((t, i) => (
                    <div key={i} style={{ padding: "10px 12px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 12, fontSize: 13, color: "#fde68a", lineHeight: 1.5 }}>
                      ⭐ {t}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>🕐 Recent</label>
                  <button onClick={() => setShowHistory(!showHistory)} style={{ fontSize: 11, color: "#a78bfa", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>
                    {showHistory ? "Less" : "More"}
                  </button>
                </div>
                {(showHistory ? history : history.slice(0, 3)).map((h) => (
                  <button key={h.id} onClick={() => { setTitles(h.titles); setTopic(h.topic); setPlatform(h.platform); }} style={{ width: "100%", padding: "9px 12px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, background: "rgba(255,255,255,0.02)", color: "white", cursor: "pointer", textAlign: "left", marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{h.topic}</div>
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{h.platform} • {h.count} titles • {h.date}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== RIGHT ===== */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Style Grid */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20 }}>
              <label style={labelStyle}>🎭 Title Style</label>
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

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>
                  💡 Generated Titles {titles.length > 0 && `(${titles.length})`}
                </label>
                {titles.length > 0 && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={copyAll} style={{ height: 34, padding: "0 12px", border: "none", cursor: "pointer", borderRadius: 9, fontWeight: 700, fontSize: 11, color: "white", background: allCopied ? "rgba(16,185,129,0.3)" : "rgba(139,92,246,0.3)", border: "1px solid rgba(139,92,246,0.2)" }}>
                      {allCopied ? "✅ Copied!" : "📋 Copy All"}
                    </button>
                    <button onClick={downloadTitles} style={{ height: 34, padding: "0 12px", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", borderRadius: 9, fontWeight: 700, fontSize: 11, color: "white", background: "rgba(255,255,255,0.06)" }}>
                      ⬇️ Download
                    </button>
                  </div>
                )}
              </div>

              {/* Search */}
              {titles.length > 0 && (
                <input
                  placeholder="🔍 Filter titles..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{ width: "100%", height: 40, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "0 14px", color: "white", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 14 }}
                />
              )}

              {/* Loading */}
              {loading && (
                <div style={{ textAlign: "center", padding: "50px 20px" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>💡</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 8 }}>Generating {count} {style} titles...</h3>
                  <p style={{ color: "#64748b", fontSize: 14 }}>In {language} • For {platform}</p>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden", marginTop: 20, maxWidth: 250, margin: "20px auto 0" }}>
                    <div style={{ height: "100%", width: "70%", background: "linear-gradient(90deg,#8b5cf6,#ec4899)", borderRadius: 999 }} />
                  </div>
                </div>
              )}

              {/* Empty */}
              {!loading && titles.length === 0 && (
                <div style={{ textAlign: "center", padding: "50px 20px", color: "#334155" }}>
                  <div style={{ fontSize: 48, marginBottom: 14 }}>💡</div>
                  <h3 style={{ fontSize: 16, color: "#475569", marginBottom: 6 }}>Your viral titles will appear here</h3>
                  <p style={{ fontSize: 13 }}>Enter topic, choose style and click Generate</p>
                </div>
              )}

              {/* Titles List */}
              {!loading && titles.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 550, overflowY: "auto" }}>
                  {filteredTitles.map((title, index) => (
                    <div
                      key={index}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, transition: "all 0.2s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(139,92,246,0.08)"; e.currentTarget.style.border = "1px solid rgba(139,92,246,0.2)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)"; }}
                    >
                      {/* Number */}
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#8b5cf6,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "white", flexShrink: 0 }}>
                        {index + 1}
                      </div>

                      {/* Title */}
                      <div style={{ flex: 1, fontSize: 14, color: "#e2e8f0", lineHeight: 1.5 }}>
                        {title}
                      </div>

                      {/* Favorite */}
                      <button onClick={() => toggleFavorite(title)} style={{ width: 32, height: 32, border: "none", cursor: "pointer", borderRadius: 8, fontSize: 14, background: favorites.includes(title) ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
                        {favorites.includes(title) ? "⭐" : "☆"}
                      </button>

                      {/* Copy */}
                      <button onClick={() => copyTitle(title, index)} style={{ height: 32, padding: "0 12px", border: "none", cursor: "pointer", borderRadius: 8, fontWeight: 700, fontSize: 11, color: "white", background: copiedIndex === index ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}>
                        {copiedIndex === index ? "✅" : "📋"}
                      </button>
                    </div>
                  ))}

                  {/* Regenerate */}
                  <button onClick={generateTitles} style={{ width: "100%", height: 48, border: "1px solid rgba(139,92,246,0.3)", cursor: "pointer", borderRadius: 12, fontWeight: 700, fontSize: 14, color: "white", background: "rgba(139,92,246,0.1)", marginTop: 6 }}>
                    🔄 Regenerate Titles
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TitleGenerator;