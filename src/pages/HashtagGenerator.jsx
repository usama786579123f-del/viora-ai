import { useState } from "react";

function HashtagGenerator({ onBack, user, setUser, openPricing }) {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [platform, setPlatform] = useState("Instagram");
  const [style, setStyle] = useState("Viral");
  const [count, setCount] = useState("30");
  const [loading, setLoading] = useState(false);
  const [hashtags, setHashtags] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid | list | grouped
  const [history, setHistory] = useState([]);
  const [activeHistoryIndex, setActiveHistoryIndex] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const languages = [
    "English", "Urdu", "Hindi", "Arabic",
    "Spanish", "French", "Turkish", "Bengali",
    "Punjabi", "German",
  ];

  const platforms = [
    { id: "Instagram", icon: "📸", limit: "30 max", color: "#e1306c" },
    { id: "TikTok",    icon: "🎵", limit: "100 max", color: "#69c9d0" },
    { id: "YouTube",   icon: "▶️", limit: "500 max", color: "#ff0000" },
    { id: "Twitter",   icon: "🐦", limit: "2-3 best", color: "#1da1f2" },
    { id: "Facebook",  icon: "📘", limit: "5-10 best", color: "#1877f2" },
    { id: "LinkedIn",  icon: "💼", limit: "3-5 best", color: "#0077b5" },
  ];

  const styles = [
    { id: "Viral",         emoji: "🔥", desc: "Maximum reach" },
    { id: "Niche",         emoji: "🎯", desc: "Targeted audience" },
    { id: "Trending",      emoji: "📈", desc: "Currently trending" },
    { id: "Local",         emoji: "📍", desc: "Location based" },
    { id: "Brand",         emoji: "💎", desc: "Brand building" },
    { id: "Community",     emoji: "👥", desc: "Community focused" },
    { id: "Entertainment", emoji: "🎬", desc: "Fun & engaging" },
    { id: "Educational",   emoji: "📚", desc: "Knowledge sharing" },
  ];

  const counts = ["10", "20", "30", "50"];

  const generateHashtags = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setError("");
    setHashtags([]);
    setGrouped({});
    setSelectedTags([]);
    setSearchFilter("");
    setLoading(true);

    const selectedStyle = styles.find((s) => s.id === style);
    const selectedPlatform = platforms.find((p) => p.id === platform);

    const systemPrompt = `You are a social media expert and hashtag strategist. You create high-performing hashtags that maximize reach, engagement, and discoverability on ${platform}. You understand trending hashtags, niche communities, and algorithm optimization.`;

    const userPrompt = `Generate exactly ${count} powerful hashtags for ${platform} in ${language} language.

Topic: ${topic}
Platform: ${platform} (${selectedPlatform.limit})
Style: ${style} (${selectedStyle.desc})
Language: ${language}

Requirements:
- Generate exactly ${count} hashtags
- Mix of: mega hashtags (1M+ posts), medium (100K-1M), niche (under 100K)
- Include trending and evergreen hashtags
- Platform optimized for ${platform}
- Some in ${language}, some universal English ones
- No spaces in hashtags
- Start each with #

IMPORTANT: Return hashtags in this EXACT grouped format:

MEGA:
#hashtag1
#hashtag2

MEDIUM:
#hashtag3
#hashtag4

NICHE:
#hashtag5
#hashtag6

TRENDING:
#hashtag7
#hashtag8

COMMUNITY:
#hashtag9
#hashtag10

Fill all groups with relevant hashtags totaling ${count} total. No explanations outside this format.`;

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
      if (!text) throw new Error("No hashtags generated");

      // Parse grouped
      const groupNames = ["MEGA", "MEDIUM", "NICHE", "TRENDING", "COMMUNITY"];
      const parsedGrouped = {};
      let allTags = [];

      groupNames.forEach((group) => {
        const regex = new RegExp(`${group}:\\s*([\\s\\S]*?)(?=${groupNames.join("|")}|$)`, "i");
        const match = text.match(regex);
        if (match) {
          const tags = match[1]
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.startsWith("#"))
            .map((t) => t.split(" ")[0]);
          if (tags.length > 0) {
            parsedGrouped[group] = tags;
            allTags = [...allTags, ...tags];
          }
        }
      });

      // Fallback: parse all hashtags if grouping fails
      if (allTags.length === 0) {
        allTags = text
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.startsWith("#"))
          .map((t) => t.split(" ")[0])
          .filter((t) => t.length > 1);
      }

      setHashtags(allTags);
      setGrouped(parsedGrouped);

      // Save to history
      const newEntry = {
        id: Date.now(),
        topic,
        platform,
        style,
        language,
        count: allTags.length,
        tags: allTags,
        grouped: parsedGrouped,
        date: new Date().toLocaleString(),
      };
      setHistory((prev) => [newEntry, ...prev.slice(0, 9)]);

    } catch (err) {
      console.error("Hashtag error:", err);
      setError("Failed to generate: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredTags = hashtags.filter((t) =>
    t.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const toggleSelectTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const copyAll = () => {
    const text = hashtags.join(" ");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const copySelected = () => {
    if (selectedTags.length === 0) return;
    navigator.clipboard.writeText(selectedTags.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const copyOne = (tag, index) => {
    navigator.clipboard.writeText(tag);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyGroup = (tags) => {
    navigator.clipboard.writeText(tags.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHashtags = () => {
    let text = `Viora AI — Hashtag Generator\n`;
    text += `Topic: ${topic} | Platform: ${platform} | Style: ${style}\n\n`;

    if (Object.keys(grouped).length > 0) {
      Object.entries(grouped).forEach(([group, tags]) => {
        text += `\n--- ${group} ---\n${tags.join("\n")}\n`;
      });
      text += `\n--- ALL HASHTAGS (copy-paste ready) ---\n${hashtags.join(" ")}`;
    } else {
      text += hashtags.join("\n");
    }

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `viora-hashtags-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const groupColors = {
    MEGA:      { bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.2)",   color: "#f87171",  label: "🔥 MEGA (1M+ posts)" },
    MEDIUM:    { bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)",  color: "#fbbf24",  label: "⚡ MEDIUM (100K-1M)" },
    NICHE:     { bg: "rgba(139,92,246,0.08)",  border: "rgba(139,92,246,0.2)",  color: "#a78bfa",  label: "🎯 NICHE (under 100K)" },
    TRENDING:  { bg: "rgba(236,72,153,0.08)",  border: "rgba(236,72,153,0.2)",  color: "#f472b6",  label: "📈 TRENDING" },
    COMMUNITY: { bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.2)",  color: "#34d399",  label: "👥 COMMUNITY" },
  };

  const labelStyle = {
    display: "block",
    fontSize: 11,
    fontWeight: 800,
    color: "#64748b",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050816",
      padding: "30px 20px",
      color: "white",
      fontFamily: "inherit",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Glows */}
      <div style={{ position: "absolute", top: "-10%", left: "30%", width: 600, height: 500, background: "radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, right: "10%", width: 400, height: 400, background: "radial-gradient(circle,rgba(236,72,153,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />

      {/* Back */}
      <button onClick={onBack} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "10px 20px", borderRadius: 12, cursor: "pointer", marginBottom: 30, fontSize: 14, fontWeight: 600, position: "relative", zIndex: 1 }}>
        ← Back
      </button>

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-block", background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#a78bfa", padding: "8px 22px", borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 18 }}>
            #️⃣ AI Hashtag Generator — Powered by DeepSeek AI
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 12, background: "linear-gradient(135deg,#ffffff,#a78bfa 50%,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Professional Hashtag Generator
          </h1>
          <p style={{ color: "#64748b", fontSize: 17 }}>
            Smart grouping • Multi-platform • Maximum reach & engagement
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24, alignItems: "start" }}>

          {/* ===== LEFT PANEL ===== */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Topic */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#8b5cf6,#ec4899)", borderRadius: "20px 20px 0 0" }} />
              <label style={labelStyle}>📌 Topic / Niche</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. fitness workout, horror movies, Pakistani food, travel vlog..."
                style={{ width: "100%", height: 90, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 14px", color: "white", fontSize: 14, outline: "none", resize: "none", lineHeight: 1.6, boxSizing: "border-box" }}
                onFocus={(e) => (e.target.style.border = "1px solid rgba(139,92,246,0.5)")}
                onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.1)")}
              />
              <div style={{ fontSize: 12, color: "#334155", marginTop: 6, textAlign: "right" }}>{topic.length} chars</div>
            </div>

            {/* Platform */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20 }}>
              <label style={labelStyle}>📱 Platform</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {platforms.map((p) => (
                  <button key={p.id} onClick={() => setPlatform(p.id)} style={{ padding: "10px 6px", border: platform === p.id ? `1px solid ${p.color}66` : "1px solid rgba(255,255,255,0.08)", borderRadius: 12, background: platform === p.id ? `${p.color}18` : "rgba(255,255,255,0.03)", color: platform === p.id ? "white" : "#64748b", cursor: "pointer", transition: "all 0.2s", textAlign: "center" }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{p.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: platform === p.id ? 700 : 500 }}>{p.id}</div>
                    <div style={{ fontSize: 9, color: "#475569", marginTop: 2 }}>{p.limit}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20 }}>
              <label style={labelStyle}>🌍 Language</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 7 }}>
                {languages.map((lang) => (
                  <button key={lang} onClick={() => setLanguage(lang)} style={{ height: 38, border: language === lang ? "1px solid rgba(139,92,246,0.6)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 10, background: language === lang ? "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(236,72,153,0.2))" : "rgba(255,255,255,0.03)", color: language === lang ? "white" : "#94a3b8", cursor: "pointer", fontWeight: language === lang ? 700 : 500, fontSize: 12, transition: "all 0.2s" }}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20 }}>
              <label style={labelStyle}>🔢 How Many Hashtags</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                {counts.map((c) => (
                  <button key={c} onClick={() => setCount(c)} style={{ height: 46, border: count === c ? "1px solid rgba(139,92,246,0.6)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 11, background: count === c ? "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(236,72,153,0.2))" : "rgba(255,255,255,0.03)", color: count === c ? "white" : "#64748b", cursor: "pointer", fontWeight: count === c ? 800 : 500, fontSize: 16, transition: "all 0.2s" }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate */}
            <button onClick={generateHashtags} disabled={loading} style={{ width: "100%", height: 58, border: "none", cursor: loading ? "not-allowed" : "pointer", borderRadius: 16, fontWeight: 800, fontSize: 17, color: "white", background: loading ? "rgba(139,92,246,0.4)" : "linear-gradient(135deg,#8b5cf6,#ec4899)", boxShadow: loading ? "none" : "0 12px 35px rgba(139,92,246,0.35)", transition: "all 0.2s" }}>
              {loading ? "✨ Generating..." : "#️⃣ Generate Hashtags"}
            </button>

            {error && (
              <div style={{ padding: "14px 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, color: "#f87171", fontSize: 14 }}>
                ⚠️ {error}
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>🕐 Recent Searches</label>
                  <button onClick={() => setShowHistory(!showHistory)} style={{ fontSize: 11, color: "#a78bfa", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>
                    {showHistory ? "Hide" : "Show All"}
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(showHistory ? history : history.slice(0, 3)).map((h, i) => (
                    <button key={h.id} onClick={() => { setHashtags(h.tags); setGrouped(h.grouped); setTopic(h.topic); setPlatform(h.platform); setActiveHistoryIndex(i); }} style={{ padding: "10px 12px", border: activeHistoryIndex === i ? "1px solid rgba(139,92,246,0.5)" : "1px solid rgba(255,255,255,0.06)", borderRadius: 12, background: activeHistoryIndex === i ? "rgba(139,92,246,0.1)" : "rgba(255,255,255,0.02)", color: "white", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{h.topic}</div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>{h.platform} • {h.count} tags • {h.date}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ===== RIGHT PANEL ===== */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Style */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20 }}>
              <label style={labelStyle}>🎯 Hashtag Style</label>
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
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#ec4899,#8b5cf6)", borderRadius: "20px 20px 0 0" }} />

              {/* Toolbar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>
                  #️⃣ Generated Hashtags {hashtags.length > 0 && `(${hashtags.length})`}
                </label>

                {hashtags.length > 0 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {/* View Mode */}
                    <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden" }}>
                      {["grid", "list", "grouped"].map((mode) => (
                        <button key={mode} onClick={() => setViewMode(mode)} style={{ height: 32, padding: "0 12px", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: viewMode === mode ? "white" : "#64748b", background: viewMode === mode ? "linear-gradient(135deg,#8b5cf6,#ec4899)" : "transparent", transition: "all 0.2s" }}>
                          {mode === "grid" ? "⬛" : mode === "list" ? "☰" : "📂"}
                        </button>
                      ))}
                    </div>

                    <button onClick={selectedTags.length > 0 ? copySelected : copyAll} style={{ height: 34, padding: "0 14px", border: "none", cursor: "pointer", borderRadius: 9, fontWeight: 700, fontSize: 11, color: "white", background: copied ? "rgba(16,185,129,0.3)" : "rgba(139,92,246,0.3)", border: "1px solid rgba(139,92,246,0.2)" }}>
                      {copied ? "✅ Copied!" : selectedTags.length > 0 ? `📋 Copy (${selectedTags.length})` : "📋 Copy All"}
                    </button>

                    <button onClick={downloadHashtags} style={{ height: 34, padding: "0 14px", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", borderRadius: 9, fontWeight: 700, fontSize: 11, color: "white", background: "rgba(255,255,255,0.06)" }}>
                      ⬇️ Download
                    </button>
                  </div>
                )}
              </div>

              {/* Search filter */}
              {hashtags.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <input
                    placeholder="🔍 Filter hashtags..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    style={{ width: "100%", height: 40, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "0 14px", color: "white", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              )}

              {/* Selected tags info */}
              {selectedTags.length > 0 && (
                <div style={{ marginBottom: 12, padding: "10px 14px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#a78bfa", fontWeight: 700 }}>✅ {selectedTags.length} tags selected</span>
                  <button onClick={() => setSelectedTags([])} style={{ fontSize: 11, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}>Clear</button>
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div style={{ textAlign: "center", padding: "50px 20px" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>#️⃣</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 8 }}>Generating {count} hashtags...</h3>
                  <p style={{ color: "#64748b", fontSize: 14 }}>For {platform} • {style} style • {language}</p>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden", marginTop: 20, maxWidth: 250, margin: "20px auto 0" }}>
                    <div style={{ height: "100%", width: "70%", background: "linear-gradient(90deg,#8b5cf6,#ec4899)", borderRadius: 999 }} />
                  </div>
                </div>
              )}

              {/* Empty */}
              {!loading && hashtags.length === 0 && (
                <div style={{ textAlign: "center", padding: "50px 20px", color: "#334155" }}>
                  <div style={{ fontSize: 48, marginBottom: 14 }}>#️⃣</div>
                  <h3 style={{ fontSize: 16, color: "#475569", marginBottom: 6 }}>Hashtags will appear here</h3>
                  <p style={{ fontSize: 13 }}>Enter topic and click Generate</p>
                </div>
              )}

              {/* ===== GROUPED VIEW ===== */}
              {!loading && hashtags.length > 0 && viewMode === "grouped" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: 600, overflowY: "auto" }}>
                  {Object.entries(grouped).length > 0 ? (
                    Object.entries(grouped).map(([group, tags]) => {
                      const gc = groupColors[group] || { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)", color: "#94a3b8", label: group };
                      return (
                        <div key={group} style={{ background: gc.bg, border: `1px solid ${gc.border}`, borderRadius: 16, padding: 16 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: gc.color }}>{gc.label}</span>
                            <button onClick={() => copyGroup(tags)} style={{ fontSize: 11, fontWeight: 700, color: gc.color, background: "none", border: `1px solid ${gc.border}`, borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>
                              📋 Copy Group
                            </button>
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {tags.map((tag, i) => (
                              <button key={i} onClick={() => toggleSelectTag(tag)} style={{ padding: "7px 13px", border: selectedTags.includes(tag) ? `1px solid ${gc.color}` : `1px solid ${gc.border}`, borderRadius: 999, background: selectedTags.includes(tag) ? `${gc.color}22` : gc.bg, color: selectedTags.includes(tag) ? gc.color : "#94a3b8", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s" }}>
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {filteredTags.map((tag, i) => (
                        <button key={i} onClick={() => toggleSelectTag(tag)} style={{ padding: "8px 14px", border: selectedTags.includes(tag) ? "1px solid rgba(139,92,246,0.7)" : "1px solid rgba(139,92,246,0.2)", borderRadius: 999, background: selectedTags.includes(tag) ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.06)", color: "#a78bfa", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s" }}>
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ===== GRID VIEW ===== */}
              {!loading && hashtags.length > 0 && viewMode === "grid" && (
                <div>
                  <div style={{ padding: "14px 16px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, marginBottom: 14, fontSize: 14, color: "#a78bfa", lineHeight: 2, fontWeight: 500 }}>
                    {filteredTags.join(" ")}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: 340, overflowY: "auto", marginBottom: 16 }}>
                    {filteredTags.map((tag, i) => (
                      <button key={i} onClick={() => toggleSelectTag(tag)} style={{ padding: "8px 14px", border: selectedTags.includes(tag) ? "1px solid rgba(139,92,246,0.7)" : "1px solid rgba(139,92,246,0.2)", borderRadius: 999, background: selectedTags.includes(tag) ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.06)", color: selectedTags.includes(tag) ? "white" : "#a78bfa", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s" }}>
                        {selectedTags.includes(tag) ? "✅ " : ""}{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== LIST VIEW ===== */}
              {!loading && hashtags.length > 0 && viewMode === "list" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 420, overflowY: "auto", marginBottom: 16 }}>
                  {filteredTags.map((tag, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: selectedTags.includes(tag) ? "rgba(139,92,246,0.1)" : "rgba(255,255,255,0.02)", border: selectedTags.includes(tag) ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(255,255,255,0.05)", borderRadius: 12, transition: "all 0.2s" }}>
                      <div style={{ width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg,#8b5cf6,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "white", flexShrink: 0 }}>{i + 1}</div>
                      <span style={{ flex: 1, fontSize: 14, color: "#e2e8f0", fontWeight: 500 }}>{tag}</span>
                      <button onClick={() => toggleSelectTag(tag)} style={{ height: 30, padding: "0 10px", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", borderRadius: 8, fontSize: 11, fontWeight: 700, color: "white", background: selectedTags.includes(tag) ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.05)" }}>
                        {selectedTags.includes(tag) ? "✅" : "Select"}
                      </button>
                      <button onClick={() => copyOne(tag, i)} style={{ height: 30, padding: "0 10px", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", borderRadius: 8, fontSize: 11, fontWeight: 700, color: "white", background: copiedIndex === i ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)" }}>
                        {copiedIndex === i ? "✅" : "📋"}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom actions */}
              {hashtags.length > 0 && !loading && (
                <>
                  {/* Stats */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                    {[
                      { label: "Total", value: hashtags.length },
                      { label: "Selected", value: selectedTags.length },
                      { label: "Platform", value: platform },
                      { label: "Style", value: style },
                    ].map((item) => (
                      <div key={item.label} style={{ padding: "6px 12px", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)", borderRadius: 8, fontSize: 12, color: "#a78bfa", fontWeight: 600 }}>
                        {item.label}: <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={generateHashtags} style={{ flex: 1, height: 46, border: "1px solid rgba(139,92,246,0.3)", cursor: "pointer", borderRadius: 12, fontWeight: 700, fontSize: 14, color: "white", background: "rgba(139,92,246,0.1)" }}>
                      🔄 Regenerate
                    </button>
                    <button onClick={selectedTags.length > 0 ? copySelected : copyAll} style={{ flex: 1, height: 46, border: "none", cursor: "pointer", borderRadius: 12, fontWeight: 700, fontSize: 14, color: "white", background: copied ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
                      {copied ? "✅ Copied!" : selectedTags.length > 0 ? `📋 Copy Selected (${selectedTags.length})` : "📋 Copy All"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HashtagGenerator;