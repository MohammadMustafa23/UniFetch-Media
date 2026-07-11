import "./HistoryList.css";

import HistoryCard from "../HistoryCard/HistoryCard";
import HistoryEmpty from "../HistoryEmpty/HistoryEmpty";

const historyData = [
  {
    id: 1,
    title: "React Portfolio Tutorial.mp4",
    platform: "YouTube",
    quality: "1080P",
    size: "1.2 GB",
    date: "Today • 10:25 AM",
    status: "Completed",
  },
  {
    id: 2,
    title: "Instagram Reel.mp4",
    platform: "Instagram",
    quality: "720P",
    size: "182 MB",
    date: "Yesterday • 08:14 PM",
    status: "Completed",
  },
  {
    id: 3,
    title: "LoFi Playlist.mp3",
    platform: "Spotify",
    quality: "320kbps",
    size: "96 MB",
    date: "2 Days Ago",
    status: "Failed",
  },
  {
    id: 4,
    title: "Nature Documentary.mp4",
    platform: "YouTube",
    quality: "4K",
    size: "3.8 GB",
    date: "4 Jul 2026",
    status: "Completed",
  },
];

export default function HistoryList() {
  if (historyData.length === 0) {
    return <HistoryEmpty />;
  }

  return (
    <section className="history-list">
      {historyData.map((item) => (
        <HistoryCard key={item.id} item={item} />
      ))}
    </section>
  );
}
