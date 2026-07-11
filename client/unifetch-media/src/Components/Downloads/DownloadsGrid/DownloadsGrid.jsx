import "./DownloadsGrid.css";

import DownloadCard from "../DownloadCard/DownloadCard";
import DownloadsEmpty from "../DownloadsEmpty/DownloadsEmpty";

const downloads = [
  {
    id: 1,
    title: "React Crash Course 2026",
    platform: "YouTube",
    thumbnail: "https://picsum.photos/600/400?random=1",
    quality: "1080P",
    format: "MP4",
    size: "1.2 GB",
    date: "Today • 10:35 AM",
  },

  {
    id: 2,
    title: "Travel Reel",
    platform: "Instagram",
    thumbnail: "https://picsum.photos/600/400?random=2",
    quality: "720P",
    format: "MP4",
    size: "220 MB",
    date: "Yesterday",
  },

  {
    id: 3,
    title: "LoFi Playlist",
    platform: "Spotify",
    thumbnail: "https://picsum.photos/600/400?random=3",
    quality: "320kbps",
    format: "MP3",
    size: "94 MB",
    date: "2 Days Ago",
  },

  {
    id: 4,
    title: "Nature Documentary",
    platform: "YouTube",
    thumbnail: "https://picsum.photos/600/400?random=4",
    quality: "4K",
    format: "MKV",
    size: "5.4 GB",
    date: "5 Jul 2026",
  },

  {
    id: 5,
    title: "Coding Podcast",
    platform: "Spotify",
    thumbnail: "https://picsum.photos/600/400?random=5",
    quality: "320kbps",
    format: "MP3",
    size: "72 MB",
    date: "6 Jul 2026",
  },

  {
    id: 6,
    title: "Football Highlights",
    platform: "YouTube",
    thumbnail: "https://picsum.photos/600/400?random=6",
    quality: "1080P",
    format: "MP4",
    size: "860 MB",
    date: "7 Jul 2026",
  },
];

export default function DownloadsGrid() {
  if (downloads.length === 0) {
    return <DownloadsEmpty />;
  }

  return (
    <section className="downloads-grid">
      {downloads.map((item) => (
        <DownloadCard key={item.id} item={item} />
      ))}
    </section>
  );
}
