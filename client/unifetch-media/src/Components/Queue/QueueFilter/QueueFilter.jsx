import "./QueueFilter.css";

export default function QueueFilter({ active, setActive }) {
  const filters = ["All", "Queued", "Downloading", "Paused", "Failed"];

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
