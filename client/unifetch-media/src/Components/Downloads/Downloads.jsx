import { useEffect, useState } from "react";

import "../Dashboard/style/Dashboard.css";
import "./Downloads.css";

import Sidebar from "../Dashboard/Sidebar/Sidebar";
import Topbar from "../Dashboard/Topbar/Topbar";
import Footer from "../Dashboard/Footer/Footer";
import { toast } from "sonner";

import DownloadsHeader from "./DownloadsHeader/DownloadsHeader";
import DownloadsToolbar from "./DownloadsToolbar/DownloadsToolbar";
import DownloadsGrid from "./DownloadsGrid/DownloadsGrid";

import { getDownloads } from "../../service/download.service.js";

export default function Downloads({ collapsed, setCollapsed, userName }) {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filteredDownloads, setFilteredDownloads] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchDownloads();
  }, []);

  async function fetchDownloads() {
    try {
      const response = await getDownloads();
      setDownloads(response.data.data);
      setFilteredDownloads(response.data.data);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let data = [...downloads];

    // Search
    if (search.trim()) {
      data = data.filter((item) =>
        item.title?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Filter
    if (filter !== "all") {
      data = data.filter((item) => item.format === filter);
    }

    setFilteredDownloads(data);
  }, [search, filter, downloads]);

  return (
    <div
      className={`ufm-dashboard ${collapsed ? "ufm-dashboard-collapse" : ""}`}
    >
      <Sidebar
        isCollapsed={collapsed}
        setCollapsed={setCollapsed}
        userName={userName}
      />

      <main className="ufm-dashboard-main">
        <Topbar />

        <section className="downloads-page">
          <DownloadsHeader />

          <DownloadsToolbar
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
          />

          <DownloadsGrid
            downloads={filteredDownloads}
            setDownloads={setDownloads}
            loading={loading}
            fetchDownloads={fetchDownloads}
          />
        </section>

        <Footer />
      </main>
    </div>
  );
}
