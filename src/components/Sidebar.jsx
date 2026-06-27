import { useState } from "react";

const LockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="10"
    height="10"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

function Sidebar({ setCurrentPage, openPricing, currentPage }) {
  const [collapsed, setCollapsed] = useState(false);

  const mainMenu = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "gallery", icon: "🎬", label: "Gallery" },
  ];

  const aiTools = [
    {
      id: "text-to-image",
      icon: "🎨",
      label: "Text to Image",
      soon: true,
    },
    {
      id: "prompt-enhancer",
      icon: "✨",
      label: "AI Prompt Enhancer",
      soon: true,
    },
    {
      id: "video-history",
      icon: "📂",
      label: "Video History",
      soon: true,
    },
    {
      id: "script-writer",
      icon: "📝",
      label: "AI Script Writer",
      soon: true,
    },
    {
      id: "thumbnail-gen",
      icon: "🖼️",
      label: "Thumbnail Generator",
      soon: true,
    },
    {
      id: "title-gen",
      icon: "💡",
      label: "AI Title Generator",
      soon: true,
    },
    {
      id: "hashtag-gen",
      icon: "#️⃣",
      label: "Hashtag Generator",
      soon: true,
    },
  ];

  const voiceTools = [
    {
      id: "ai-voiceover",
      icon: "🎙️",
      label: "AI Voiceover",
      sub: "EN • UR • 50+ langs",
      soon: true,
    },
  ];

  const videoTools = [
    {
      id: "character-video",
      icon: "🧑‍🎤",
      label: "AI Character Video",
      soon: true,
    },
    {
      id: "lip-sync",
      icon: "👄",
      label: "Lip Sync",
      soon: true,
    },
    {
      id: "bg-music",
      icon: "🎵",
      label: "Background Music",
      soon: true,
    },
  ];

  const MenuItem = ({ item }) => (
    <button
      className={`menu-item ${currentPage === item.id ? "active" : ""} ${item.soon ? "menu-item-locked" : ""}`}
      onClick={() => !item.soon && setCurrentPage(item.id)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        height: "auto",
        minHeight: 48,
        padding: "10px 14px",
        cursor: item.soon ? "default" : "pointer",
        opacity: item.soon ? 0.75 : 1,
        background:
          currentPage === item.id
            ? "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(236,72,153,0.25))"
            : "rgba(255,255,255,0.03)",
        border:
          currentPage === item.id
            ? "1px solid rgba(139,92,246,0.4)"
            : "1px solid rgba(255,255,255,0.05)",
        borderRadius: 12,
        color: "white",
        marginBottom: 6,
        transition: "all 0.2s",
      }}
    >
      {/* Left side */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>{item.icon}</span>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            {item.label}
          </div>
          {item.sub && (
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 1 }}>
              {item.sub}
            </div>
          )}
        </div>
      </div>

      {/* Right side — soon badge */}
      {item.soon && (
        <span className="soon-badge">
          <LockIcon />
          SOON
        </span>
      )}
    </button>
  );

  const SectionLabel = ({ label }) => (
    <div
      style={{
        fontSize: 10,
        fontWeight: 800,
        color: "#334155",
        letterSpacing: 1.5,
        textTransform: "uppercase",
        padding: "14px 4px 8px",
      }}
    >
      {label}
    </div>
  );

  return (
    <div
      className="sidebar"
      style={{
        width: 270,
        minHeight: "100vh",
        padding: "22px 16px",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 28,
          padding: "0 4px",
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 900,
            color: "white",
            flexShrink: 0,
            boxShadow: "0 8px 20px rgba(139,92,246,0.3)",
          }}
        >
          V
        </div>
        <div>
          <div
            style={{ fontSize: 18, fontWeight: 800, color: "white" }}
          >
            Viora AI
          </div>
          <div style={{ fontSize: 11, color: "#475569" }}>
            Video Generation
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <SectionLabel label="Navigation" />
      {mainMenu.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}

      {/* AI Tools */}
      <SectionLabel label="AI Tools" />
      {aiTools.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}

      {/* Voice Features */}
      <SectionLabel label="Voice Features" />
      {voiceTools.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}

      {/* Video Tools */}
      <SectionLabel label="Video Tools" />
      {videoTools.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}

      {/* Settings */}
      <SectionLabel label="Account" />
      <MenuItem
        item={{
          id: "settings",
          icon: "⚙️",
          label: "Settings",
          soon: false,
        }}
      />

      {/* Upgrade Box */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 20,
        }}
      >
        <div
          style={{
            padding: "18px 16px",
            borderRadius: 18,
            background:
              "linear-gradient(135deg,rgba(139,92,246,0.12),rgba(236,72,153,0.12))",
            border: "1px solid rgba(139,92,246,0.2)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: "white",
              marginBottom: 6,
            }}
          >
            ⚡ Upgrade Plan
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#64748b",
              lineHeight: 1.6,
              marginBottom: 14,
            }}
          >
            Unlock 4K, unlimited videos & all AI tools from just $5/mo
          </div>
          <button
            onClick={openPricing}
            style={{
              width: "100%",
              height: 42,
              border: "none",
              cursor: "pointer",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 13,
              color: "white",
              background:
                "linear-gradient(135deg,#8b5cf6,#ec4899)",
              boxShadow: "0 6px 18px rgba(139,92,246,0.3)",
            }}
          >
            Upgrade Now →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;