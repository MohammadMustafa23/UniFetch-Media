import "./Queue.css";
import { Pause, X, PlaySquare, Camera, Music2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyQueue from "../../Queue/EmptyQueue/EmptyQueue";

export default function Queue({ queue = [] }) {
  const navigate = useNavigate();

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case "youtube":
        return <PlaySquare size={18} />;
      case "instagram":
        return <Camera size={18} />;
      default:
        return <Music2 size={18} />;
    }
  };

  return (
    <section className="ufm-queue">
      <div className="ufm-queue-header">
        <div>
          <h2>Live Download Queue</h2>
          <p>Monitor all active downloads.</p>
        </div>

        <button
          className="ufm-queue-view-btn"
          onClick={() => navigate("/queue")}
        >
          View All
        </button>
      </div>

      <div className="ufm-queue-list">
        {queue.length > 0 ? (
          queue.map((item) => (
            <div key={item._id} className="ufm-queue-card">
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
                      {getPlatformIcon(item.platform)}
                      {item.platform}
                    </span>
                  </div>

                  <div className="ufm-queue-actions">
                    <button title="Pause">
                      <Pause size={18} />
                    </button>

                    <button title="Cancel">
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="ufm-queue-progress">
                  <div
                    className="ufm-queue-progress-fill"
                    style={{
                      width: `${item.progress || 0}%`,
                    }}
                  />
                </div>

                <div className="ufm-queue-footer">
                  <span>{item.progress || 0}%</span>

                  <span>{item.downloadSpeed || "--"}</span>

                  <span>{item.eta || "--"}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyQueue/>
        )}
      </div>
    </section>
  );
}
