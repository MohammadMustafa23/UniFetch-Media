import "./QueueItem.css";

import {
  Pause,
  Play,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Trash2,
  PlaySquareIcon,
  Music2,
  Camera,
} from "lucide-react";

import QueueProgress from "../QueueProgress/QueueProgress";
import QueueActions from "../QueueActions/QueueActions";

const platformIcons = {
  Instagram: <Camera size={18} />,
  YouTube: <PlaySquareIcon size={18} />,
  Spotify: <Music2 size={18} />,
};

const QueueItem = ({ item }) => {
  return (
    <div className="queue-item">
      <div className="queue-item-left">
        <div className="queue-thumb">{platformIcons[item.platform]}</div>

        <div className="queue-content">
          <h3>{item.title}</h3>

          <p>
            {item.platform}

            <span>•</span>

            {item.quality}

            <span>•</span>

            {item.size}
          </p>

          <QueueProgress progress={item.progress} />
        </div>
      </div>

      <div className="queue-item-right">
        <div className={`queue-status ${item.status.toLowerCase()}`}>
          {item.status}
        </div>

        <span className="queue-percent">{item.progress}%</span>

        <QueueActions />
      </div>
    </div>
  );
};

export default QueueItem;
