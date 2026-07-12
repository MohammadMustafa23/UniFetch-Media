import "./style/TrustSection.css";

import { Shield, Lock, Zap, Smartphone, Globe } from "lucide-react";

const trustItems = [
  {
    icon: <Shield size={28} />,
    title: "Encrypted transfers",
    subtitle: "Every download, end to end",
  },
  {
    icon: <Lock size={28} />,
    title: "Two-factor auth",
    subtitle: "Optional, in under a minute",
  },
  {
    icon: <Zap size={28} />,
    title: "99.9% uptime",
    subtitle: "Queue that keeps running",
  },
  {
    icon: <Smartphone size={28} />,
    title: "Cross-device",
    subtitle: "Desktop, tablet, mobile",
  },
  {
    icon: <Globe size={28} />,
    title: "40+ platforms",
    subtitle: "And growing every month",
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
            <p>TRUST & PERFORMANCE</p>
          </div>

          

          <h2 className="trustSection__title">
            Fast, secure, and built to last
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
