import "./QueueList.css";

import QueueItem from "../QueueItem/QueueItem";
import EmptyQueue from '../EmptyQueue/EmptyQueue'

const dummyQueue = [
  {
    id: 1,
    title: "Instagram Reel.mp4",
    platform: "Instagram",
    quality: "720P",
    size: "128 MB",
    progress: 22,
    status: "Paused",
  },
  {
    id: 2,
    title: "YouTube Tutorial.mp4",
    platform: "YouTube",
    quality: "1080P",
    size: "1.2 GB",
    progress: 68,
    status: "Downloading",
  },
  {
    id: 3,
    title: "Music Playlist.mp3",
    platform: "Spotify",
    quality: "320kbps",
    size: "94 MB",
    progress: 100,
    status: "Completed",
  },
];

const QueueList = () => {
  return (
    <section className="queue-list">
      {dummyQueue.length === 0 ? (
        <EmptyQueue />
      ) : (
        dummyQueue.map((item) => <QueueItem key={item.id} item={item} />)
      )}
    </section>
  );
};

export default QueueList;
