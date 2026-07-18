import "./CleanupShortcuts.css";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, X } from "lucide-react";

import {
  clearCache,
  removeFailedDownloads,
} from "../../../service/storage.service";

export default function CleanupShortcuts({ storage, refreshStorage }) {
  const [loading, setLoading] = useState(false);

  const formatSize = (bytes = 0) => {
    if (!bytes) return "0 B";

    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  };

  const handleClearCache = async () => {
    try {
      setLoading(true);

      const { data } = await clearCache();

      toast.success(data.message);

      refreshStorage();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear cache.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFailed = async () => {
    try {
      setLoading(true);

      const { data } = await removeFailedDownloads();

      toast.success(data.message);

      refreshStorage();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove failed downloads.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ufm-cleanup-card">
      <h2>Cleanup shortcuts</h2>

      <button
        className="ufm-cleanup-btn"
        onClick={handleClearCache}
        disabled={loading}
      >
        <div className="ufm-cleanup-left">
          <h4>Clear cache ({formatSize(storage?.cacheSize)})</h4>
        </div>

        <Trash2 size={18} />
      </button>

      <button
        className="ufm-cleanup-btn"
        onClick={handleRemoveFailed}
        disabled={loading}
      >
        <div className="ufm-cleanup-left">
          <h4>Remove failed downloads ({storage?.failedDownloads || 0})</h4>
        </div>

        <X size={18} />
      </button>
    </section>
  );
}
