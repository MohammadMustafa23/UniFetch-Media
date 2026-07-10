import "../Components/Dashboard/style/Dashboard.css";

import Sidebar from "../Components/Dashboard/Sidebar/Sidebar";
import Topbar from "../Components/Dashboard/Topbar/Topbar";
import HeroDownload from "../Components/Dashboard/HeroDownload/HeroDownload";

export default function Dashboard() {
  return (
    <div className="ufm-dashboard">
      <Sidebar />

      <main className="ufm-dashboard-main">
       <Topbar/>

        <HeroDownload/>

        {/* Stats */}

        {/* Quick Actions */}

        {/* Queue */}

        {/* Tips */}

        {/* Recent Downloads */}
      </main>
    </div>
  );
}
