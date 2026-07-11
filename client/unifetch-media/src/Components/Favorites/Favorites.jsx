import "../Dashboard/style/Dashboard.css";
import "./Favorites.css";

/* ==========================================
   DASHBOARD COMPONENTS
========================================== */

import Sidebar from "../../Components/Dashboard/Sidebar/Sidebar";
import Topbar from "../../Components/Dashboard/Topbar/Topbar";
import Footer from "../../Components/Dashboard/Footer/Footer";

/* ==========================================
   FAVORITES COMPONENTS
========================================== */

import FavoritesHeader from "./FavoritesHeader/FavoritesHeader";
import FavoriteList from "./FavoritesList/FavoriteList";
import EmptyFavorites from "./EmptyFavorites/EmptyFavorites";

export default function Favorites() {
  // Later this will come from API
  const hasFavorites = true;

  return (
    <div className="ufm-dashboard">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ufm-dashboard-main">
        {/* Topbar */}
        <Topbar />

        {/* Favorites */}
        <section className="favorites-page">
          <FavoritesHeader />

          

          {hasFavorites ? <FavoriteList /> : <EmptyFavorites />}
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
