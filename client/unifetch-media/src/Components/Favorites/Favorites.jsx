import { useEffect, useState } from "react";

import "../Dashboard/style/Dashboard.css";
import "./Favorites.css";

/* Dashboard */
import Sidebar from "../../Components/Dashboard/Sidebar/Sidebar";
import Topbar from "../../Components/Dashboard/Topbar/Topbar";
import Footer from "../../Components/Dashboard/Footer/Footer";

/* Favorites */
import FavoritesHeader from "./FavoritesHeader/FavoritesHeader";
import FavoriteList from "./FavoritesList/FavoriteList";
import EmptyFavorites from "./EmptyFavorites/EmptyFavorites";

import PageLoader from "../../common/PageLoader";

import { getFavorites } from "../../service/history.service.js";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchFavorites() {
    try {
      setLoading(true);

      const response = await getFavorites();

      setFavorites(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <PageLoader
        title="Loading Favorites..."
        subtitle="Fetching your favorite media."
      />
    );
  }

  return (
    <div className="ufm-dashboard">
      <Sidebar />

      <main className="ufm-dashboard-main">
        <Topbar />

        <section className="favorites-page">
          <FavoritesHeader />

          {favorites.length > 0 ? (
            <FavoriteList
              favorites={favorites}
              fetchFavorites={fetchFavorites}
            />
          ) : (
            <EmptyFavorites />
          )}
        </section>

        <Footer />
      </main>
    </div>
  );
}
