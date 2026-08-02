import "./DownloadCard.css";

import {
  Play,
  Share2,
  Trash2,
  Camera,
  Music2,
  PlaySquare,
  LoaderCircle,
} from "lucide-react";

import { formatFileSize } from "../../../utils/formatFileSize.js";

const icons = {
  youtube: <PlaySquare size={18} />,
  instagram: <Camera size={18} />,
  facebook: <Camera size={18} />,
  tiktok: <Camera size={18} />,
  twitter: <Camera size={18} />,
  spotify: <Music2 size={18} />,
};

export default function DownloadCard({
  item,
  onPlay,
  onSave,
  onShare,
  onDelete,
  saving,
}) {
  return (
    <article className="download-card">
      {/* Thumbnail */}
      <div className="download-thumb">
        <img src={item.thumbnail} alt={item.title} />

        <button
          className="download-play"
          aria-label="Play video"
          onClick={() => onPlay(item)}
        >
          <Play size={18} />
        </button>

        <span className="download-platform">
          {icons[item.platform?.toLowerCase()]}
          {item.platform}
        </span>
      </div>

      {/* Content */}
      <div className="download-body">
        <h3>{item.title}</h3>

        <p>
          {item.quality}
          <span> • </span>
          {item.format?.toUpperCase()}
          <span> • </span>
          {formatFileSize(item.fileSize)}
        </p>

        <small>Downloaded {new Date(item.createdAt).toLocaleString()}</small>
      </div>

      {/* Actions */}
      <div className="download-actions">
        {/* Play */}
        <button type="button" title="Play" onClick={() => onPlay(item)}>
          <Play size={18} />
        </button>

        {/* Save */}
        <button
          className={`primary-btn ${saving ? "loading" : ""}`}
          disabled={saving}
          onClick={() => onSave(item)}
        >
          {saving ? (
            <>
              <LoaderCircle size={18} className="btn-spinner" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save</span>
          )}
        </button>

        {/* Share */}
        <button title="Share" onClick={() => onShare(item)} disabled={saving}>
          <Share2 size={18} />
        </button>

        {/* Delete */}
        <button
          className="delete-btn"
          title="Delete"
          onClick={() => onDelete(item)}
          disabled={saving}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
}
