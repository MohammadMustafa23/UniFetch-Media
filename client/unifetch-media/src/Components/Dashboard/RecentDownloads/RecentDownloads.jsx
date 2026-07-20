import "./RecentDownloads.css";
import {
  PlaySquare,
  Camera,
  Download,
  MoreVertical,
  Music2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DownloadsEmpty from "../../Downloads/DownloadsEmpty/DownloadsEmpty";

export default function RecentDownloads({ downloads = [] }) {
  const navigate = useNavigate();

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case "youtube":
        return <PlaySquare size={16} />;
      case "instagram":
        return <Camera size={16} />;
      default:
        return <Music2 size={16} />;
    }
  };

  const formatDate = (date) => {
    const diff = Date.now() - new Date(date).getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;

    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <section className="ufm-recent">
      <div className="ufm-recent-header">
        <div>
          <h2>Recent Downloads</h2>
          <p>Your latest completed downloads.</p>
        </div>

        <button
          className="ufm-recent-view"
          onClick={() => navigate("/downloads")}
        >
          View All
        </button>
      </div>

      <div className="ufm-recent-list">
        {downloads.length > 0 ? (
          downloads.map((item) => (
            <div key={item._id} className="ufm-recent-card">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="ufm-recent-thumb"
              />

              <div className="ufm-recent-info">
                <h3>{item.title}</h3>

                <span className="ufm-recent-platform">
                  {getPlatformIcon(item.platform)}
                  {item.platform}
                </span>
              </div>

              <div className="ufm-recent-meta">
                <span>{item.quality}</span>

                <span>{item.fileSize || "--"}</span>

                <span>{formatDate(item.updatedAt)}</span>
              </div>

              <div className="ufm-recent-actions">
                <button title="Download Again">
                  <Download size={18} />
                </button>

                <button title="More">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <DownloadsEmpty/>
        )}
      </div>
    </section>
  );
}
