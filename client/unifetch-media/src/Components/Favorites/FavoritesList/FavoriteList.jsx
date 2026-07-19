import "./FavoriteList.css";

import FavoriteCard from "../FavoriteCard/FavoriteCard";

export default function FavoriteList({ favorites, fetchFavorites }) {
  return (
    <section className="ufm-favorite-list">
      {favorites.map((item) => (
        <FavoriteCard
          key={item._id}
          item={item}
          fetchFavorites={fetchFavorites}
        />
      ))}
    </section>
  );
}
