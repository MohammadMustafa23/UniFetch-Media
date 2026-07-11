import "../Dashboard/style/Dashboard.css";
import "./Storage.css";

/* ==========================================
   DASHBOARD
========================================== */

import Sidebar from "../../Components/Dashboard/Sidebar/Sidebar";
import Topbar from "../../Components/Dashboard/Topbar/Topbar";
import Footer from "../../Components/Dashboard/Footer/Footer";

/* ==========================================
   STORAGE
========================================== */

import StorageHeader from "./StorageHeader/StorageHeader";
import StorageUsage from "./StorageUsage/StorageUsage";
import CleanupShortcuts from "./CleanupShortcuts/CleanupShortcuts";

export default function Storage() {
  return (
    <div className="ufm-dashboard">
      <Sidebar />

      <main className="ufm-dashboard-main">
        <Topbar />

        <section className="storage-page">
          <StorageHeader />

          <div className="storage-grid">
            <StorageUsage />

            <CleanupShortcuts />
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
