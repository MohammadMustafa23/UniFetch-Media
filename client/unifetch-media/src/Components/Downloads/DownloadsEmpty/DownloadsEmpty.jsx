import "./DownloadsEmpty.css";

import { FolderOpen, Download } from "lucide-react";

export default function DownloadsEmpty() {
  return (
    <section className="downloads-empty">
      <div className="downloads-empty-icon">
        <FolderOpen size={68} />
      </div>

      <h2>No Downloads Yet</h2>

      <p>
        Downloaded videos, music and images
        <br />
        will appear here automatically.
      </p>

      <button className="downloads-empty-btn">
        <Download size={18} />
        Start Downloading
      </button>
    </section>
  );
}
