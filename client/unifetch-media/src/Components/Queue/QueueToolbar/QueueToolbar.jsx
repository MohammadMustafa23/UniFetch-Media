import "./QueueToolbar.css";
import { useNavigate } from "react-router-dom";

import {
  Search,
  PauseCircle,
  PlayCircle,
  Trash2,
  Plus,
  ArrowUpDown,
} from "lucide-react";

const QueueToolbar = ({
  search,
  setSearch,
  onPauseAll,
  onResumeAll,
  onClearQueue,
  sortOrder,
  toggleSort,
}) => {
  const navigate = useNavigate();

  return (
    <section className="queue-toolbar">
      {/* Left */}

      <div className="queue-toolbar-left">
        <div className="queue-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search downloads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Right */}

      <div className="queue-toolbar-right">
        <button
          className="toolbar-btn primary"
          onClick={() => navigate("/dashboard")}
        >
          <Plus size={17} />
          Add Link
        </button>

        <button className="toolbar-btn" onClick={onPauseAll}>
          <PauseCircle size={17} />
          Pause All
        </button>

        <button className="toolbar-btn" onClick={onResumeAll}>
          <PlayCircle size={17} />
          Resume All
        </button>

        <button className="toolbar-btn" onClick={toggleSort}>
          <ArrowUpDown size={17} />
          {sortOrder === "newest" ? "Newest" : "Oldest"}
        </button>

        <button className="toolbar-btn danger" onClick={onClearQueue}>
          <Trash2 size={17} />
          Clear Queue
        </button>
      </div>
    </section>
  );
};

export default QueueToolbar;
