import "./DownloadCard.css";

import {
  Heart,
  FolderOpen,
  Share2,
  Trash2,
  PlaySquare,
  Camera,
  Music2,
  Play,
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

export default function DownloadCard({ item }) {
  return (
    <article className="download-card">
      {/* Thumbnail */}

      <div className="download-thumb">
        <img src={item.thumbnail} alt={item.title} />

        <button className="download-play">
          <Play size={18} fill="white" />
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
        <button>
          <Heart size={18} />
        </button>

        <button>
          <FolderOpen size={18} />
        </button>

        <button>
          <Share2 size={18} />
        </button>

        <button className="delete-btn">
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
}
