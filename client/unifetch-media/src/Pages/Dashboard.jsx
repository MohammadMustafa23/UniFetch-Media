import "../Components/Dashboard/style/Dashboard.css";

import Sidebar from "../Components/Dashboard/Sidebar/Sidebar";
import Topbar from "../Components/Dashboard/Topbar/Topbar";
import HeroDownload from "../Components/Dashboard/HeroDownload/HeroDownload";
import Stats from "../Components/Dashboard/Stats/Stats";
import Queue from "../Components/Dashboard/Queue/Queue";
import RecentDownloads from "../Components/Dashboard/RecentDownloads/RecentDownloads";
import DashboardAside from "../Components/Dashboard/Tips/DashboardAside";

export default function Dashboard() {
  return (
    <div className="ufm-dashboard">
      <Sidebar />

      <main className="ufm-dashboard-main">
        <Topbar />

        <div className="ufm-dashboard-grid">
          <div className="ufm-dashboard-left">
            <HeroDownload />

            <Stats />
          </div>

          <aside className="ufm-dashboard-right">
            <DashboardAside />
          </aside>
        </div>

        <Queue />

        <RecentDownloads />
      </main>
    </div>
  );
}
