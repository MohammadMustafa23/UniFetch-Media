import "./EmptyFavorites.css";

import { Heart, Download } from "lucide-react";

export default function EmptyFavorites() {
  return (
    <section className="ufm-empty-favorites">
      <div className="ufm-empty-icon">
        <Heart size={52} />
      </div>

      <h2>No Favorites Yet</h2>

      <p>Save your favorite downloads to access them quickly anytime.</p>

      <button className="ufm-empty-btn">
        <Download size={18} />
        Browse Downloads
      </button>
    </section>
  );
}
