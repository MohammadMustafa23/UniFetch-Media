import { useMemo, useState } from "react";
import "./PreviewCard.css";

import {
  Play,
  Music4,
  Clock3,
  User,
  Eye,
  Calendar,
  Download,
  X,
  Check,
  BadgeCheck,
  MessageCircle,
  ThumbsUp,
  HardDrive,
  Monitor,
  Cpu,
} from "lucide-react";

function formatBytes(bytes) {
  console.log(bytes);
  
  if (!bytes) return "Unknown";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

export default function PreviewCard({ videoInfo, onClose, onDownload }) {
  if (!videoInfo) return null;

  const [downloadType, setDownloadType] = useState("video");

  const availableFormats = useMemo(() => {
    return downloadType === "video"
      ? videoInfo.downloads?.video || []
      : videoInfo.downloads?.audio || [];
  }, [downloadType, videoInfo]);

  const [selectedQuality, setSelectedQuality] = useState(
    availableFormats[0] || null,
  );

  const handleTypeChange = (type) => {
    setDownloadType(type);

    const formats =
      type === "video"
        ? videoInfo.downloads?.video || []
        : videoInfo.downloads?.audio || [];

    setSelectedQuality(formats[0] || null);
  };

  const estimatedSize =
    selectedQuality?.filesize || selectedQuality?.filesizeApprox;

  return (
    <section className="ufm-dp-card">
      {/* Header */}

      <div className="ufm-dp-header">
        <div>
          <h2>Media Preview</h2>
          <p>Review your download settings before downloading.</p>
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

          {videoInfo.media?.live && (
            <span className="ufm-type-badge live">LIVE</span>
          )}
        </div>

        {/* Right Content */}

        <div className="ufm-dp-content">
          <h3>{videoInfo.title}</h3>

          

          {/* Meta */}

          <div className="ufm-dp-meta">
            <span>
              <User size={16} />

              {videoInfo.uploader?.name}

              {videoInfo.uploader?.verified && (
                <BadgeCheck size={15} color="#3ea6ff" />
              )}
            </span>

            <span>
              <Clock3 size={16} />
              {videoInfo.durationString}
            </span>

            <span>
              <Calendar size={16} />
              {videoInfo.uploadDate}
            </span>
          </div>

          {/* Statistics */}

          <div className="ufm-dp-meta">
            <span>
              <Eye size={16} />
              {videoInfo.statistics?.views?.text}
            </span>

            <span>
              <ThumbsUp size={16} />
              {videoInfo.statistics?.likes?.text}
            </span>

            <span>
              <MessageCircle size={16} />
              {videoInfo.statistics?.comments?.text}
            </span>
          </div>

          {/* Info Grid */}

          <div className="ufm-dp-info-grid">
            <div className="ufm-dp-info">
              <span>Estimated Size</span>
              <strong>{formatBytes(estimatedSize)}</strong>
            </div>

            <div className="ufm-dp-info">
              <span>Platform</span>
              <strong>{videoInfo.platform}</strong>
            </div>

            <div className="ufm-dp-info">
              <span>Output</span>
              <strong>{downloadType === "video" ? "MP4" : "MP3"}</strong>
            </div>

            {selectedQuality?.vcodec && selectedQuality.vcodec !== "none" && (
              <div className="ufm-dp-info">
                <span>Codec</span>
                <strong>{selectedQuality.vcodec}</strong>
              </div>
            )}

            {selectedQuality?.abr && (
              <div className="ufm-dp-info">
                <span>Bitrate</span>
                <strong>{selectedQuality.abr} kbps</strong>
              </div>
            )}
          </div>
          {/* Download Type */}

          <div className="ufm-dp-group">
            <label>Download Type</label>

            <div className="ufm-dp-download-types">
              <button
                onClick={() => handleTypeChange("video")}
                className={`ufm-dp-type ${
                  downloadType === "video" ? "active" : ""
                }`}
              >
                <Play size={22} />

                <div>
                  <h4>Video</h4>
                  <p>MP4 • {videoInfo.downloads?.video?.length || 0} Formats</p>
                </div>
              </button>

              <button
                onClick={() => handleTypeChange("audio")}
                className={`ufm-dp-type ${
                  downloadType === "audio" ? "active" : ""
                }`}
              >
                <Music4 size={22} />

                <div>
                  <h4>Audio</h4>
                  <p>MP3 • {videoInfo.downloads?.audio?.length || 0} Formats</p>
                </div>
              </button>
            </div>
          </div>

          {/* Quality Selection */}

          <div className="ufm-dp-group">
            <label>
              {downloadType === "video" ? "Video Quality" : "Audio Quality"}
            </label>

            <div className="ufm-dp-options">
              {availableFormats.map((format) => (
                <button
                  key={format.formatId}
                  onClick={() => setSelectedQuality(format)}
                  className={`ufm-dp-option ${
                    selectedQuality?.formatId === format.formatId
                      ? "ufm-dp-option-active"
                      : ""
                  }`}
                >
                  {selectedQuality?.formatId === format.formatId && (
                    <Check size={15} />
                  )}

                  {downloadType === "video"
                    ? format.quality ||
                      format.resolution ||
                      format.formatNote ||
                      "Unknown"
                    : `${format.abr || 128} kbps`}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Format Details */}

          {selectedQuality && (
            <div className="ufm-dp-info-grid">
              {selectedQuality.ext && (
                <div className="ufm-dp-info">
                  <span>Extension</span>
                  <strong>{selectedQuality.ext.toUpperCase()}</strong>
                </div>
              )}

              {selectedQuality.filesize && (
                <div className="ufm-dp-info">
                  <span>File Size</span>
                  <strong>{formatBytes(selectedQuality.filesize)}</strong>
                </div>
              )}

              {selectedQuality.tbr && (
                <div className="ufm-dp-info">
                  <span>Total Bitrate</span>
                  <strong>{selectedQuality.tbr} kbps</strong>
                </div>
              )}

              {selectedQuality.vcodec && selectedQuality.vcodec !== "none" && (
                <div className="ufm-dp-info">
                  <span>Video Codec</span>
                  <strong>{selectedQuality.vcodec}</strong>
                </div>
              )}

              {selectedQuality.acodec && selectedQuality.acodec !== "none" && (
                <div className="ufm-dp-info">
                  <span>Audio Codec</span>
                  <strong>{selectedQuality.acodec}</strong>
                </div>
              )}
            </div>
          )}

          {/* Footer */}

          <div className="ufm-dp-footer">
            <button className="ufm-dp-cancel" onClick={onClose}>
              Cancel
            </button>

            <button
              className="ufm-dp-download"
              onClick={() =>
                onDownload({
                  type: downloadType,

                  formatId: selectedQuality?.formatId,

                  quality:
                    selectedQuality?.quality || selectedQuality?.resolution,

                  resolution: selectedQuality?.resolution,

                  fps: selectedQuality?.fps,

                  ext: selectedQuality?.ext,

                  filesize:
                    selectedQuality?.filesize ||
                    selectedQuality?.filesizeApprox,

                  abr: selectedQuality?.abr,

                  tbr: selectedQuality?.tbr,

                  vcodec: selectedQuality?.vcodec,

                  acodec: selectedQuality?.acodec,
                })
              }
            >
              <Download size={18} />

              <div>
                <span>Download Now</span>

                <small>
                  {downloadType === "video"
                    ? selectedQuality?.quality || selectedQuality?.resolution
                    : `${selectedQuality?.abr || 128} kbps`}
                  {" • "}
                  {selectedQuality?.ext?.toUpperCase()}
                </small>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
