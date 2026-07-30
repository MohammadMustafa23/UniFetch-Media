import "./DownloadsToolbar.css";
import { Search } from "lucide-react";

export default function DownloadsToolbar({
  search,
  setSearch,
  filter,
  setFilter,
}) {
  return (
    <section className="downloads-toolbar">
      {/* Search */}
      <div className="downloads-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search downloads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filter */}
      <div className="downloads-toolbar-right">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Files</option>
          <option value="mp4">Videos</option>
          <option value="mp3">Audio</option>
        </select>
      </div>
    </section>
  );
}
