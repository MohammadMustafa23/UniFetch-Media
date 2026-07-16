import "./QueueItem.css";

import {
  Camera,
  Music2,
  PlaySquareIcon,
} from "lucide-react";

import QueueProgress from "../QueueProgress/QueueProgress";
import QueueActions from "../QueueActions/QueueActions";

const platformIcons = {
  youtube: <PlaySquareIcon size={18} />,
  instagram: <Camera size={18} />,
  spotify: <Music2 size={18} />,
};

const QueueItem = ({ item }) => {
  const platform = (item.platform || "").toLowerCase();

  return (
    <div className="queue-item">
      <div className="queue-item-left">
        <div className="queue-thumb">
          {platformIcons[platform] || <PlaySquareIcon size={18} />}
        </div>

        <div className="queue-content">
          <h3>{item.title}</h3>

          <p>
            {item.platform}

            <span>•</span>

            {item.quality || "Best"}

            <span>•</span>

            {item.fileSize > 0
              ? `${(item.fileSize / (1024 * 1024)).toFixed(2)} MB`
              : "--"}
          </p>

          <QueueProgress progress={item.progress || 0} />
        </div>
      </div>

      <div className="queue-item-right">
        <div className={`queue-status ${(item.status || "").toLowerCase()}`}>
          {item.status}
        </div>

        <span className="queue-percent">
          {item.progress || 0}%
        </span>

        <QueueActions item={item} />
      </div>
    </div>
  );
};

export default QueueItem;