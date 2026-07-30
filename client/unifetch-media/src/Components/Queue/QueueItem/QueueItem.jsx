import "./QueueItem.css";

import { Camera, Music2, PlaySquare, HardDrive, Sparkles } from "lucide-react";

import QueueProgress from "../QueueProgress/QueueProgress";
import QueueActions from "../QueueActions/QueueActions";

const platformIcons = {
  youtube: <PlaySquare size={20} />,
  instagram: <Camera size={20} />,
  spotify: <Music2 size={20} />,
};

const QueueItem = ({ item }) => {
  const platform = (item.platform || "").toLowerCase();
  const progress = item.progress || 0;

  const fileSize =
    item.fileSize > 0
      ? `${(item.fileSize / (1024 * 1024)).toFixed(2)} MB`
      : "--";

  return (
    <article className="queue-item">
      {/* Top */}
      <div className="queue-top">
        <div className="queue-thumb">
          {platformIcons[platform] || <PlaySquare size={20} />}
        </div>

        <div className="queue-content">
          <h3>{item.title}</h3>

          <div className="queue-meta">
            <span>{item.platform}</span>

            <span className="dot" />

            <span>{item.quality || "Best"}</span>

            <span className="dot" />

            <span>
              <HardDrive size={13} />
              {fileSize}
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="queue-progress-section">
        <div className="queue-progress-header">
          <div className={`queue-status ${(item.status || "").toLowerCase()}`}>
            {item.status}
          </div>

          <span className="queue-percent">
            <Sparkles size={13} />
            {progress}%
          </span>
        </div>

        <QueueProgress progress={progress} />
      </div>

      {/* Actions */}
      <div className="queue-item-right">
        <QueueActions item={item} />
      </div>
    </article>
  );
};

export default QueueItem;
