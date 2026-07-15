import "./HistoryCard.css";

import {
  PlaySquare,
  Camera,
  Music2,
  Download,
  Heart,
  Trash2,
  CircleCheck,
  CircleX,
  Clock3,
  ScanFace,
} from "lucide-react";

const platformIcons = {
  youtube: <PlaySquare size={18} />,
  instagram: <Camera size={18} />,
  facebook: <ScanFace size={18} />,
  tiktok: <Music2 size={18} />,
  twitter: <Music2 size={18} />,
  other: <Music2 size={18} />,
};

function formatDuration(seconds) {
  if (!seconds) return "0:00";

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function HistoryCard({ item }) {
  return (
    <div className="history-card">
      {/* Left */}

      <div className="history-card-left">
        <img
          className="history-thumbnail"
          src={item.thumbnail}
          alt={item.title}
        />

        <div className="history-info">
          <h3>{item.title}</h3>

          <p>
            <span className="history-platform">
              {platformIcons[item.platform]}
              {item.platform}
            </span>

            <span>•</span>

            <span>
              <Clock3 size={14} />
              {formatDuration(item.duration)}
            </span>

            <span>•</span>

            <span>{item.bestQuality}</span>
          </p>
        </div>
      </div>

      {/* Right */}

      <div className="history-card-right">
        <div className="history-actions">
          <button>
            <Heart size={17} fill={item.favorite ? "currentColor" : "none"} />
          </button>

          <button>
            <Download size={17} />
          </button>

          <button className="history-delete">
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
