import { useState } from "react";

import Sidebar from "../Components/Dashboard/Sidebar/Sidebar";
import Topbar from "../Components/Dashboard/Topbar/Topbar";
import HeroDownload from "../Components/Dashboard/HeroDownload/HeroDownload";
import PreviewCard from "../Components/Dashboard/PreviewCard/PreviewCard";
import Stats from "../Components/Dashboard/Stats/Stats";
import Queue from "../Components/Dashboard/Queue/Queue";
import RecentDownloads from "../Components/Dashboard/RecentDownloads/RecentDownloads";
import DashboardAside from "../Components/Dashboard/Tips/DashboardAside";
import Footer from "../Components/Dashboard/Footer/Footer";
import PageLoader from "../common/PageLoader";

import "../Components/Dashboard/style/Dashboard.css";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    alert("Download Button Clicked");
    console.log("Download Started");
  };

  return (
    <div
      className={`ufm-dashboard ${collapsed ? "ufm-dashboard-collapse" : ""}`}
    >
      <Sidebar isCollapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="ufm-dashboard-main">
        <Topbar />

        <div className="ufm-dashboard-grid">
          <div className="ufm-dashboard-left">
            <HeroDownload setVideoInfo={setVideoInfo} setLoading={setLoading} />

            <Stats />
          </div>

          <aside className="ufm-dashboard-right">
            <DashboardAside />
          </aside>
        </div>

        <Queue />

        <RecentDownloads />

        <Footer />
      </main>

      {loading && (
        <div className="ufm-preview-overlay">
          <PageLoader
            title="Fetching Media..."
            subtitle="Analyzing URL and preparing download options..."
          />
        </div>
      )}

      {!loading && videoInfo && (
        <div className="ufm-dp-overlay">
          <PreviewCard
            videoInfo={videoInfo}
            onClose={() => setVideoInfo(null)}
            onDownload={handleDownload}
          />
        </div>
      )}
    </div>
  );
}
