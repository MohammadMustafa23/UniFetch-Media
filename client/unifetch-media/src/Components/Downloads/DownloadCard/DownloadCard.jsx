import "./DownloadCard.css";

import {
  Heart,
  FolderOpen,
  Share2,
  Trash2,
  PlaySquareIcon,
  CameraIcon ,
  Music2,
  Play,
} from "lucide-react";

const icons = {
  YouTube: <PlaySquareIcon size={18} />,
  CameraIcon : <CameraIcon  size={18} />,
  Spotify: <Music2 size={18} />,
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
          {icons[item.platform]}

          {item.platform}
        </span>
      </div>

      {/* Content */}

      <div className="download-body">
        <h3>{item.title}</h3>

        <p>
          {item.quality}

          <span>•</span>

          {item.format}

          <span>•</span>

          {item.size}
        </p>

        <small>Downloaded {item.date}</small>
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
