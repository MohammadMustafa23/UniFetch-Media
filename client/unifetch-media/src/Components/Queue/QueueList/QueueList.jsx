import { useCallback, useEffect, useState } from "react";

import "./QueueList.css";

import QueueItem from "../QueueItem/QueueItem";
import EmptyQueue from "../EmptyQueue/EmptyQueue";
import { getQueue } from "../../../service/download.service";

const QueueList = () => {
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

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 2000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  if (loading) {
    return <p>Loading Queue...</p>;
    // Later:
    // return <PageLoader title="Loading Queue..." />;
  }

  return (
    <section className="queue-list">
      {queue.length > 0 ? (
        queue.map((item) => <QueueItem key={item._id} item={item} />)
      ) : (
        <EmptyQueue />
      )}
    </section>
  );
};

export default QueueList;
