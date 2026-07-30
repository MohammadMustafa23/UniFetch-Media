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

import { useState } from "react";

const QueueActions = ({ item }) => {
  const [loadingAction, setLoadingAction] = useState(null);

  const loadingMessage = {
    pause: "Pausing download...",
    resume: "Resuming download...",
    retry: "Retrying download...",
    delete: "Deleting download...",
  };

  const handleAction = async (action, apiCall) => {
    try {
      setLoadingAction(action);

      await apiCall(item._id);

      // No fetchQueue()
      // No window.location.reload()
      // Socket.IO will update the UI automatically.
    } catch (error) {
      console.error(`${action} failed:`, error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      {loadingAction && (
        <div className="queue-loader-overlay">
          <div className="queue-loader-card">
            <div className="queue-loader-spinner" />

            <h3>Processing...</h3>

            <p>{loadingMessage[loadingAction]}</p>
          </div>
        </div>
      )}

      <div className="queue-actions">
        <button
          title="Pause"
          disabled={loadingAction !== null}
          onClick={() => handleAction("pause", pauseDownload)}
        >
          <Pause size={16} />
        </button>

        <button
          title="Resume"
          disabled={loadingAction !== null}
          onClick={() => handleAction("resume", resumeDownload)}
        >
          <Play size={16} />
        </button>

        <button
          title="Retry"
          disabled={loadingAction !== null}
          onClick={() => handleAction("retry", retryDownload)}
        >
          <RotateCcw size={16} />
        </button>

        <button title="Move Up" disabled={loadingAction !== null}>
          <ArrowUp size={16} />
        </button>

        <button title="Move Down" disabled={loadingAction !== null}>
          <ArrowDown size={16} />
        </button>

        <button
          className="danger"
          title="Delete"
          disabled={loadingAction !== null}
          onClick={() => handleAction("delete", deleteDownload)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </>
  );
};

export default QueueActions;
