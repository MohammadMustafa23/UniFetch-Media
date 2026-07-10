import "./HeroDownload.css";
import { useState } from "react";
import {
  Download,
  PlaySquareIcon,
  CameraIcon,
  Link2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function HeroDownload() {
  const [url, setUrl] = useState("");

  return (
    <section className="ufm-hero">
      {/* Left */}

      <div className="ufm-hero-left">
        <span className="ufm-hero-badge">
          <Sparkles size={16} />
          Smart Downloader
        </span>

        <h1 className="ufm-hero-title">
          Download Any Media
          <br />
          <span>In Seconds.</span>
        </h1>

        <p className="ufm-hero-description">
          Paste a YouTube or Instagram link and let UniFetch fetch the highest
          available quality instantly.
        </p>
      </div>

      {/* Right */}

      <div className="ufm-hero-card">
        <h3>Quick Download</h3>

        <p>Paste your media URL below.</p>

        <div className="ufm-hero-input-box">
          <Link2 size={20} className="ufm-hero-input-icon" />

          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube / Instagram URL..."
            className="ufm-hero-input"
          />
        </div>

        <button className="ufm-hero-download-btn">
          <Download size={18} />
          Download Now
          <ArrowRight size={18} />
        </button>

        <div className="ufm-hero-platforms">
          <div className="ufm-hero-platform">
            <PlaySquareIcon size={18} />
            YouTube
          </div>

          <div className="ufm-hero-platform">
            <CameraIcon size={18} />
            Instagram
          </div>
        </div>
      </div>
    </section>
  );
}
