import "./ActivityTimeline.css";

import { CheckCircle2, XCircle, Bot } from "lucide-react";

const activities = [
  {
    id: 1,
    icon: <CheckCircle2 size={18} />,
    title: "React Tutorial.mp4",
    time: "Today • 10:42 AM",
    type: "success",
  },
  {
    id: 2,
    icon: <Bot size={18} />,
    title: "Automation Started",
    time: "Yesterday • 09:18 PM",
    type: "automation",
  },
  {
    id: 3,
    icon: <XCircle size={18} />,
    title: "Instagram Reel",
    time: "Yesterday • 08:27 PM",
    type: "failed",
  },
];

export default function ActivityTimeline() {
  return (
    <section className="ufm-activity">
      <h2>Recent Activity</h2>

      <div className="ufm-activity-list">
        {activities.map((item) => (
          <div key={item.id} className="ufm-activity-item">
            <div className={`ufm-activity-icon ${item.type}`}>{item.icon}</div>

            <div className="ufm-activity-info">
              <h4>{item.title}</h4>

              <p>{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
