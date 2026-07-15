import { useState } from "react";
import "./PreviewCard.css";
import {
  Play,
  Music4,
  Clock3,
  User,
  Eye,
  Calendar,
  HardDrive,
  Download,
  X,
  Check,
  FolderOpen,
} from "lucide-react";

export default function PreviewCard({ videoInfo, onClose, onDownload }) {
  if (!videoInfo) return null;

  const [selectedQuality, setSelectedQuality] = useState(
    videoInfo.qualities?.[0],
  );

  const [downloadType, setDownloadType] = useState("video");

  return (
    <section className="ufm-dp-card">
      {/* Header */}

      <div className="ufm-dp-header">
        <div>
          <h2>Media Preview</h2>
          <p>Review your download settings before starting.</p>
        </div>

        <button className="ufm-dp-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Body */}

      <div className="ufm-dp-body">
        {/* Thumbnail */}

        <div
          className={`ufm-dp-image ${
            videoInfo.type === "short"
              ? "ufm-dp-image-short"
              : "ufm-dp-image-video"
          }`}
        >
          <img src={videoInfo.thumbnail} alt={videoInfo.title} />

          {videoInfo.type === "short" && (
            <span className="ufm-type-badge">Shorts</span>
          )}

          {videoInfo.type === "live" && (
            <span className="ufm-type-badge live">LIVE</span>
          )}
        </div>

        {/* Content */}

        <div className="ufm-dp-content">
          <h3>{videoInfo.title}</h3>

          {/* Meta */}

          <div className="ufm-dp-meta">
            <span>
              <User size={16} />
              {videoInfo.uploader?.name}
            </span>

            <span>
              <Clock3 size={16} />
              {videoInfo.durationString}
            </span>

            <span>
              <Eye size={16} />
              {videoInfo.statistics?.views?.toLocaleString()}
            </span>

            {videoInfo.uploadDate && (
              <span>
                <Calendar size={16} />
                {videoInfo.uploadDate}
              </span>
            )}
          </div>

          {/* Download Info */}

          <div className="ufm-dp-info-grid">
            <div className="ufm-dp-info">
              <span>Estimated Size</span>
              <strong>{videoInfo.fileSize || "145 MB"}</strong>
            </div>

            <div className="ufm-dp-info">
              <span>Output</span>
              <strong>{downloadType === "video" ? "MP4" : "MP3"}</strong>
            </div>

            <div className="ufm-dp-info">
              <span>Platform</span>
              <strong>{videoInfo.platform || "YouTube"}</strong>
            </div>
          </div>

          {/* Quality */}

          <div className="ufm-dp-group">
            <label>Video Quality</label>

            <div className="ufm-dp-options">
              {videoInfo.qualities?.map((quality) => (
                <button
                  key={quality}
                  onClick={() => setSelectedQuality(quality)}
                  className={`ufm-dp-option ${
                    selectedQuality === quality ? "ufm-dp-option-active" : ""
                  }`}
                >
                  {selectedQuality === quality && <Check size={15} />}

                  {quality}
                </button>
              ))}
            </div>
          </div>

          {/* Download Type */}

          <div className="ufm-dp-group">
            <label>Download Type</label>

            <div className="ufm-dp-download-types">
              <button
                onClick={() => setDownloadType("video")}
                className={`ufm-dp-type ${
                  downloadType === "video" ? "active" : ""
                }`}
              >
                <Play size={22} />

                <div>
                  <h4>Video</h4>
                  <p>MP4 • High Quality</p>
                </div>
              </button>

              <button
                onClick={() => setDownloadType("audio")}
                className={`ufm-dp-type ${
                  downloadType === "audio" ? "active" : ""
                }`}
              >
                <Music4 size={22} />

                <div>
                  <h4>Audio</h4>
                  <p>MP3 • 320kbps</p>
                </div>
              </button>
            </div>
          </div>

          {/* Folder */}

          <div className="ufm-dp-folder">
            <div>
              <FolderOpen size={18} />
              <span>Downloads Folder</span>
            </div>

            <button>
              <HardDrive size={16} />
              Change
            </button>
          </div>

          {/* Footer */}

          <div className="ufm-dp-footer">
            <button className="ufm-dp-cancel" onClick={onClose}>
              Cancel
            </button>

            <button
              className="ufm-dp-download"
              onClick={() =>
                onDownload({
                  quality: selectedQuality,
                  type: downloadType,
                })
              }
            >
              <Download size={18} />

              <div>
                <span>Download Now</span>
                <small>
                  {selectedQuality} • {downloadType === "video" ? "MP4" : "MP3"}
                </small>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
