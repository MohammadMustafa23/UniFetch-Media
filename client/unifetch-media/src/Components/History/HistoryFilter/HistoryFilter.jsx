import "./HistoryFilter.css";
import { useState } from "react";

export default function HistoryFilter() {
  const [active, setActive] = useState("All");

  const filters = ["All", "Completed", "Failed"];

  return (
    <div className="history-filter">
      {filters.map((item) => (
        <button
          key={item}
          onClick={() => setActive(item)}
          className={`history-filter-btn ${
            active === item ? "history-filter-active" : ""
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
