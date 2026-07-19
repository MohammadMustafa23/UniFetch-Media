import { useCallback, useEffect, useState } from "react";

import socket from "../../../socket/socket.js";

import "./QueueList.css";

import PageLoader from "../../../common/PageLoader";
import QueueItem from "../QueueItem/QueueItem";
import EmptyQueue from "../EmptyQueue/EmptyQueue";
import { getQueue } from "../../../service/download.service";

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
                status: data.progress >= 100 ? "completed" : "downloading",
              }
            : item,
        ),
      );

      // Remove completed download after 1 second
      if (data.progress >= 100) {
        setTimeout(() => {
          setQueue((prev) =>
            prev.filter((item) => item._id !== data.downloadId),
          );
        }, 1000);
      }
    };

    socket.on("download-progress", handleProgress);

    return () => {
      socket.off("download-progress", handleProgress);
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
