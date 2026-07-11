import "./QueueHeader.css";
import { Plus } from "lucide-react";

const QueueHeader = () => {
  return (
    <div className="queue-header">
      <div className="queue-header-left">
        <h1>Download Queue</h1>

        <p>
          Real-time progress with pause, resume, retry, cancel, and priority
          controls.
        </p>
      </div>

      <button className="queue-add-btn">
        <Plus size={18} />
        Add Link
      </button>
    </div>
  );
};

export default QueueHeader;
