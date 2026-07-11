import "./RecentDownloads.css";
import {
  PlaySquareIcon,
  CameraIcon,
  Download,
  MoreVertical,
} from "lucide-react";

const recentDownloads = [
  {
    id: 1,
    title: "Modern React Dashboard UI",
    platform: "YouTube",
    size: "245 MB",
    quality: "1080P",
    date: "2 min ago",
    icon: <PlaySquareIcon size={16} />,
    thumbnail: "https://placehold.co/70x70",
  },
  {
    id: 2,
    title: "Travel Reel",
    platform: "Instagram",
    size: "42 MB",
    quality: "HD",
    date: "10 min ago",
    icon: <CameraIcon size={16} />,
    thumbnail: "https://placehold.co/70x70",
  },
  {
    id: 3,
    title: "Node.js Crash Course",
    platform: "YouTube",
    size: "610 MB",
    quality: "4K",
    date: "35 min ago",
    icon: <PlaySquareIcon size={16} />,
    thumbnail: "https://placehold.co/70x70",
  },
];

export default function RecentDownloads() {
  return (
    <section className="ufm-recent">

      <div className="ufm-recent-header">

        <div>
          <h2>Recent Downloads</h2>
          <p>Your latest completed downloads.</p>
        </div>

        <button className="ufm-recent-view">
          View All
        </button>

      </div>

      <div className="ufm-recent-list">

        {recentDownloads.map((item) => (

          <div
            key={item.id}
            className="ufm-recent-card"
          >

            <img
              src={item.thumbnail}
              alt={item.title}
              className="ufm-recent-thumb"
            />

            <div className="ufm-recent-info">

              <h3>{item.title}</h3>

              <span className="ufm-recent-platform">
                {item.icon}
                {item.platform}
              </span>

            </div>

            <div className="ufm-recent-meta">

              <span>{item.quality}</span>

              <span>{item.size}</span>

              <span>{item.date}</span>

            </div>

            <div className="ufm-recent-actions">

              <button>
                <Download size={18} />
              </button>

              <button>
                <MoreVertical size={18} />
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}