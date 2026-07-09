import { useState } from "react";

import "../style/DashboardShowcase.css";

import BrowserWindow from "./BrowserWindow";

import DashboardContent from "./DashboardContent";
import QueueContent from "./QueueContent";
import HistoryContent from "./HistoryContent";
import AnalyticsContent from "./AnalyticsContent";
import SettingsContent from "./SettingsContent";

const tabs = [
  {
    id: "dashboard",
    label: "Dashboard",
  },
  {
    id: "queue",
    label: "Queue",
  },
  {
    id: "history",
    label: "History",
  },
  {
    id: "analytics",
    label: "Analytics",
  },
  {
    id: "settings",
    label: "Settings",
  },
];

export default function DashboardShowcase() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "queue":
        return <QueueContent />;

      case "history":
        return <HistoryContent />;

      case "analytics":
        return <AnalyticsContent />;

      case "settings":
        return <SettingsContent />;

      default:
        return <DashboardContent />;
    }
  };

  return (
    <section className="dashboardShowcase">
      <div className="dashboardShowcase__container">
        {/* Header */}

        <div className="dashboardShowcase__header">
          <div className="dashboardShowcase__label">
            <span></span>
            <p>PRODUCT</p>
          </div>

          <h2 className="dashboardShowcase__title">
            One dashboard, every workflow
          </h2>

          <p className="dashboardShowcase__subtitle">
            Explore the screens that make up UniFetch Media — from your live
            download queue to analytics and history.
          </p>
        </div>

        {/* Tabs */}

        <div className="dashboardTabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`dashboardTab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Browser */}

        <BrowserWindow>
          <div key={activeTab} className="dashboardContentAnimation">
            {renderContent()}
          </div>
        </BrowserWindow>
      </div>
    </section>
  );
}
