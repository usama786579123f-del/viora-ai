import { useState, useRef } from "react";
import UpgradeModal from "./UpgradeModal";

const BACKEND_URL = "http://localhost:5000";

function UploadSection({ user, setUser, openPricing, addVideo }) {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [output, setOutput] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [resolution, setResolution] = useState("480p");
  const [duration, setDuration] = useState("5s");
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const fileInputRef = useRef(null);

  const creditCost = { "480p": 1, "720p": 2, "1080p": 4, "2K": 6, "4K": 10 };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImage(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setImageFile(file);
    setImage(URL.createObjectURL(file));
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const startGeneration = async () => {
    if (!image) { alert("Upload image first"); return; }
    if (!prompt.trim()) { alert("Enter a prompt"); return; }

    if (user.plan === "free" && resolution !== "480p") {
      setShowUpgrade(true); return;
    }
    if (user.plan === "pro" && resolution === "4K") {
      setShowUpgrade(true); return;
    }

    const cost = creditCost[resolution];
    if (user.plan !== "ultra" && user.credits < cost) {
      alert(`Not enough credits. Need ${cost}, have ${user.credits}.`); return;
    }

    if (user.plan !== "ultra") {
      setUser((prev) => ({ ...prev, credits: prev.credits - cost }));
    }

    setProgress(0);
    setOutput(null);
    setIsGenerating(true);
    setStatusMsg("Preparing image...");

    try {
      let videoUrl = null;

      try {
        setStatusMsg("Connecting to AI server...");
        setProgress(10);

        const base64Image = await toBase64(imageFile);

        setStatusMsg("Sending to Kling AI...");
        setProgress(25);

        const response = await fetch(`${BACKEND_URL}/generate-video`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64Image,
            prompt,
            negativePrompt,
            duration: parseInt(duration),
            resolution,
          }),
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        setStatusMsg("AI is generating your video...");
        setProgress(60);

        const data = await response.json();

        if (data.videoUrl) {
          videoUrl = data.videoUrl;
          setProgress(100);
          setStatusMsg("Video ready!");
        } else {
          throw new Error("No video URL in response");
        }
      } catch (apiError) {
        console.warn("Backend not available, using demo mode:", apiError.message);

        setStatusMsg("Demo mode: simulating generation...");
        for (let i = 25; i <= 95; i += 5) {
          await new Promise((r) => setTimeout(r, 200));
          setProgress(i);
          if (i === 50) setStatusMsg("Demo: processing frames...");
          if (i === 75) setStatusMsg("Demo: finalizing video...");
        }

        videoUrl = image;
        setProgress(100);
        setStatusMsg("Done! (Demo mode — connect backend for real video)");
      }

      const newVideo = {
        id: Date.now(),
        videoUrl,
        title: prompt,
        resolution,
        duration,
        watermark: false,
        created: new Date().toLocaleString(),
        status: "completed",
      };

      setOutput(newVideo);
      if (addVideo) addVideo(newVideo);

    } catch (err) {
      alert("Generation failed: " + err.message);
      if (user.plan !== "ultra") {
        setUser((prev) => ({ ...prev, credits: prev.credits + cost }));
      }
    } finally {
      setTimeout(() => setIsGenerating(false), 500);
    }
  };

  const downloadOutput = async () => {
    if (!output?.videoUrl) return;
    try {
      const res = await fetch(output.videoUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `viora-video-${output.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(output.videoUrl, "_blank");
    }
  };

  const templates = [
    { emoji: "🎬", label: "Cinematic", prompt: "Cinematic drone shot flying through futuristic neon city at night, volumetric lighting, ultra realistic, movie quality" },
    { emoji: "📸", label: "Realistic", prompt: "Ultra realistic human walking through city street, realistic lighting, natural movement, 4K quality" },
    { emoji: "🌈", label: "Anime", prompt: "Anime character running through magical forest, vibrant colors, Studio Ghibli style animation" },
    { emoji: "🔥", label: "Viral", prompt: "Viral social media style video, fast motion, engaging visuals, trending style content" },
    { emoji: "🚗", label: "Car Ad", prompt: "Luxury sports car driving through neon cyberpunk city at night, cinematic camera movement, reflections, ultra detailed" },
    { emoji: "🦅", label: "Nature", prompt: "Majestic eagle flying above snowy mountains during sunrise, cinematic aerial view, realistic clouds" },
  ];

  const resolutions = ["480p", "720p", "1080p", "2K", "4K"];
  const durations = ["5s", "10s", "20s"];

  return (
    <>
      <div className="upload-wrapper">
        <div className="upload-header">
          <h2>Create AI Video</h2>
          <p>Transform your image into cinematic AI animation.</p>
        </div>

        <div className="generator-grid">
          {/* LEFT: Upload */}
          <div className="upload-card">
            {!image ? (
              <div
                className="dropzone"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={openFilePicker}
                style={{ cursor: "pointer" }}
              >
                <input
                  ref={fileInputRef}
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                />
                <div className="drop-icon">🚀</div>
                <h3>Upload Image</h3>
                <p>PNG • JPG • WEBP</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openFilePicker();
                  }}
                >
                  Choose File
                </button>
              </div>
            ) : (
              <div style={{ position: "relative" }}>
                <img
                  src={image}
                  alt="preview"
                  style={{ width: "100%", borderRadius: 20, maxHeight: 500, objectFit: "cover" }}
                />
                <button
                  onClick={() => { setImage(null); setImageFile(null); setOutput(null); }}
                  style={{
                    position: "absolute", top: 12, right: 12,
                    background: "rgba(0,0,0,0.7)", border: "none",
                    color: "white", borderRadius: 10, padding: "6px 12px",
                    cursor: "pointer", fontWeight: 700,
                  }}
                >
                  ✕ Change
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Controls */}
          <div className="controls-card">
            <div className="prompt-templates">
              {templates.map((t) => (
                <button key={t.label} type="button" onClick={() => setPrompt(t.prompt)}>
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>

            <div className="field-group">
              <label>Describe Your Video</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A lion walking through a futuristic city at sunset, cinematic lighting..."
              />
            </div>

            <div className="field-group">
              <label>Negative Prompt</label>
              <textarea
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="blurry, low quality, distortion, bad anatomy..."
                style={{ height: 80 }}
              />
            </div>

            <div className="field-group">
              <label>Resolution</label>
              <div className="resolution-grid">
                {resolutions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`option-card ${resolution === r ? "active-option" : ""}`}
                    onClick={() => setResolution(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-group">
              <label>Duration</label>
              <div className="duration-grid">
                {durations.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`option-card ${duration === d ? "active-option" : ""}`}
                    onClick={() => setDuration(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20, lineHeight: 2, fontSize: 14, color: "#cbd5e1" }}>
              <span>Plan: <strong style={{ color: "white" }}>{user.plan.toUpperCase()}</strong></span>
              {"  •  "}
              <span>Cost: <strong style={{ color: "#a78bfa" }}>{creditCost[resolution]} credits</strong></span>
              {"  •  "}
              <span>Available: <strong style={{ color: "#10b981" }}>{user.plan === "ultra" ? "∞" : user.credits}</strong></span>
            </div>

            <button
              className="generate-video-btn"
              onClick={startGeneration}
              disabled={isGenerating}
              style={{ opacity: isGenerating ? 0.7 : 1 }}
            >
              {isGenerating ? `⏳ ${statusMsg}` : "🎬 Generate AI Video"}
            </button>

            {isGenerating && (
              <div style={{ marginTop: 20 }}>
                <div style={{
                  height: 8, borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
                    transition: "width 0.3s ease",
                  }} />
                </div>
                <p style={{ marginTop: 8, fontSize: 13, color: "#94a3b8" }}>
                  {statusMsg} — {progress}%
                </p>
              </div>
            )}
          </div>
        </div>

        {output && (
          <div className="premium-output-card">
            <div className="output-preview">
              {output.videoUrl?.endsWith(".mp4") ? (
                <video src={output.videoUrl} controls className="output-image" style={{ width: "100%", borderRadius: 18 }} />
              ) : (
                <img src={output.videoUrl} alt="" className="output-image" />
              )}
            </div>

            <div className="output-info">
              <h2>✅ Generated Result</h2>
              <p className="output-prompt">{output.title}</p>

              <div className="output-tags">
                <span>{output.resolution}</span>
                <span>{output.duration}</span>
                {output.watermark && <span>🔖 Watermark</span>}
              </div>

              <div className="output-actions">
                <button onClick={downloadOutput}>⬇ Download MP4</button>
                <button onClick={() => setOutput(null)} style={{ background: "rgba(255,255,255,0.08)" }}>
                  ✕ Clear
                </button>
              </div>

              <p style={{ marginTop: 15, fontSize: 12, color: "#94a3b8" }}>
                💡 Saved to Gallery automatically
              </p>
            </div>
          </div>
        )}
      </div>

      <UpgradeModal
        open={showUpgrade}
        title="Upgrade Required"
        message={`Your ${user.plan.toUpperCase()} plan does not support ${resolution} resolution. Upgrade to unlock higher quality.`}
        onClose={() => setShowUpgrade(false)}
        onUpgrade={() => { setShowUpgrade(false); openPricing(); }}
      />
    </>
  );
}

export default UploadSection;