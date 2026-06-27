function RecentVideos({ videos, deleteVideo }) {
  const downloadVideo = async (video) => {
    try {
      const response = await fetch(video.videoUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `viora-${video.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(video.videoUrl, "_blank");
    }
  };

  return (
    <div className="recent-videos">
      <div className="section-header">
        <div>
          <h2>Generated Videos</h2>
          <p>Your AI generated creations</p>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="empty-gallery">
          <div style={{ fontSize: 48, marginBottom: 15 }}>🎬</div>
          <h3>No AI Videos Yet</h3>
          <p>Upload an image and generate your first cinematic AI video.</p>
        </div>
      ) : (
        <div className="videos-grid">
          {videos.map((video) => (
            <div key={video.id} className="video-card">
              {video.videoUrl?.endsWith(".mp4") ? (
                <video
                  src={video.videoUrl}
                  controls
                  style={{ width: "100%", height: 220, objectFit: "cover" }}
                />
              ) : (
                <img
                  src={video.videoUrl}
                  alt=""
                  className="gallery-image"
                />
              )}

              <div className="video-content">
                <h3>{video.title}</h3>

                <div className="video-tags">
                  <span>{video.resolution}</span>
                  <span>{video.duration}</span>
                  <span>
                    {video.watermark ? "🔖 Watermark" : "✨ No Watermark"}
                  </span>
                </div>

                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 15 }}>
                  {video.created}
                </div>

                <div className="video-footer">
                  <button
                    className="download-btn"
                    onClick={() => downloadVideo(video)}
                  >
                    ⬇ Download
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteVideo(video.id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentVideos;