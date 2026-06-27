require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

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

    console.log("📥 New request:", { prompt, resolution, duration });

    console.log("⬆️ Uploading image to Cloudinary...");
    const uploadRes = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${image}`,
      { folder: "viora-inputs" }
    );
    const imageUrl = uploadRes.secure_url;
    console.log("✅ Image uploaded:", imageUrl);

    const endpoint = getEndpoint(resolution);
    const safeDuration = duration && duration.toString().startsWith("10") ? "10" : "5";

    console.log("🚀 Submitting to fal.ai:", endpoint);
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
    console.log("📋 Task queued, request_id:", submitRes.data.request_id);

    let completed = false;
    let attempts = 0;

    while (!completed && attempts < 90) {
      await new Promise((r) => setTimeout(r, 5000));

      const statusRes = await axios.get(status_url, {
        headers: { Authorization: `Key ${FAL_KEY}` },
      });

      console.log(`⏳ Attempt ${attempts + 1}: ${statusRes.data.status}`);

      if (statusRes.data.status === "COMPLETED") {
        completed = true;
      } else if (statusRes.data.status === "ERROR") {
        throw new Error("Video generation failed on fal.ai");
      }

      attempts++;
    }

    if (!completed) {
      throw new Error("Timeout — video generate hone mein zyada time lag gaya");
    }

    const resultRes = await axios.get(response_url, {
      headers: { Authorization: `Key ${FAL_KEY}` },
    });

    const falVideoUrl = resultRes.data.video.url;
    console.log("🎬 Video ready from fal.ai:", falVideoUrl);

    console.log("⬆️ Saving video permanently to Cloudinary...");
    const videoUploadRes = await cloudinary.uploader.upload(falVideoUrl, {
      resource_type: "video",
      folder: "viora-videos",
    });

    console.log("✅ Done! Final URL:", videoUploadRes.secure_url);
    res.json({ videoUrl: videoUploadRes.secure_url });

  } catch (err) {
    console.error("❌ Generation error:", err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data?.detail || err.message,
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});