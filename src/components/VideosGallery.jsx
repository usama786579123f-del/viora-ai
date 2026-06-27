import React from "react";

const VideosGallery = ({ videos }) => {
  return (
    <div className="videos-gallery">
      <h2>Generated Videos</h2>

      {videos.length === 0 ? (
        <div className="empty-gallery">
          <div className="empty-icon">🎬</div>
          <h3>No Videos Generated Yet</h3>
          <p>
            Upload an image, enter a prompt, and generate your
            first AI video.
          </p>
        </div>
      ) : (
        <div className="videos-grid">
          {videos.map((video) => (
            <div
              key={video.id}
              className="video-card"
            >
              <img
                src={video.image}
                alt="Generated"
                className="video-thumbnail"
              />

              <div className="video-content">
                <h3>{video.prompt}</h3>

                <div className="video-meta">
                  <span>{video.resolution}</span>
                  <span>{video.duration}</span>
                </div>

                <div className="video-date">
                  {video.createdAt}
                </div>

                {video.watermark && (
                  <div className="watermark-badge">
                    Watermark Enabled
                  </div>
                )}

                <button className="download-btn">
                  Download Video
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideosGallery;