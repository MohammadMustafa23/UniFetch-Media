import "./CleanupShortcuts.css";

import { Trash2, X } from "lucide-react";

export default function CleanupShortcuts() {
  return (
    <section className="ufm-cleanup-card">
      <h2>Cleanup shortcuts</h2>

      <button className="ufm-cleanup-btn">
        <div className="ufm-cleanup-left">
          <h4>Clear cache (0.0 GB)</h4>
        </div>

        <Trash2 size={18} />
      </button>

      <button className="ufm-cleanup-btn">
        <div className="ufm-cleanup-left">
          <h4>Remove failed downloads</h4>
        </div>

        <X size={18} />
      </button>
    </section>
  );
}
