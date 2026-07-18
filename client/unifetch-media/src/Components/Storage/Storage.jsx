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

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getStorage } from "../../service/storage.service.js";

import PageLoader from "../../common/PageLoader.jsx";

export default function Storage() {
  const [storage, setStorage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStorage = async () => {
    try {
      const { data } = await getStorage();

      setStorage(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load storage.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorage();
  }, []);

  if (loading) {
    return (
      <PageLoader
        title="Loading Storage"
        message="Calculating your storage usage..."
      />
    );
  }

  return (
    <div className="ufm-dashboard">
      <Sidebar />

      <main className="ufm-dashboard-main">
        <Topbar />

        <section className="storage-page">
          <StorageHeader />

          <div className="storage-grid">
            <StorageUsage storage={storage} />
            <CleanupShortcuts storage={storage} refreshStorage={fetchStorage} />
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
