import "./PreviewCard.css";
import {
  Play,
  Music4,
  Clock3,
  User,
  Eye,
  Download,
  X,
  HardDrive,
} from "lucide-react";

export default function PreviewCard({ videoInfo, onClose, onDownload }) {
  if (!videoInfo) return null;

  return (
    <section className="ufm-dp-card">
      {/* Header */}

      <div className="ufm-dp-header">
        <div>
          <h2>Media Preview</h2>
          <p>Review download settings before starting.</p>
        </div>

        <button className="ufm-dp-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Body */}

      <div className="ufm-dp-body">
        {/* Thumbnail */}

        <div className="ufm-dp-image">
          <img src={videoInfo.thumbnail} alt={videoInfo.title} />
        </div>

        {/* Details */}

        <div className="ufm-dp-content">
          <h3>{videoInfo.title}</h3>

          <div className="ufm-dp-meta">
            <span>
              <Clock3 size={16} />
              {videoInfo.durationString}
            </span>

            <span>
              <User size={16} />
              {videoInfo.uploader.name}
            </span>

            <span>
              <Eye size={16} />
              {videoInfo.statistics.views.toLocaleString()}
            </span>
          </div>

          {/* Quality */}

          <div className="ufm-dp-group">
            <label>Video Quality</label>

            <div className="ufm-dp-options">
              {videoInfo.qualities.map((quality) => (
                <button
                  key={quality}
                  className="ufm-dp-option ufm-dp-option-active"
                >
                  {quality}
                </button>
              ))}
            </div>
          </div>

          {/* Download Type */}

          <div className="ufm-dp-group">
            <label>Download Type</label>

            <div className="ufm-dp-options">
              <button className="ufm-dp-option ufm-dp-option-active">
                <Play size={16} />
                Video
              </button>

              <button className="ufm-dp-option">
                <Music4 size={16} />
                Audio
              </button>
            </div>
          </div>

          {/* Footer */}

          <div className="ufm-dp-footer">
            <div className="ufm-dp-storage">
              <HardDrive size={18} />
              Downloads Folder
            </div>

            <div className="ufm-dp-actions">
              <button className="ufm-dp-cancel" onClick={onClose}>
                Cancel
              </button>

              <button className="ufm-dp-download" onClick={onDownload}>
                <Download size={18} />
                Download Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
