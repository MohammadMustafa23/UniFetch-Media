import { Search, Calendar, Download, Eye, CheckCircle2 } from "lucide-react";

const history = [
  {
    title: "Travel_Vlog_4K.mp4",
    type: "Video",
    size: "248 MB",
    date: "Today • 10:42 AM",
    status: "Completed",
  },
  {
    title: "Podcast_Episode_45.mp3",
    type: "Audio",
    size: "64 MB",
    date: "Yesterday",
    status: "Completed",
  },
  {
    title: "Instagram_Reel.mp4",
    type: "Video",
    size: "18 MB",
    date: "2 days ago",
    status: "Completed",
  },
  {
    title: "YouTube_Shorts.mp4",
    type: "Video",
    size: "36 MB",
    date: "Last Week",
    status: "Completed",
  },
];

export default function HistoryContent() {
  return (
    <div className="historyContent">
      {/* Header */}

      <div className="historyHeader">
        <div>
          <h2>Download History</h2>
          <p>Everything you've downloaded recently.</p>
        </div>

        <div className="historySearch">
          <Search size={18} />

          <input type="text" placeholder="Search downloads..." />
        </div>
      </div>

      {/* List */}

      <div className="historyList">
        {history.map((item) => (
          <div className="historyItem" key={item.title}>
            <div className="historyThumbnail">
              {item.type === "Video" ? "🎬" : "🎵"}
            </div>

            <div className="historyInfo">
              <h4>{item.title}</h4>

              <div className="historyMeta">
                <span>{item.type}</span>

                <span>{item.size}</span>

                <span>
                  <Calendar size={14} />
                  {item.date}
                </span>
              </div>
            </div>

            <div className="historyStatus">
              <CheckCircle2 size={16} />
              Completed
            </div>

            <div className="historyActions">
              <button>
                <Eye size={17} />
              </button>

              <button>
                <Download size={17} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
