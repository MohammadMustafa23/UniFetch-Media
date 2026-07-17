import "./QueueActions.css";

import {
  Pause,
  Play,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Trash2,
} from "lucide-react";

import {
  retryDownload,
  pauseDownload,
  resumeDownload,
  deleteDownload,
} from "../../../service/download.service.js";

const QueueActions = ({ item }) => {
  const handlePause = async () => {
    try {
      await pauseDownload(item._id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResume = async () => {
    try {
      await resumeDownload(item._id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRetry = async () => {
    try {
      await retryDownload(item._id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDownload(item._id);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="queue-actions">
     <button title="Pause" onClick={handlePause}>
        <Pause size={16} />
      </button>

     <button title="Resume" onClick={handleResume}>
        <Play size={16} />
      </button>

     <button title="Retry" onClick={handleRetry}>
        <RotateCcw size={16} />
      </button>

      <button title="Move Up">
        <ArrowUp size={16} />
      </button>

      <button title="Move Down">
        <ArrowDown size={16} />
      </button>

     <button className="danger" title="Delete"onClick={handleDelete}>
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default QueueActions;
