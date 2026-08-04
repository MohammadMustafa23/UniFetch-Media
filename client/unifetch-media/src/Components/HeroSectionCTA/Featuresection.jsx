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
    title: "Instant Link Detection",
    description:
      "Paste a supported YouTube or Instagram link to instantly fetch media information, available formats, quality options, and file details.",
  },
  {
    icon: <Play size={22} />,
    title: "Preview Before Download",
    description:
      "Preview thumbnails, titles, duration, uploader information, and available download formats before adding media to your queue.",
  },
  {
    icon: <Clipboard size={22} />,
    title: "Auto Paste",
    badge: "NEW",
    description:
      "Automatically detect supported links copied to your clipboard and prepare them for download without manually pasting.",
  },
  {
    icon: <Download size={22} />,
    title: "Smart Downloads",
    badge: "POPULAR",
    description:
      "Automatically apply your preferred quality, format, and download settings to every supported download.",
  },
  {
    icon: <LayoutGrid size={22} />,
    title: "Queue & Download History",
    featured: true,
    description:
      "Manage active downloads with pause, resume, retry, progress tracking, and access your complete download history anytime.",
  },
  {
    icon: <Shield size={22} />,
    title: "Secure Cloud Storage",
    badge: "SECURE",
    description:
      "Keep your downloads protected with secure authentication, cloud storage support, and personalized user preferences.",
  },
];

export default function FeatureSection() {
  return (
    <section className="featureSection">
      <div className="featureSection__container">
        <div className="featureSection__header">
          <div className="platformSection__label">
            <span className="uf-section-line"></span>
            <p>FEATURES</p>
          </div>

          <h2>Everything You Need to Download Smarter</h2>

          <p className="featureSection__subtitle">
            UniFetch combines fast media downloads, intelligent queue
            management, cloud storage, real-time progress tracking, and a modern
            dashboard into one seamless experience.
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
