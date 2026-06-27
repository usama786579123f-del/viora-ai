require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  credits: { type: Number, default: 3 },
  plan: { type: String, default: "FREE" },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", UserSchema);

const app = express();

app.use(cors({
  origin: ["https://viora-ai-weld.vercel.app", "http://localhost:5173"],
  credentials: true
}));

app.use(express.json({ limit: "20mb" }));

const JWT_SECRET = process.env.JWT_SECRET || "viora_secret_key";

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { email: user.email, credits: user.credits, plan: user.plan } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Wrong password" });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { email: user.email, credits: user.credits, plan: user.plan } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

const FAL_KEY = process.env.FAL_KEY;
function getEndpoint(resolution) {
  const pro = ["1080p", "2K", "4K"].includes(resolution);
  return pro
    ? "fal-ai/kling-video/v1.6/pro/image-to-video"
    : "fal-ai/kling-video/v1.6/standard/image-to-video";
}

app.post("/generate-video", async (req, res) => {
  try {
    const { image, prompt, negativePrompt, duration, resolution } = req.body;
    const uploadRes = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${image}`,
      { folder: "viora-inputs" }
    );
    const imageUrl = uploadRes.secure_url;
    const endpoint = getEndpoint(resolution);
    const safeDuration = duration && duration.toString().startsWith("10") ? "10" : "5";
    const submitRes = await axios.post(
      `https://queue.fal.run/${endpoint}`,
      {
        prompt,
        image_url: imageUrl,
        duration: safeDuration,
        negative_prompt: negativePrompt || "blur, distort, low quality",
      },
      { headers: { Authorization: `Key ${FAL_KEY}` } }
    );
    const { status_url, response_url } = submitRes.data;
    let completed = false;
    let attempts = 0;
    while (!completed && attempts < 90) {
      await new Promise((r) => setTimeout(r, 5000));
      const statusRes = await axios.get(status_url, {
        headers: { Authorization: `Key ${FAL_KEY}` },
      });
      if (statusRes.data.status === "COMPLETED") completed = true;
      else if (statusRes.data.status === "ERROR") throw new Error("Video generation failed");
      attempts++;
    }
    if (!completed) throw new Error("Timeout");
    const resultRes = await axios.get(response_url, {
      headers: { Authorization: `Key ${FAL_KEY}` },
    });
    const falVideoUrl = resultRes.data.video.url;
    const videoUploadRes = await cloudinary.uploader.upload(falVideoUrl, {
      resource_type: "video",
      folder: "viora-videos",
    });
    res.json({ videoUrl: videoUploadRes.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));