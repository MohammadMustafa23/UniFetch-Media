import "./Stats.css";
import { Download, Activity, CheckCircle2, HardDrive } from "lucide-react";

export default function Stats({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      icon: <Download size={26} />,
      value: stats.totalDownloads.toLocaleString(),
      label: "Total Downloads",
      info: `+${stats.todayDownloads} Today`,
     
    },
    {
      icon: <Activity size={26} />,
      value: stats.activeDownloads.toString().padStart(2, "0"),
      label: "Active Downloads",
      info: "Running",
      
    },
    {
      icon: <CheckCircle2 size={26} />,
      value: stats.completedDownloads.toLocaleString(),
      label: "Completed",
      info: `${stats.successRate}% Success`,
      
    },
    {
      icon: <HardDrive size={26} />,
      value: stats.storageUsed,
      label: "Storage Used",
      info: `${stats.storageLimit} Total`,
     
    },
  ];

  return (
    <section className="ufm-stats">
      {cards.map((item, index) => (
        <article className="ufm-stat-card" key={index}>
          <div className="ufm-stat-icon">{item.icon}</div>

          <div className="ufm-stat-info">
            <p className="ufm-stat-label">{item.label}</p>

            <h2 className="ufm-stat-value">{item.value}</h2>

            <p className="ufm-stat-subtitle">{item.info}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
