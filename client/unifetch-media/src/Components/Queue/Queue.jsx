import "../Dashboard/style/Dashboard.css";
import "./Queue.css";

import Sidebar from "../Dashboard/Sidebar/Sidebar";
import Topbar from "../Dashboard/Topbar/Topbar";
import Footer from "../Dashboard/Footer/Footer";

import QueueHeader from "./QueueHeader/QueueHeader";
import QueueList from "./QueueList/QueueList";


export default function QueuePage() {
  return (
    <div className="ufm-dashboard">
      <Sidebar />

      <main className="ufm-dashboard-main">
        {/* Top Bar */}
        <Topbar />

        {/* Queue Content */}
        <div className="queue-page">
          <QueueHeader />

          <QueueList />
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
