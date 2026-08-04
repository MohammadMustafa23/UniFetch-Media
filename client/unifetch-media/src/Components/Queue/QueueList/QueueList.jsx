import { useCallback, useEffect, useState } from "react";

import socket from "../../../socket/socket.js";

import "./QueueList.css";

import PageLoader from "../../../common/PageLoader";
import QueueItem from "../QueueItem/QueueItem";
import EmptyQueue from "../EmptyQueue/EmptyQueue";
import { getQueue } from "../../../service/download.service";
import { saveDownload } from "../../../service/videoFunction.service.js";

const QueueList = ({ filter }) => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await getQueue();
      if (res.data.success) {
        setQueue(res.data.data || []);
      }
    } catch (error) {
      console.error("Queue Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial Queue Load
  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  // Live Progress Updates
  // Live Progress Updates
  useEffect(() => {
    const handleProgress = (data) => {
      setQueue((prev) =>
        prev.map((item) =>
          item._id === data.downloadId
            ? {
                ...item,
                progress: data.progress,
                downloadSpeed: data.downloadSpeed,
                eta: data.eta,
              }
            : item,
        ),
      );
    };

    const handleStatus = async (data) => {
      console.log("📡 download-status:", data);

      setQueue((prev) =>
        prev.map((item) => {
          if (item._id !== data.downloadId) return item;

          return {
            ...item,
            status: data.status ?? item.status,
            progress:
              data.progress !== undefined ? data.progress : item.progress,
            downloadSpeed:
              data.downloadSpeed !== undefined
                ? data.downloadSpeed
                : item.downloadSpeed,
            eta: data.eta !== undefined ? data.eta : item.eta,
          };
        }),
      );

      if (data.status === "completed" && data.storageProvider === "device") {
        try {
          await saveDownload(data.downloadId);
          console.log("📥 Browser download started");
        } catch (error) {
          console.error(error);
        }
      }

      if (
        ["paused", "failed", "cancelled", "completed"].includes(data.status)
      ) {
        fetchQueue();
      }
    };

    const handleDelete = ({ downloadId }) => {
      console.log("🗑 download-deleted:", downloadId);
      setQueue((prev) => prev.filter((item) => item._id !== downloadId));
      // Sync with backend
      fetchQueue();
    };

    // Register listeners
    socket.on("download-progress", handleProgress);

    socket.on("download-status", handleStatus);
    socket.on("download-deleted", handleDelete);

    return () => {
      socket.off("download-progress", handleProgress);
      socket.off("download-status", handleStatus);
      socket.off("download-deleted", handleDelete);

      console.log("🛑 QueueList socket listeners removed");
    };
  }, []);

  if (loading) {
    return (
      <PageLoader
        title="Loading Queue..."
        subtitle="Fetching your active downloads..."
      />
    );
  }

  const filteredQueue =
    filter === "All"
      ? queue
      : queue.filter(
          (item) => item.status.toLowerCase() === filter.toLowerCase(),
        );

  return (
    <section className="queue-list">
      {filteredQueue.length > 0 ? (
        filteredQueue.map((item) => <QueueItem key={item._id} item={item} />)
      ) : (
        <EmptyQueue />
      )}
    </section>
  );
};

export default QueueList;
