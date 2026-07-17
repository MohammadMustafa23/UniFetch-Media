import { useState } from "react";

import "../Dashboard/style/Dashboard.css";
import "./Queue.css";

import Sidebar from "../Dashboard/Sidebar/Sidebar";
import Topbar from "../Dashboard/Topbar/Topbar";
import Footer from "../Dashboard/Footer/Footer";

import QueueHeader from "./QueueHeader/QueueHeader";
import QueueFilter from "./QueueFilter/QueueFilter";
import QueueList from "./QueueList/QueueList";

export default function QueuePage() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="ufm-dashboard">
      <Sidebar />

      <main className="ufm-dashboard-main">
        <Topbar />

        <div className="queue-page">
          <QueueHeader />

          <QueueFilter active={filter} setActive={setFilter} />

          <QueueList filter={filter} />
        </div>

        <Footer />
      </main>
    </div>
  );
}
