import "../Dashboard/style/Dashboard.css";
import "./History.css";
import { useState } from "react";

import Sidebar from "../Dashboard/Sidebar/Sidebar";
import Topbar from "../Dashboard/Topbar/Topbar";
import Footer from "../Dashboard/Footer/Footer";

import HistoryHeader from "./HistoryHeader/HistoryHeader";
import HistoryFilter from "./HistoryFilter/HistoryFilter";
import HistoryList from "./HistoryList/HistoryList";

export default function History({ collapsed, setCollapsed, userName }) {
  const [filter, setFilter] = useState("All");
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
        {/* Topbar */}
        <Topbar />

        {/* History Page */}
        <section className="history-page">
          {/* Page Header */}
          <HistoryHeader />

          {/* Filter Buttons */}
          <HistoryFilter active={filter} setActive={setFilter} />

          {/* History List */}
          <HistoryList filter={filter} />

          {/* Empty State */}
          {/* <HistoryEmpty /> */}
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
