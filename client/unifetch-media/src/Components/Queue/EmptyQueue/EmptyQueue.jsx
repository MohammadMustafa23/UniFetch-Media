import "./EmptyQueue.css";

import { Inbox, Plus } from "lucide-react";

const EmptyQueue = () => {
  return (
    <section className="ufm-empty-queue">
      <div className="ufm-empty-icon">
        <Inbox size={64} strokeWidth={1.6} />
      </div>

      <h2>No Downloads in Queue</h2>

      <p>
        Your queue is currently empty.
        <br />
        Paste a media link to start downloading instantly.
      </p>

      <button className="ufm-empty-btn">
        <Plus size={18} />
        New Download
      </button>
    </section>
  );
};

export default EmptyQueue;
