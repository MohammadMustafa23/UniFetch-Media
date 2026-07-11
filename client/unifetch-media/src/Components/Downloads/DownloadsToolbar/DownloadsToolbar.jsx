import "./DownloadsToolbar.css";

import { Search, Grid2X2, List, ArrowUpDown } from "lucide-react";
import { useState } from "react";

export default function DownloadsToolbar() {
  const [gridView, setGridView] = useState(true);

  return (
    <section className="downloads-toolbar">
      {/* Search */}

      <div className="downloads-search">
        <Search size={18} />

        <input type="text" placeholder="Search downloads..." />
      </div>

      {/* Actions */}

      <div className="downloads-toolbar-right">
        <select>
          <option>All Files</option>

          <option>Videos</option>

          <option>Audio</option>

          <option>Images</option>
        </select>

        <button
          className="toolbar-icon-btn"
          onClick={() => setGridView(!gridView)}
        >
          {gridView ? <List size={18} /> : <Grid2X2 size={18} />}
        </button>

        <button className="toolbar-icon-btn">
          <ArrowUpDown size={18} />
        </button>
      </div>
    </section>
  );
}
