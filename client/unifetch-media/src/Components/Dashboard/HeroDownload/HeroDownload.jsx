import "./HeroDownload.css";
import { toast } from "sonner";
import {
  Download,
  PlaySquareIcon,
  CameraIcon,
  Link2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import {
  getDownloadInfo,
  autoDownload,
} from "../../../service/download.service.js";

import isSupportedUrl from "../../../utils/isSupportedURL.js";

export default function HeroDownload({
  setVideoInfo,
  setLoading,
  url,
  setUrl,
  preference,
}) {
  const handleDownloadInfo = async (mediaUrl = url) => {
    const cleanUrl = mediaUrl?.trim();

    if (!cleanUrl) {
      return toast.error("Please paste a media URL.");
    }

    try {
      setLoading(true);

      // ==========================================
      // AUTO DOWNLOAD ON
      // ==========================================

      if (preference?.autoDownload === true) {
        const { data } = await autoDownload({
          url: cleanUrl,
        });

        if (!data?.success) {
          throw new Error(data?.message || "Auto download failed.");
        }

        toast.success(data.message || "Download added to queue.");

        setUrl("");

        return;
      }

      // ==========================================
      // AUTO DOWNLOAD OFF
      // ==========================================

      const { data } = await getDownloadInfo(cleanUrl);

      if (!data?.success) {
        throw new Error(data?.message || "Failed to fetch media information.");
      }

      setVideoInfo(data.data);
    } catch (error) {
      console.error("Handle Download Info Error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to process media.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAutoPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleanUrl = text?.trim();

      if (!cleanUrl) {
        return toast.error("Clipboard doesn't contain a URL.");
      }

      if (!isSupportedUrl(cleanUrl)) {
        return toast.error("Clipboard doesn't contain a supported URL.");
      }

      setUrl(cleanUrl);
    } catch (error) {
      console.error("Auto Paste Error:", error);

      toast.error("Unable to access clipboard.");
    }
  };

  // ...
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
            onPaste={(e) => {
              const pastedUrl = e.clipboardData.getData("text");

              // Update input
              setUrl(pastedUrl);

              // Auto start download only if enabled
              if (preference?.autoDownload && isSupportedUrl(pastedUrl)) {
                setTimeout(() => {
                  handleDownloadInfo(pastedUrl);
                }, 100);
              }
            }}
            placeholder="Paste YouTube / Instagram URL..."
            className="ufm-hero-input"
          />
        </div>

        <button
          className="ufm-hero-download-btn"
          onClick={() => {
            handleDownloadInfo();
          }}
        >
          <Download size={18} />
          Download Now
          <ArrowRight size={18} />
        </button>

        <button className="ufm-hero-download-btn" onClick={handleAutoPaste}>
          <Download size={18} />
          Auto Paste
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
