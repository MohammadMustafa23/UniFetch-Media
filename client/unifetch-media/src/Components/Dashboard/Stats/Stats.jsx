import "./Stats.css";
import { Download, Activity, CheckCircle2, HardDrive } from "lucide-react";

const stats = [
  {
    icon: <Download size={26} />,
    value: "1,248",
    label: "Total Downloads",
    info: "+12 Today",
  },
  {
    icon: <Activity size={26} />,
    value: "08",
    label: "Active Downloads",
    info: "Running",
  },
  {
    icon: <CheckCircle2 size={26} />,
    value: "1,240",
    label: "Completed",
    info: "99.4% Success",
  },
  {
    icon: <HardDrive size={26} />,
    value: "42 GB",
    label: "Storage Used",
    info: "64 GB Total",
  },
];

export default function Stats() {
  return (
    <section className="ufm-stats">
      {stats.map((item, index) => (
        <div className="ufm-stat-card" key={index}>
          <div className="ufm-stat-icon">{item.icon}</div>

          <div className="ufm-stat-content">
            <h2>{item.value}</h2>

            <h4>{item.label}</h4>

            <span>{item.info}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
