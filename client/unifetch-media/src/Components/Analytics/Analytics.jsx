import "../Dashboard/style/Dashboard.css";
import "./Analytics.css";

/* ==========================================
   DASHBOARD
========================================== */

import Sidebar from "../../Components/Dashboard/Sidebar/Sidebar";
import Topbar from "../../Components/Dashboard/Topbar/Topbar";
import Footer from "../../Components/Dashboard/Footer/Footer";

/* ==========================================
   COMPONENTS
========================================== */

import AnalyticsHeader from "./AnalyticsHeader/AnalyticsHeader";
import DownloadsChart from "./DownloadsChart/DownloadsChart";
import FileDistribution from "./FileDistribution/FileDistribution";
import PlatformUsage from "./PlatformUsage/PlatformUsage";
import ActivityTimeline from "./ActivityTimeline/ActivityTimeline";

import { useEffect, useState } from "react";
import { getDashboardAnalytics } from "../../service/analytics.service.js";
import PageLoader from "../../common/PageLoader.jsx";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getDashboardAnalytics();
        setAnalytics(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);


  if (loading) {
    return (
      <PageLoader
        title="Loading Analytics"
        message="Preparing your dashboard..."
      />
    );
  }
  return (
    <div className="ufm-dashboard">
      <Sidebar />

      <main className="ufm-dashboard-main">
        <Topbar />

        <section className="analytics-page">
          <AnalyticsHeader />

          <div className="analytics-grid">
            <div className="analytics-left">
             <DownloadsChart analytics={analytics} />

              <PlatformUsage analytics={analytics} />
            </div>

            <div className="analytics-right">
              <FileDistribution analytics={analytics} />

              <ActivityTimeline  analytics={analytics} />
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
