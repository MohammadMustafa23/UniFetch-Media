import { useEffect, useState } from "react";

import "../Dashboard/style/Dashboard.css";
import "./Downloads.css";

import Sidebar from "../Dashboard/Sidebar/Sidebar";
import Topbar from "../Dashboard/Topbar/Topbar";
import Footer from "../Dashboard/Footer/Footer";

import DownloadsHeader from "./DownloadsHeader/DownloadsHeader";
import DownloadsToolbar from "./DownloadsToolbar/DownloadsToolbar";
import DownloadsGrid from "./DownloadsGrid/DownloadsGrid";

import { getDownloads } from "../../service/download.service.js";

export default function Downloads() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloads();
  }, []);

  async function fetchDownloads() {
    try {
      const response = await getDownloads();
      console.log(response);
      
      setDownloads(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ufm-dashboard">
      <Sidebar />

      <main className="ufm-dashboard-main">
        <Topbar />

        <section className="downloads-page">
          <DownloadsHeader />

          <DownloadsToolbar />

          <DownloadsGrid downloads={downloads} loading={loading} />
        </section>

        <Footer />
      </main>
    </div>
  );
}
