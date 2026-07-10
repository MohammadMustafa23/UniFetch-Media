import { useState } from "react";
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
  { icon: <LayoutDashboard size={20} />, title: "Dashboard", active: true },
  { icon: <Download size={20} />, title: "Downloads" },
  { icon: <ListTodo size={20} />, title: "Queue" },
  { icon: <History size={20} />, title: "History" },
  { icon: <Heart size={20} />, title: "Favorites" },
  { icon: <BarChart3 size={20} />, title: "Analytics" },
  { icon: <HardDrive size={20} />, title: "Storage" },
  { icon: <Bot size={20} />, title: "Automation" },
  { icon: <Settings size={20} />, title: "Settings" },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogoClick = () => {
    // Don't collapse on mobile
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
        ${mobileOpen ? "ufm-sidebar-open" : ""}`}
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

          <div className="ufm-sidebar-logo-content">
            <h2>UniFetch</h2>
            <span>MEDIA</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="ufm-sidebar-nav">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`ufm-sidebar-item ${
                item.active ? "ufm-sidebar-item-active" : ""
              }`}
            >
              <span className="ufm-sidebar-icon">{item.icon}</span>

              <span className="ufm-sidebar-title">{item.title}</span>
            </button>
          ))}
        </nav>

        {/* Storage */}
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

        {/* User */}
        <div className="ufm-sidebar-user">
          <div className="ufm-sidebar-avatar">M</div>

          <div className="ufm-sidebar-user-info">
            <h4>Mohammad</h4>
            <span>Premium Plan</span>
          </div>

          <button className="ufm-sidebar-logout">
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}
