import "./style/TrustSection.css";

import { Shield, Lock, Zap, Smartphone, Download } from "lucide-react";

const trustItems = [
  {
    icon: <Shield size={28} />,
    title: "Secure Authentication",
    subtitle: "Protected user accounts with JWT.",
  },
  {
    icon: <Lock size={28} />,
    title: "Google Sign-In",
    subtitle: "Quick and secure account access.",
  },
  {
    icon: <Zap size={28} />,
    title: "Smart Queue",
    subtitle: "Pause, resume, and manage downloads.",
  },
  {
    icon: <Smartphone size={28} />,
    title: "Responsive Design",
    subtitle: "Works on desktop, tablet, and mobile.",
  },
  {
    icon: <Download size={28} />,
    title: "Cloud Storage",
    subtitle: "Save and manage downloads easily.",
  },
];

export default function TrustSection() {
  return (
    <section className="trustSection">
      <div className="trustSection__container">
        {/* Header */}

        <div className="trustSection__header">
          <div className="platformSection__label">
            <span className="uf-section-line"></span>
            <p>WHY UNIFETCH</p>
          </div>

          <h2 className="trustSection__title">
            Built for fast and reliable downloads
          </h2>
        </div>

        {/* Cards */}

        <div className="trustSection__grid">
          {trustItems.map((item) => (
            <div className="trustCard" key={item.title}>
              <div className="trustCard__icon">{item.icon}</div>

              <h3>{item.title}</h3>

              <p>{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
