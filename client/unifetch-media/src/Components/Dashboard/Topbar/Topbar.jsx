import "./Topbar.css";
import { useState } from "react";
import { Search, Bell, Sun, Moon, ChevronDown } from "lucide-react";

export default function Topbar() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <header className="ufm-topbar">
      {/* Left */}

      <div className="ufm-topbar-left">
        <div className="ufm-topbar-search">
          <Search size={20} className="ufm-topbar-search-icon" />

          <input
            type="text"
            placeholder="Search downloads, history..."
            className="ufm-topbar-search-input"
          />
        </div>
      </div>

      {/* Right */}

      <div className="ufm-topbar-right">
        {/* Theme */}

        <button
          className="ufm-topbar-icon-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notification */}

        <button className="ufm-topbar-icon-btn">
          <Bell size={20} />

          <span className="ufm-topbar-dot"></span>
        </button>

        {/* Profile */}

        <button className="ufm-topbar-profile">
          <div className="ufm-topbar-avatar">M</div>

          <div className="ufm-topbar-user">
            <h4>Mohammad</h4>

            <span>Premium</span>
          </div>

          <ChevronDown size={18} />
        </button>
      </div>
    </header>
  );
}
