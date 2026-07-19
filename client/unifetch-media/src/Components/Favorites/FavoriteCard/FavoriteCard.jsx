import "./FavoriteCard.css";

import { useState } from "react";
import {
  PlaySquare,
  Camera,
  Music2,
  Download,
  Heart,
  Trash2,
  Clock3,
  Loader2,
  Check,
  ScanFace,
} from "lucide-react";

import { toast } from "sonner";

import {
  toggleFavorite,
  deleteHistory,
  downloadFromHistory,
} from "../../../service/history.service.js";

const platformIcons = {
  youtube: <PlaySquare size={18} />,
  instagram: <Camera size={18} />,
  facebook: <ScanFace size={18} />,
  tiktok: <Music2 size={18} />,
  twitter: <Music2 size={18} />,
  other: <Music2 size={18} />,
};

function formatDuration(seconds) {
  if (!seconds) return "0:00";

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function FavoriteCard({ item, fetchFavorites }) {
  const [downloading, setDownloading] = useState(false);
  const [queued, setQueued] = useState(false);

  const handleFavorite = async () => {
    try {
      await toggleFavorite(item._id);

      toast.success("Removed from favorites.");

      await fetchFavorites();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update favorite.",
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHistory(item._id);

      toast.success("History deleted successfully.");

      await fetchFavorites();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete history.");
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const response = await downloadFromHistory(item._id);

      toast.success(response.message);

      setQueued(true);

      await fetchFavorites();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to start download.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <article className="history-card">
      <div className="history-card-left">
        <img
          className="history-thumbnail"
          src={item.thumbnail}
          alt={item.title}
        />

        <div className="history-info">
          <h3>{item.title}</h3>

          <p>
            <span className="history-platform">
              {platformIcons[item.platform]}
              {item.platform}
            </span>

            <span>•</span>

            <span>
              <Clock3 size={14} />
              {formatDuration(item.duration)}
            </span>

            <span>•</span>

            <span>{item.bestQuality}</span>
          </p>
        </div>
      </div>

      <div className="history-card-right">
        <div className="history-actions">
          <button onClick={handleFavorite}>
            <Heart size={17} fill="currentColor" />
          </button>

          <button onClick={handleDownload} disabled={downloading || queued}>
            {downloading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : queued ? (
              <Check size={17} />
            ) : (
              <Download size={17} />
            )}
          </button>

          <button className="history-delete" onClick={handleDelete}>
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
