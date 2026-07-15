import "../Dashboard/style/Dashboard.css";
import "./History.css";

import Sidebar from "../Dashboard/Sidebar/Sidebar";
import Topbar from "../Dashboard/Topbar/Topbar";
import Footer from "../Dashboard/Footer/Footer";

import HistoryHeader from "./HistoryHeader/HistoryHeader";
import HistoryFilter from "./HistoryFilter/HistoryFilter";
import HistoryList from "./HistoryList/HistoryList";


export default function History() {
  return (
    <div className="ufm-dashboard">
      <Sidebar />

      <main className="ufm-dashboard-main">
        {/* Topbar */}
        <Topbar />

        {/* History Page */}
        <section className="history-page">
          {/* Page Header */}
          <HistoryHeader />

          {/* Filter Buttons */}
          <HistoryFilter />

          {/* History List */}
          <HistoryList />

          {/* Empty State */}
          {/* <HistoryEmpty /> */}
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
