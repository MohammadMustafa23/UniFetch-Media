import "./Queue.css";
import { Pause, X, PlaySquareIcon , CameraIcon } from "lucide-react";

const downloads = [
  {
    id: 1,
    title: "React Dashboard Tutorial",
    platform: "YouTube",
    progress: 72,
    speed: "12.8 MB/s",
    eta: "18 sec",
    thumbnail: "https://placehold.co/90x60",
    icon: <PlaySquareIcon size={18} />,
  },
  {
    id: 2,
    title: "Travel Reel 4K",
    platform: "Instagram",
    progress: 35,
    speed: "6.4 MB/s",
    eta: "41 sec",
    thumbnail: "https://placehold.co/90x60",
    icon: <CameraIcon size={18} />,
  },
];

export default function Queue() {
  return (
    <section className="ufm-queue">
      <div className="ufm-queue-header">
        <div>
          <h2>Live Download Queue</h2>
          <p>Monitor all active downloads.</p>
        </div>

        <button className="ufm-queue-view-btn">View All</button>
      </div>

      <div className="ufm-queue-list">
        {downloads.map((item) => (
          <div key={item.id} className="ufm-queue-card">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="ufm-queue-thumb"
            />

            <div className="ufm-queue-content">
              <div className="ufm-queue-top">
                <div>
                  <h3>{item.title}</h3>

                  <span className="ufm-queue-platform">
                    {item.icon}

                    {item.platform}
                  </span>
                </div>

                <div className="ufm-queue-actions">
                  <button>
                    <Pause size={18} />
                  </button>

                  <button>
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="ufm-queue-progress">
                <div
                  className="ufm-queue-progress-fill"
                  style={{
                    width: `${item.progress}%`,
                  }}
                ></div>
              </div>

              <div className="ufm-queue-footer">
                <span>{item.progress}%</span>

                <span>{item.speed}</span>

                <span>{item.eta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
