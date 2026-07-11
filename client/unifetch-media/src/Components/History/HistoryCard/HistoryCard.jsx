import "./HistoryCard.css";

import {
  PlaySquareIcon,
  CameraIcon,
  Music2,
  Download,
  Heart,
  Trash2,
  CircleCheck,
  CircleX,
} from "lucide-react";

const platformIcons = {
  YouTube: <PlaySquareIcon size={18} />,
  Instagram: <CameraIcon size={18} />,
  Spotify: <Music2 size={18} />,
};

export default function HistoryCard({ item }) {
  return (
    <div className="history-card">
      {/* Left */}

      <div className="history-card-left">
        <div className="history-platform">{platformIcons[item.platform]}</div>

        <div className="history-info">
          <h3>{item.title}</h3>

          <p>
            {item.platform}

            <span>•</span>

            {item.quality}

            <span>•</span>

            {item.size}

            <span>•</span>

            {item.date}
          </p>
        </div>
      </div>

      {/* Right */}

      <div className="history-card-right">
        <div
          className={`history-status ${
            item.status === "Completed" ? "history-success" : "history-failed"
          }`}
        >
          {item.status === "Completed" ? (
            <CircleCheck size={16} />
          ) : (
            <CircleX size={16} />
          )}

          {item.status}
        </div>

        <div className="history-actions">
          <button>
            <Heart size={17} />
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
