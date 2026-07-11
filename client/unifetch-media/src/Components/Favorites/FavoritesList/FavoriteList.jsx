import "./FavoriteList.css";
import FavoriteCard from "../FavoriteCard/FavoriteCard";

const favorites = [
  {
    id: 1,
    title: "Studio_Session_FullTake.mp4",
    platform: "YouTube",
    size: "2.1 GB",
    date: "Today, 9:41 AM",
    status: "Completed",
    favorite: true,
  },
  {
    id: 2,
    title: "Weekly_Recap.mp4",
    platform: "Instagram",
    size: "88 MB",
    date: "Jul 6",
    status: "Completed",
    favorite: true,
  },
];

export default function FavoriteList() {
  return (
    <section className="ufm-favorite-list">
      {favorites.map((item) => (
        <FavoriteCard key={item.id} item={item} />
      ))}
    </section>
  );
}
