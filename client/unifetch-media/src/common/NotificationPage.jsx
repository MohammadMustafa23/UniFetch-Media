import "./NotificationPage.css";

import {
  Bell,
  Search,
  Trash2,
  CheckCheck,
  LoaderCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
} from "../service/notification.service";

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);

  if (days === 1) return "Yesterday";

  return `${days} days ago`;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [tab, setTab] = useState("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      setLoading(true);

      const data = await getNotifications();

      setNotifications(data.notifications || []);
    } finally {
      setLoading(false);
    }
  }

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesSearch =
        notification.title.toLowerCase().includes(search.toLowerCase()) ||
        notification.message.toLowerCase().includes(search.toLowerCase());

      const matchesTab = tab === "all" ? true : !notification.isRead;

      return matchesSearch && matchesTab;
    });
  }, [notifications, search, tab]);

  function getIcon(type) {
    switch (type) {
      case "success":
      case "download":
        return <CheckCircle2 size={20} />;

      case "warning":
        return <AlertTriangle size={20} />;

      case "info":
      case "login":
        return <Info size={20} />;

      default:
        return <XCircle size={20} />;
    }
  }

  async function handleRead(id) {
    await markAsRead(id);

    setNotifications((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              isRead: true,
            }
          : item,
      ),
    );
  }

  async function handleReadAll() {
    await markAllAsRead();

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true,
      })),
    );
  }

  async function handleDelete(id) {
    await deleteNotification(id);

    setNotifications((prev) => prev.filter((item) => item._id !== id));
  }

  async function handleClear() {
    await clearNotifications();

    setNotifications([]);
  }

  return (
    <div className="notification-page">
      <div className="notification-page-header">
        <div>
          <h2>Notifications</h2>

          <p>Manage all your UniFetch notifications</p>
        </div>

        <div className="notification-page-actions">
          <button onClick={handleReadAll}>
            <CheckCheck size={18} />
            Mark All Read
          </button>

          <button onClick={handleClear}>
            <Trash2 size={18} />
            Clear All
          </button>
        </div>
      </div>

      <div className="notification-toolbar">
        <div className="notification-search">
          <Search size={18} />

          <input
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="notification-tabs">
          <button
            className={tab === "all" ? "active" : ""}
            onClick={() => setTab("all")}
          >
            All
          </button>

          <button
            className={tab === "unread" ? "active" : ""}
            onClick={() => setTab("unread")}
          >
            Unread
          </button>
        </div>
      </div>

      {loading ? (
        <div className="notification-loading">
          <LoaderCircle className="spin" size={40} />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="notification-empty">
          <Bell size={60} />

          <h3>No Notifications</h3>

          <p>You're all caught up.</p>
        </div>
      ) : (
        <div className="notification-list">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-item ${
                !notification.isRead ? "unread" : ""
              }`}
              onClick={() => handleRead(notification._id)}
            >
              <div className={`notification-icon ${notification.type}`}>
                {getIcon(notification.type)}
              </div>

              <div className="notification-content">
                <h4>{notification.title}</h4>

                <p>{notification.message}</p>

                <small>{timeAgo(notification.createdAt)}</small>
              </div>

              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();

                  handleDelete(notification._id);
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
