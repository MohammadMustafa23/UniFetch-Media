import "./NotificationDropdown.css";

import {
  Bell,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Trash2,
  CheckCheck,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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

export default function NotificationDropdown() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const unread = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const data = await getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIcon = (type) => {
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
  };

  const handleRead = async (id) => {
    try {
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllAsRead();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        })),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();

    try {
      await deleteNotification(id);

      setNotifications((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = async () => {
    try {
      await clearNotifications();

      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="ufm-notification-dropdown">
      {/* Header */}

      <div className="ufm-notification-header">
        <div>
          <h3>Notifications</h3>

          <span>{unread} unread</span>
        </div>

        {!!notifications.length && (
          <button
            className="header-btn"
            onClick={handleReadAll}
            title="Mark all as read"
          >
            <CheckCheck size={18} />
          </button>
        )}
      </div>

      {/* Loading */}

      {loading && (
        <div className="ufm-notification-loading">
          <LoaderCircle className="notification-spinner" size={32} />

          <p>Loading notifications...</p>
        </div>
      )}

      {/* Empty */}

      {!loading && notifications.length === 0 && (
        <div className="ufm-notification-empty">
          <Bell size={52} />

          <h4>No Notifications</h4>

          <p>You're all caught up.</p>
        </div>
      )}

      {/* List */}

      {!loading && notifications.length > 0 && (
        <div className="ufm-notification-body">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`ufm-notification-card ${
                !notification.isRead ? "unread" : ""
              }`}
              onClick={() => handleRead(notification._id)}
            >
              <div className={`ufm-notification-icon ${notification.type}`}>
                {getIcon(notification.type)}
              </div>

              <div className="ufm-notification-info">
                <div className="title-row">
                  <h4>{notification.title}</h4>

                  <button
                    className="delete-btn"
                    title="Delete"
                    onClick={(e) => handleDelete(e, notification._id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <p>{notification.message}</p>

                <small>{timeAgo(notification.createdAt)}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}

      {!loading && notifications.length > 0 && (
        <div className="ufm-notification-footer">
          <button className="clear-btn" onClick={handleClear}>
            Clear All
          </button>

          <button
            className="view-btn"
            onClick={() => navigate("/notifications")}
          >
            View All
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
