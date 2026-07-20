import "./Topbar.css";
import { useEffect, useState } from "react";
import { Search, Bell, Sun, Moon, ChevronDown } from "lucide-react";

import { getNotifications } from "../../../service/notification.service.js";
import NotificationDropdown from "../../../common/NotificationDropdown.jsx";

export default function Topbar() {
  const [darkMode, setDarkMode] = useState(true);

  const [notifications, setNotifications] = useState([]);

  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  }

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <header className="ufm-topbar">
      {/* SEARCH */}

      <div className="ufm-topbar-search-section">
        <div className="ufm-topbar-search">
          <Search size={20} className="ufm-topbar-search-icon" />

          <input
            type="text"
            placeholder="Search downloads, history..."
            className="ufm-topbar-search-input"
          />
        </div>
      </div>

      {/* ACTIONS */}

      <div className="ufm-topbar-actions">
        {/* Theme */}

        <button
          className="ufm-topbar-icon-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notification */}

        <div className="ufm-notification-wrapper">
          <button
            className="ufm-topbar-icon-btn"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="ufm-topbar-badge">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationDropdown notifications={notifications} />
          )}
        </div>

        {/* PROFILE */}

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
