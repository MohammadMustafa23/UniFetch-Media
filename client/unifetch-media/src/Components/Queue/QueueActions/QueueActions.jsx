import "./QueueActions.css";

import {
  Pause,
  Play,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Trash2,
} from "lucide-react";

const QueueActions = () => {
  return (
    <div className="queue-actions">
      <button title="Pause">
        <Pause size={16} />
      </button>

      <button title="Resume">
        <Play size={16} />
      </button>

      <button title="Retry">
        <RotateCcw size={16} />
      </button>

      <button title="Move Up">
        <ArrowUp size={16} />
      </button>

      <button title="Move Down">
        <ArrowDown size={16} />
      </button>

      <button className="danger" title="Delete">
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default QueueActions;
