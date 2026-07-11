import "../Dashboard/style/Dashboard.css";
import "./Downloads.css";

import Sidebar from "../Dashboard/Sidebar/Sidebar";
import Topbar from "../Dashboard/Topbar/Topbar";
import Footer from "../Dashboard/Footer/Footer";

import DownloadsHeader from "./DownloadsHeader/DownloadsHeader";
import DownloadsToolbar from "./DownloadsToolbar/DownloadsToolbar";
import DownloadsGrid from "./DownloadsGrid/DownloadsGrid";

// import { useGSAP } from "@gsap/react";
// import DownloadsAnimation from "../../Animation/DownloadsAnimation";

export default function Downloads() {
  // useGSAP(() => {
  //   return DownloadsAnimation();
  // });

  return (
    <div className="ufm-dashboard">
      <Sidebar />

      <main className="ufm-dashboard-main">
        <Topbar />

        <section className="downloads-page">
          <DownloadsHeader />

          <DownloadsToolbar />

          <DownloadsGrid />
        </section>

        <Footer />
      </main>
    </div>
  );
}
