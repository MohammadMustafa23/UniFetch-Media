import "./style/FeatureSection.css";
import {
  Search,
  Play,
  Clipboard,
  Download,
  LayoutGrid,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: <Search size={22} />,
    title: "Fetch any link",
    description:
      "Paste a supported media link and UniFetch resolves the source in seconds — no guessing which formats it holds.",
  },
  {
    icon: <Play size={22} />,
    title: "Preview before you commit",
    description:
      "See the title, duration, and every available format before a single byte downloads.",
  },
  {
    icon: <Clipboard size={22} />,
    title: "Auto Paste",
    badge: "NEW",
    description:
      "Copy a supported link anywhere and UniFetch catches it from your clipboard before you switch tabs.",
  },
  {
    icon: <Download size={22} />,
    title: "Auto Download",
    badge: "POPULAR",
    description:
      "Set your defaults once — matching formats and sources download automatically.",
  },
  {
    icon: <LayoutGrid size={22} />,
    title: "Queue & History",
    featured: true,
    description:
      "Manage active downloads in one queue and revisit everything you've fetched anytime.",
  },
  {
    icon: <Shield size={22} />,
    title: "Secure by design",
    badge: "RECOMMENDED",
    description:
      "Optional account security and complete history management keep everything private.",
  },
];

export default function FeatureSection() {
  return (
    <section className="featureSection">
      <div className="featureSection__container">
        <div className="featureSection__header">
          <div className="featureSection__label">
            <span></span>
            <p>FEATURES</p>
          </div>

          <h2>Everything your queue needs</h2>

          <p className="featureSection__subtitle">
            Built with speed, security, and simplicity in mind — a seamless
            experience across desktop, tablet, and mobile.
          </p>
        </div>

        <div className="featureSection__grid">
          {features.map((item, index) => (
            <div
              key={index}
              className={`featureCard ${
                item.featured ? "featureCard--featured" : ""
              }`}
            >
              <div className="featureCard__icon">{item.icon}</div>

              <div className="featureCard__title">
                {item.title}

                {item.badge && (
                  <span className="featureCard__badge">{item.badge}</span>
                )}
              </div>

              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
