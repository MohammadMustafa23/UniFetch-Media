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
import { startDownload } from "../service/download.service";
import "../Components/Dashboard/style/Dashboard.css";
import { toast } from "sonner";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDownload = async ({ quality, type }) => {
    try {
      console.log(videoInfo.url,quality,type);
      
      const response = await startDownload({
        title : videoInfo.title,
        thumbnail : videoInfo.thumbnail,
        platform : videoInfo.platform,
        duration : videoInfo.duration,
        url: videoInfo.url,
        quality,
        format: type === "video" ? "mp4" : "mp3",
      });

      toast.success(response.data.message);

      console.log(response.data);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Download failed");
    }
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
        <div className="ufm-preview-overlay">
          <div className="ufm-dp-overlay">
            <PreviewCard
              videoInfo={videoInfo}
              onClose={() => setVideoInfo(null)}
              onDownload={handleDownload}
            />
          </div>
        </div>
      )}
    </div>
  );
}
