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

export default function Analytics() {
  return (
    <div className="ufm-dashboard">
      <Sidebar />

      <main className="ufm-dashboard-main">
        <Topbar />

        <section className="analytics-page">
          <AnalyticsHeader />

          <div className="analytics-grid">
            <div className="analytics-left">
              <DownloadsChart />

              <PlatformUsage />
            </div>

            <div className="analytics-right">
              <FileDistribution />

              <ActivityTimeline />
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
