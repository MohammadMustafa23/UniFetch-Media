import "./DashboardAside.css";
import {
  Sparkles,
  TrendingUp,
  Bell,
  Zap,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

const tips = [
  "Paste any YouTube or Instagram URL.",
  "Highest quality is selected automatically.",
  "Downloads continue in the background.",
  "Manage everything from Queue.",
];

const iconMap = {
  auto: <Zap size={18} />,
  completed: <CheckCircle2 size={18} />,
  queue: <Bell size={18} />,
};

export default function DashboardAside({ today, latestUpdates = [] }) {
  return (
    <aside className="ufm-aside">
      {/* Quick Tips */}

      <div className="ufm-aside-card">
        <div className="ufm-aside-head">
          <Sparkles size={20} />
          <h3>Quick Tips</h3>
        </div>

        <ul className="ufm-tip-list">
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* Today's Activity */}

      <div className="ufm-aside-card">
        <div className="ufm-aside-head">
          <TrendingUp size={20} />
          <h3>Today's Activity</h3>
        </div>

        <div className="ufm-activity">
          <div>
            <h2>{today?.downloads ?? 0}</h2>
            <span>Downloads</span>
          </div>

          <div>
            <h2>{today?.bandwidth ?? "0 MB"}</h2>
            <span>Bandwidth</span>
          </div>
        </div>
      </div>

      {/* Latest Updates */}

      <div className="ufm-aside-card">
        <div className="ufm-aside-head">
          <Bell size={20} />
          <h3>Latest Updates</h3>
        </div>

        <div className="ufm-update-list">
          {latestUpdates.length > 0 ? (
            latestUpdates.map((item) => (
              <div key={item.id} className="ufm-update-item">
                <div className="ufm-update-icon">
                  {iconMap[item.type] || <Bell size={18} />}
                </div>

                <div className="ufm-update-content">
                  <h4>{item.title}</h4>

                  <p>{item.description}</p>
                </div>

                <ArrowUpRight size={18} />
              </div>
            ))
          ) : (
            <p className="ufm-no-updates">No recent updates.</p>
          )}
        </div>
      </div>
    </aside>
  );
}
