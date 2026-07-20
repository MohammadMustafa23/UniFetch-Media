import "./NotificationDropdown.css";

import { Bell, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

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

export default function NotificationDropdown({ notifications }) {
  const unread = notifications.filter((item) => !item.isRead).length;

  return (
    <div className="ufm-notification-dropdown">
      {/* Header */}

      <div className="ufm-notification-header">
        <div>
          <h3>Notifications</h3>

          <span>{unread} unread</span>
        </div>
      </div>

      {/* Body */}

      {notifications.length === 0 ? (
        <div className="ufm-notification-empty">
          <Bell size={46} />

          <h4>No Notifications</h4>

          <p>You're all caught up.</p>
        </div>
      ) : (
        <div className="ufm-notification-body">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`ufm-notification-card ${
                !notification.isRead ? "unread" : ""
              }`}
            >
              <div className="ufm-notification-icon">
                {notification.type === "success" ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <XCircle size={20} />
                )}
              </div>

              <div className="ufm-notification-info">
                <h4>{notification.title}</h4>

                <p>{notification.message}</p>

                <small>{timeAgo(notification.createdAt)}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}

      <div className="ufm-notification-footer">
        <button>
          View All
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
