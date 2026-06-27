import { useState } from "react";

function ScriptWriter({ onBack }) {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [style, setStyle] = useState("Cinematic");
  const [duration, setDuration] = useState("60 seconds");
  const [wordCount, setWordCount] = useState("150");
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const languages = [
    "English",
    "Urdu",
    "Hindi",
    "Arabic",
    "Spanish",
    "French",
    "German",
    "Turkish",
    "Bengali",
    "Punjabi",
  ];

  const styles = [
    { id: "Cinematic", emoji: "🎬", desc: "Movie quality narration" },
    { id: "Horror", emoji: "👻", desc: "Dark, scary, suspenseful" },
    { id: "Thriller", emoji: "😱", desc: "Edge of seat tension" },
    { id: "Comedy", emoji: "😂", desc: "Funny and entertaining" },
    { id: "Romantic", emoji: "❤️", desc: "Emotional love story" },
    { id: "Action", emoji: "💥", desc: "High energy, explosive" },
    { id: "Documentary", emoji: "📽️", desc: "Real, factual style" },
    { id: "Motivational", emoji: "🔥", desc: "Inspiring and powerful" },
    { id: "Mystery", emoji: "🔍", desc: "Suspense and intrigue" },
    { id: "Fantasy", emoji: "🧙", desc: "Magical world building" },
    { id: "Drama", emoji: "🎭", desc: "Emotional storytelling" },
    { id: "Sci-Fi", emoji: "🚀", desc: "Futuristic and tech" },
  ];

  const durations = [
    "30 seconds",
    "60 seconds",
    "2 minutes",
    "3 minutes",
    "5 minutes",
    "10 minutes",
  ];

  const wordCounts = ["100", "150", "200", "300", "500", "800", "1000"];

  const generateScript = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic or idea");
      return;
    }

    setError("");
    setScript("");
    setLoading(true);

    const selectedStyle = styles.find((s) => s.id === style);

    const systemPrompt = `You are a world-class professional scriptwriter. You write scripts in whatever language the user requests. Your scripts are highly engaging, emotionally powerful, and perfectly structured for video content. You specialize in ${style} style content. Always write the COMPLETE script in ${language} language only. Never mix languages unless specifically asked.`;

    const userPrompt = `Write a professional ${style} ${selectedStyle.emoji} video script in ${language} language.

Topic/Idea: ${topic}

Requirements:
- Language: ${language} ONLY
- Style: ${style} (${selectedStyle.desc})
- Duration: ${duration}
- Word Count: approximately ${wordCount} words
- Include: Scene descriptions, dialogues, narration, emotions
- Make it: Thrilling, engaging, with proper story arc
- Structure: Opening Hook → Rising Action → Climax → Resolution

Format the script professionally with:
[SCENE] descriptions
NARRATOR: narration text
CHARACTER: dialogue
[EMOTION/DIRECTION] acting notes

Make it top-level professional quality that can be used immediately for production.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY || "",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4000,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: userPrompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "API error");
      }

      const data = await response.json();
      const scriptText = data.content?.[0]?.text || "";

      if (!scriptText) {
        throw new Error("No script generated");
      }

      setScript(scriptText);
    } catch (err) {
      console.error("Script error:", err);
      setError("Failed to generate script: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyScript = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadScript = () => {
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `viora-script-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 13,
    padding: "0 16px",
    color: "white",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    height: 52,
  };

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#94a3b8",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  };

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
      {/* Glows */}
      <div style={{
        position: "absolute", top: "-10%", left: "30%",
        width: 600, height: 500,
        background: "radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "0", right: "10%",
        width: 400, height: 400,
        background: "radial-gradient(circle,rgba(236,72,153,0.08) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />

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

      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(139,92,246,0.12)",
            border: "1px solid rgba(139,92,246,0.25)",
            color: "#a78bfa",
            padding: "8px 22px",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 18,
          }}>
            📝 AI Script Writer — Powered by Claude AI
          </div>

          <h1 style={{
            fontSize: 42,
            fontWeight: 900,
            marginBottom: 12,
            background: "linear-gradient(135deg,#ffffff,#a78bfa 50%,#ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Professional Script Writer
          </h1>

          <p style={{ color: "#64748b", fontSize: 17 }}>
            Any language • Any style • Any length — Top level quality
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "420px 1fr",
          gap: 24,
          alignItems: "start",
        }}>

          {/* LEFT — Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Topic */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: 22,
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: 2,
                background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
                borderRadius: "20px 20px 0 0",
              }} />

              <label style={labelStyle}>📌 Topic / Idea</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. A man discovers he can see ghosts and must save his city from an ancient evil spirit..."
                style={{
                  ...inputStyle,
                  height: 120,
                  padding: "14px 16px",
                  resize: "none",
                  lineHeight: 1.6,
                }}
              />
              <div style={{
                fontSize: 12,
                color: "#334155",
                marginTop: 6,
                textAlign: "right",
              }}>
                {topic.length} characters
              </div>
            </div>

            {/* Language */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: 22,
            }}>
              <label style={labelStyle}>🌍 Language</label>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 8,
              }}>
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    style={{
                      height: 42,
                      border: language === lang
                        ? "1px solid rgba(139,92,246,0.6)"
                        : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 11,
                      background: language === lang
                        ? "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(236,72,153,0.25))"
                        : "rgba(255,255,255,0.03)",
                      color: language === lang ? "white" : "#94a3b8",
                      cursor: "pointer",
                      fontWeight: language === lang ? 700 : 500,
                      fontSize: 13,
                      transition: "all 0.2s",
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration & Word Count */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: 22,
            }}>
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>⏱️ Video Duration</label>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 8,
                }}>
                  {durations.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      style={{
                        height: 40,
                        border: duration === d
                          ? "1px solid rgba(139,92,246,0.6)"
                          : "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 10,
                        background: duration === d
                          ? "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(236,72,153,0.25))"
                          : "rgba(255,255,255,0.03)",
                        color: duration === d ? "white" : "#64748b",
                        cursor: "pointer",
                        fontWeight: duration === d ? 700 : 500,
                        fontSize: 12,
                        transition: "all 0.2s",
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>📝 Word Count</label>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: 8,
                }}>
                  {wordCounts.map((w) => (
                    <button
                      key={w}
                      onClick={() => setWordCount(w)}
                      style={{
                        height: 40,
                        border: wordCount === w
                          ? "1px solid rgba(139,92,246,0.6)"
                          : "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 10,
                        background: wordCount === w
                          ? "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(236,72,153,0.25))"
                          : "rgba(255,255,255,0.03)",
                        color: wordCount === w ? "white" : "#64748b",
                        cursor: "pointer",
                        fontWeight: wordCount === w ? 700 : 500,
                        fontSize: 12,
                        transition: "all 0.2s",
                      }}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateScript}
              disabled={loading}
              style={{
                width: "100%",
                height: 60,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                borderRadius: 16,
                fontWeight: 800,
                fontSize: 17,
                color: "white",
                background: loading
                  ? "rgba(139,92,246,0.4)"
                  : "linear-gradient(135deg,#8b5cf6,#ec4899)",
                boxShadow: loading
                  ? "none"
                  : "0 12px 35px rgba(139,92,246,0.35)",
                transition: "all 0.2s",
              }}
            >
              {loading ? "✍️ Writing Script..." : "📝 Generate Script"}
            </button>

            {/* Error */}
            {error && (
              <div style={{
                padding: "14px 16px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 14,
                color: "#f87171",
                fontSize: 14,
              }}>
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* RIGHT — Style + Output */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Style Selector */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: 22,
            }}>
              <label style={labelStyle}>🎭 Script Style</label>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 10,
              }}>
                {styles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    style={{
                      padding: "12px 8px",
                      border: style === s.id
                        ? "1px solid rgba(139,92,246,0.6)"
                        : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 14,
                      background: style === s.id
                        ? "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(236,72,153,0.2))"
                        : "rgba(255,255,255,0.03)",
                      color: style === s.id ? "white" : "#64748b",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 6 }}>
                      {s.emoji}
                    </div>
                    <div style={{
                      fontSize: 12,
                      fontWeight: style === s.id ? 700 : 500,
                    }}>
                      {s.id}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Script Output */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: 22,
              position: "relative",
              overflow: "hidden",
              flex: 1,
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: 2,
                background: "linear-gradient(90deg,#ec4899,#8b5cf6)",
                borderRadius: "20px 20px 0 0",
              }} />

              {/* Output Header */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}>
                <label style={labelStyle}>
                  📄 Generated Script
                </label>

                {script && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={copyScript}
                      style={{
                        height: 36,
                        padding: "0 14px",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 12,
                        color: "white",
                        background: copied
                          ? "rgba(16,185,129,0.3)"
                          : "rgba(139,92,246,0.3)",
                        border: "1px solid rgba(139,92,246,0.2)",
                      }}
                    >
                      {copied ? "✅ Copied!" : "📋 Copy"}
                    </button>

                    <button
                      onClick={downloadScript}
                      style={{
                        height: 36,
                        padding: "0 14px",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 12,
                        color: "white",
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      ⬇️ Download
                    </button>
                  </div>
                )}
              </div>

              {/* Loading State */}
              {loading && (
                <div style={{
                  textAlign: "center",
                  padding: "60px 20px",
                }}>
                  <div style={{
                    fontSize: 56,
                    marginBottom: 20,
                    animation: "none",
                  }}>
                    ✍️
                  </div>
                  <h3 style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "white",
                    marginBottom: 10,
                  }}>
                    Writing your {style} script...
                  </h3>
                  <p style={{ color: "#64748b", fontSize: 14 }}>
                    In {language} • {wordCount} words • {duration}
                  </p>

                  {/* Loading bar */}
                  <div style={{
                    height: 4,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 999,
                    overflow: "hidden",
                    marginTop: 24,
                    maxWidth: 300,
                    margin: "24px auto 0",
                  }}>
                    <div style={{
                      height: "100%",
                      width: "60%",
                      background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
                      borderRadius: 999,
                    }} />
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && !script && (
                <div style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#334155",
                }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>📄</div>
                  <h3 style={{ fontSize: 18, color: "#475569", marginBottom: 8 }}>
                    Your script will appear here
                  </h3>
                  <p style={{ fontSize: 14 }}>
                    Fill in the details and click Generate Script
                  </p>
                </div>
              )}

              {/* Script Content */}
              {!loading && script && (
                <div>
                  {/* Word count */}
                  <div style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 16,
                    flexWrap: "wrap",
                  }}>
                    {[
                      { label: "Words", value: script.split(" ").length },
                      { label: "Style", value: style },
                      { label: "Language", value: language },
                      { label: "Duration", value: duration },
                    ].map((item) => (
                      <div key={item.label} style={{
                        padding: "6px 12px",
                        background: "rgba(139,92,246,0.1)",
                        border: "1px solid rgba(139,92,246,0.15)",
                        borderRadius: 8,
                        fontSize: 12,
                        color: "#a78bfa",
                        fontWeight: 600,
                      }}>
                        {item.label}: <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>

                  {/* Script text */}
                  <div style={{
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14,
                    padding: "20px 22px",
                    maxHeight: 500,
                    overflowY: "auto",
                    fontSize: 14,
                    lineHeight: 1.9,
                    color: "#e2e8f0",
                    whiteSpace: "pre-wrap",
                    fontFamily: "monospace",
                  }}>
                    {script}
                  </div>

                  {/* Action buttons */}
                  <div style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 16,
                  }}>
                    <button
                      onClick={generateScript}
                      style={{
                        flex: 1,
                        height: 48,
                        border: "none",
                        cursor: "pointer",
                        borderRadius: 12,
                        fontWeight: 700,
                        fontSize: 14,
                        color: "white",
                        background: "rgba(139,92,246,0.2)",
                        border: "1px solid rgba(139,92,246,0.3)",
                      }}
                    >
                      🔄 Regenerate
                    </button>

                    <button
                      onClick={copyScript}
                      style={{
                        flex: 1,
                        height: 48,
                        border: "none",
                        cursor: "pointer",
                        borderRadius: 12,
                        fontWeight: 700,
                        fontSize: 14,
                        color: "white",
                        background: copied
                          ? "linear-gradient(135deg,#10b981,#059669)"
                          : "linear-gradient(135deg,#8b5cf6,#ec4899)",
                        boxShadow: "0 6px 20px rgba(139,92,246,0.25)",
                      }}
                    >
                      {copied ? "✅ Copied!" : "📋 Copy Script"}
                    </button>

                    <button
                      onClick={downloadScript}
                      style={{
                        flex: 1,
                        height: 48,
                        border: "1px solid rgba(255,255,255,0.1)",
                        cursor: "pointer",
                        borderRadius: 12,
                        fontWeight: 700,
                        fontSize: 14,
                        color: "white",
                        background: "rgba(255,255,255,0.06)",
                      }}
                    >
                      ⬇️ Download .txt
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScriptWriter;