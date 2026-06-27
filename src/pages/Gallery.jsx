// Small inline icon components (clean line-icon style)
const DownloadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3v12m0 0l-4-4m4 4l4-4" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </svg>
);

const TrashIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

function Gallery({ videos, deleteVideo, onBack }) {

  const downloadVideo = async (video) => {
    try {
      const res = await fetch(video.videoUrl);
      const blob = await res.blob();
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
    <div className="gallery-page">

      <div className="gallery-header">
        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            padding: "10px 20px",
            borderRadius: 12,
            cursor: "pointer",
            marginBottom: 20,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          ← Back to Dashboard
        </button>

        <h1>Video Gallery</h1>
        <p>All your generated AI videos in one place.</p>
      </div>

      {videos.length === 0 ? (
        <div className="empty-gallery">
          <div style={{ fontSize: 48, marginBottom: 15 }}>🎬</div>
          <h3>Gallery Empty</h3>
          <p>Generate videos to see them here.</p>
        </div>
      ) : (
        <div className="videos-grid">
          {videos.map((video) => (
            <div key={video.id} className="video-card">

              {video.videoUrl?.endsWith(".mp4") ? (
                <video
                  src={video.videoUrl}
                  controls
                  style={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",
                  }}
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
                  <span>{video.created}</span>
                </div>

                <div className="video-footer">
                  <button
                    className="download-btn"
                    onClick={() => downloadVideo(video)}
                  >
                    <DownloadIcon />
                    <span>Download</span>
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteVideo(video.id)}
                  >
                    <TrashIcon />
                    <span>Delete</span>
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

export default Gallery;