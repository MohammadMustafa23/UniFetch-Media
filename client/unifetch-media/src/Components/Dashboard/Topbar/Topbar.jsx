import "./Topbar.css";
import { useEffect, useState, useMemo } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import debounce from "lodash.debounce";

import { globalSearch } from "../../../service/history.service.js";
import { getNotifications } from "../../../service/notification.service.js";

import NotificationDropdown from "../../../common/NotificationDropdown.jsx";
import SearchDropdown from "../../../common/SearchDropdown.jsx";

export default function Topbar() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    downloads: [],
    history: [],
  });

  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = useMemo(
    () =>
      debounce(async (value) => {
        if (value.trim().length < 2) {
          setResults({
            downloads: [],
            history: [],
          });

          setShowDropdown(false);
          return;
        }

        try {
          setLoading(true);

          const data = await globalSearch(value);

          console.log(data);

          setResults(data);
          setShowDropdown(true);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }, 300),
    [],
  );

  useEffect(() => {
    fetchNotifications();

    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

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
            className="ufm-topbar-search-input"
            placeholder="Search downloads, history..."
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              handleSearch(value);
            }}
          />

          {showDropdown && (
            <SearchDropdown
              results={results}
              loading={loading}
              query={query}
              onClose={() => setShowDropdown(false)}
            />
          )}
        </div>
      </div>

      {/* ACTIONS */}

      <div className="ufm-topbar-actions">
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
