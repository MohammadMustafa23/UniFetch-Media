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
    if (!mediaUrl.trim()) {
      return toast.error("Please paste a media URL.");
    }

    try {
      setLoading(true);

      // Auto Download Enabled
      if (preference?.download?.autoDownload) {
        const { data } = await autoDownload({ url: mediaUrl });

        if (data.success) {
          toast.success(data.message);
          setUrl("");
          return;
        }
      }

      // Manual Preview
      const { data } = await getDownloadInfo(mediaUrl);

      if (data.success) {
        setVideoInfo(data.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch media information.",
      );
    } finally {
      setLoading(false);
    }
  };
  const handleAutoPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!isSupportedUrl(text)) {
        return toast.error("Clipboard doesn't contain a supported URL.");
      }
      setUrl(text);
    } catch {
      toast.error("Unable to access clipboard.");
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
            onPaste={(e) => {
              const pastedUrl = e.clipboardData.getData("text");

              // Update input
              setUrl(pastedUrl);

              // Auto start download only if enabled
              if (
                preference?.download?.autoDownload &&
                isSupportedUrl(pastedUrl)
              ) {
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
            console.log("Button Clicked");
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
