import "./FavoriteCard.css";

import { Play, Star, Download, Trash2 } from "lucide-react";

export default function FavoriteCard({ item }) {
  return (
    <article className="ufm-favorite-card">
      {/* Left */}

      <div className="ufm-favorite-left">
        <button className="ufm-favorite-preview">
          <Play size={18} />
        </button>

        <div className="ufm-favorite-info">
          <h3>{item.title}</h3>

          <p>
            <span>{item.platform}</span>

            <span>•</span>

            <span>{item.size}</span>
          </p>
        </div>
      </div>

      {/* Right */}

      <div className="ufm-favorite-right">
        <span className="ufm-favorite-date">{item.date}</span>

        <span className="ufm-favorite-status">{item.status}</span>

        <button className="ufm-favorite-action">
          <Star size={18} fill="#facc15" color="#facc15" />
        </button>

        <button className="ufm-favorite-action">
          <Download size={18} />
        </button>

        <button className="ufm-favorite-action ufm-delete">
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
}
