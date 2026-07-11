import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

import {
  LayoutDashboard,
  Download,
  ListTodo,
  History,
  Heart,
  BarChart3,
  HardDrive,
  Bot,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  {
    icon: <LayoutDashboard size={20} />,
    title: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <Download size={20} />,
    title: "Downloads",
    path: "/downloads",
  },
  {
    icon: <ListTodo size={20} />,
    title: "Queue",
    path: "/queue",
  },
  {
    icon: <History size={20} />,
    title: "History",
    path: "/history",
  },
  {
    icon: <Heart size={20} />,
    title: "Favorites",
    path: "/favorites",
  },
  {
    icon: <BarChart3 size={20} />,
    title: "Analytics",
    path: "/analytics",
  },
  {
    icon: <HardDrive size={20} />,
    title: "Storage",
    path: "/storage",
  },
  {
    icon: <Settings size={20} />,
    title: "Profile & Settings",
    path: "/settings",
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogoClick = () => {
    if (window.innerWidth <= 768) return;

    setIsCollapsed((prev) => !prev);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="ufm-sidebar-toggle"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      <div
        className={`ufm-sidebar-overlay ${
          mobileOpen ? "ufm-sidebar-overlay-show" : ""
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`ufm-sidebar
          ${isCollapsed ? "ufm-sidebar-collapse" : ""}
          ${mobileOpen ? "ufm-sidebar-open" : ""}
        `}
      >
        {/* Mobile Close */}
        <button
          className="ufm-sidebar-close"
          onClick={() => setMobileOpen(false)}
        >
          <X size={22} />
        </button>

        {/* Logo */}
        <div className="ufm-sidebar-logo" onClick={handleLogoClick}>
          <div className="ufm-sidebar-logo-icon">U</div>

          {!isCollapsed && (
            <div className="ufm-sidebar-logo-content">
              <h2>UniFetch</h2>
              <span>MEDIA</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="ufm-sidebar-nav">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `ufm-sidebar-item ${isActive ? "ufm-sidebar-item-active" : ""}`
              }
            >
              <span className="ufm-sidebar-icon">{item.icon}</span>

              {!isCollapsed && (
                <span className="ufm-sidebar-title">{item.title}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Storage */}
        {!isCollapsed && (
          <div className="ufm-sidebar-storage">
            <div className="ufm-sidebar-storage-head">
              <h4>Storage</h4>
              <span>68%</span>
            </div>

            <div className="ufm-sidebar-progress">
              <div className="ufm-sidebar-progress-fill"></div>
            </div>

            <p>42 GB of 64 GB Used</p>
          </div>
        )}

        {/* User */}
        <div className="ufm-sidebar-user">
          <div className="ufm-sidebar-avatar">M</div>

          {!isCollapsed && (
            <div className="ufm-sidebar-user-info">
              <h4>Mohammad</h4>
              <span>Premium Plan</span>
            </div>
          )}

          <button className="ufm-sidebar-logout">
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}
