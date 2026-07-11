import "./DashboardAside.css";
import {
  Sparkles,
  TrendingUp,
  Bell,
  Zap,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

const updates = [
  {
    icon: <Zap size={18} />,
    title: "Smart Auto Detect",
    desc: "Platform detection is now 30% faster.",
  },
  {
    icon: <Bell size={18} />,
    title: "Download Complete",
    desc: "Node.js Crash Course finished successfully.",
  },
  {
    icon: <CheckCircle2 size={18} />,
    title: "Queue Optimized",
    desc: "Background downloads are now more stable.",
  },
];

export default function DashboardAside() {
  return (
    <aside className="ufm-aside">
      {/* Tips */}

      <div className="ufm-aside-card">
        <div className="ufm-aside-head">
          <Sparkles size={20} />
          <h3>Quick Tips</h3>
        </div>

        <ul className="ufm-tip-list">
          <li>Paste any YouTube or Instagram URL.</li>
          <li>Highest quality is selected automatically.</li>
          <li>Downloads continue in the background.</li>
          <li>Manage everything from Queue.</li>
        </ul>
      </div>

      {/* Activity */}

      <div className="ufm-aside-card">
        <div className="ufm-aside-head">
          <TrendingUp size={20} />
          <h3>Today's Activity</h3>
        </div>

        <div className="ufm-activity">
          <div>
            <h2>28</h2>
            <span>Downloads</span>
          </div>

          <div>
            <h2>7.2GB</h2>
            <span>Bandwidth</span>
          </div>
        </div>
      </div>

      {/* Updates */}

      <div className="ufm-aside-card">
        <div className="ufm-aside-head">
          <Bell size={20} />
          <h3>Latest Updates</h3>
        </div>

        <div className="ufm-update-list">
          {updates.map((item, index) => (
            <div key={index} className="ufm-update-item">
              <div className="ufm-update-icon">{item.icon}</div>

              <div className="ufm-update-content">
                <h4>{item.title}</h4>

                <p>{item.desc}</p>
              </div>

              <ArrowUpRight size={18} />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
