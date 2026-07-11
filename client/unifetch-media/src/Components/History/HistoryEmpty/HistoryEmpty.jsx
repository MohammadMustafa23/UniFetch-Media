import "./HistoryEmpty.css";

import { FolderOpen, Download } from "lucide-react";

export default function HistoryEmpty() {
  return (
    <section className="history-empty">
      <div className="history-empty-icon">
        <FolderOpen size={65} />
      </div>

      <h2>No Download History</h2>

      <p>
        Completed downloads will appear here.
        <br />
        Start downloading your favorite media.
      </p>

      <button className="history-empty-btn">
        <Download size={18} />
        Download Now
      </button>
    </section>
  );
}
