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

  const handlePause = async () => {
    try {
      setLoadingAction("pause");
      await pauseDownload(item._id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleResume = async () => {
    try {
      setLoadingAction("resume");
      await resumeDownload(item._id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRetry = async () => {
    try {
      setLoadingAction("retry");
      await retryDownload(item._id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async () => {
    try {
      setLoadingAction("delete");
      await deleteDownload(item._id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  const loadingMessage = {
    pause: "Pausing download...",
    resume: "Resuming download...",
    retry: "Retrying download...",
    delete: "Deleting download...",
  };

  return (
    <>
      {loadingAction && (
        <div className="queue-loader-overlay">
          <div className="queue-loader-card">
            <div className="queue-loader-spinner"></div>

            <h3>Processing...</h3>

            <p>{loadingMessage[loadingAction]}</p>
          </div>
        </div>
      )}

      <div className="queue-actions">
        <button
          title="Pause"
          onClick={handlePause}
          disabled={loadingAction !== null}
        >
          <Pause size={16} />
        </button>

        <button
          title="Resume"
          onClick={handleResume}
          disabled={loadingAction !== null}
        >
          <Play size={16} />
        </button>

        <button
          title="Retry"
          onClick={handleRetry}
          disabled={loadingAction !== null}
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
          onClick={handleDelete}
          disabled={loadingAction !== null}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </>
  );
};

export default QueueActions;
