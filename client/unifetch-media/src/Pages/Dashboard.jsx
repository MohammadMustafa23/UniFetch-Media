import { useState, useEffect } from "react";

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
import { getPreferences } from "../service/preferences.service.js";
import { getDashboard } from "../service/analytics.service.js";

export default function Dashboard({ collapsed, setCollapsed,userName }) {
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [preference, setPreference] = useState(null);

  const [dashboard, setDashboard] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const handleDownload = async ({ quality, type }) => {
    try {
      const selectedVideo = videoInfo.downloads?.video?.find(
        (item) => item.quality === quality,
      );

      const selectedAudio = videoInfo.downloads?.audio?.[0];

      const response = await startDownload({
        videoId: videoInfo.id ?? videoInfo.videoId,
        title: videoInfo.title,
        thumbnail: videoInfo.thumbnail,
        platform: videoInfo.platform,
        duration: videoInfo.duration,
        url: videoInfo.url,

        // 👇 IMPORTANT
        mediaType: type,

        quality,
        format: type === "video" ? "mp4" : "mp3",

        fileSize:
          type === "video"
            ? selectedVideo?.fileSize?.bytes || videoInfo.fileSize?.bytes || 0
            : selectedAudio?.fileSize?.bytes || 0,
      });

      toast.success(response.data.message);

      // Close Preview
      setVideoInfo(null);

      // Clear Input
      setUrl("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Download failed");
    }
  };

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const { data } = await getPreferences();
        if (data.success) {
          setPreference(data.data);
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      }
    };
    loadPreferences();
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await getDashboard();
        if (data.success) {
          setDashboard(data.data);
        }
      } catch (error) {
        toast.error("Failed to load dashboard");
      } finally {
        setDashboardLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <div
      className={`ufm-dashboard ${collapsed ? "ufm-dashboard-collapse" : ""}`}
    >
      {/* Dashboard Loader */}
      {dashboardLoading && (
        <PageLoader
          title="Loading Dashboard..."
          message="Fetching your latest downloads..."
        />
      )}

      <Sidebar
        isCollapsed={collapsed}
        setCollapsed={setCollapsed}
        userName={userName}
      />

      <main className="ufm-dashboard-main">
        <Topbar />

        {!dashboardLoading && (
          <>
            <div className="ufm-dashboard-grid">
              <div className="ufm-dashboard-left">
                <HeroDownload
                  setVideoInfo={setVideoInfo}
                  setLoading={setLoading}
                  url={url}
                  setUrl={setUrl}
                  preference={preference}
                />

                <Stats stats={dashboard.stats} />
              </div>

              <aside className="ufm-dashboard-right">
                <DashboardAside
                  today={dashboard.today}
                  latestUpdates={dashboard.latestUpdates}
                />
              </aside>
            </div>

            <Queue queue={dashboard.liveQueue} />

            <RecentDownloads downloads={dashboard.recentDownloads} />

            <Footer />
          </>
        )}
      </main>

      {/* Media Fetch Loader */}
      {loading && (
        <div className="ufm-preview-overlay">
          <PageLoader
            title="Fetching Media..."
            message="Analyzing URL and preparing download options..."
          />
        </div>
      )}

      {/* Preview */}
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
