import "./QueueToolbar.css";

import {
  Search,
  PauseCircle,
  PlayCircle,
  Trash2,
  Plus,
  ArrowUpDown,
} from "lucide-react";

const QueueToolbar = () => {
  return (
    <section className="queue-toolbar">
      {/* Left */}

      <div className="queue-toolbar-left">
        <div className="queue-search">
          <Search size={18} />

          <input type="text" placeholder="Search downloads..." />
        </div>
      </div>

      {/* Right */}

      <div className="queue-toolbar-right">
        <button className="toolbar-btn primary">
          <Plus size={17} />
          Add Link
        </button>

        <button className="toolbar-btn">
          <PauseCircle size={17} />
          Pause All
        </button>

        <button className="toolbar-btn">
          <PlayCircle size={17} />
          Resume
        </button>

        <button className="toolbar-btn">
          <ArrowUpDown size={17} />
          Sort
        </button>

        <button className="toolbar-btn danger">
          <Trash2 size={17} />
          Clear
        </button>
      </div>
    </section>
  );
};

export default QueueToolbar;
