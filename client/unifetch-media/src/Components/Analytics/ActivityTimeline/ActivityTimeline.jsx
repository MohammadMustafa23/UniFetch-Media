import "./ActivityTimeline.css";

import { CheckCircle2, XCircle, Clock3, PauseCircle } from "lucide-react";

const getIcon = (status) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 size={18} />;

    case "failed":
      return <XCircle size={18} />;

    case "paused":
      return <PauseCircle size={18} />;

    default:
      return <Clock3 size={18} />;
  }
};

const getType = (status) => {
  switch (status) {
    case "completed":
      return "success";

    case "failed":
      return "failed";

    case "paused":
      return "paused";

    default:
      return "automation";
  }
};

const formatTime = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function ActivityTimeline({ analytics }) {
  const activities = analytics?.recentActivity || [];

  return (
    <section className="ufm-activity">
      <h2>Recent Activity</h2>

      <div className="ufm-activity-list">
        {activities.length === 0 ? (
          <p>No recent activity.</p>
        ) : (
          activities.map((item) => (
            <div key={item._id} className="ufm-activity-item">
              <div className={`ufm-activity-icon ${getType(item.status)}`}>
                {getIcon(item.status)}
              </div>

              <div className="ufm-activity-info">
                <h4>{item.title}</h4>

                <p>
                  {item.platform} • {item.status}
                </p>

                <small>{formatTime(item.updatedAt)}</small>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
