import "./HeroDownload.css";
import { useState } from "react";
import { toast } from "sonner";
import {
  Download,
  PlaySquareIcon,
  CameraIcon,
  Link2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { getDownloadInfo } from "../../../service/download.service.js";

export default function HeroDownload({ setVideoInfo, setLoading }) {
  const [url, setUrl] = useState("");

 const handleDownloadInfo = async () => {
  console.log("START");

  if (!url.trim()) {
    return toast.error("Please paste a media URL.");
  }

  try {
    setLoading(true);
    console.log("Loading True");

    const { data } = await getDownloadInfo(url);

    console.log("API Response:", data);

    if (data.success) {
      setVideoInfo(data.data);
      console.log("Video Set");
    }
  } catch (error) {
    console.log("ERROR", error);

    toast.error(
      error.response?.data?.message || "Failed to fetch media information."
    );
  } finally {
    console.log("Loading False");
    setLoading(false);
  }
};
  return (
    <section className="ufm-hero">
      {/* LEFT */}

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

      {/* RIGHT */}

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

        <button
          className="ufm-hero-download-btn"
          onClick={() => {
            console.log("Button Clicked");
            handleDownloadInfo();
          }}
        >
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
