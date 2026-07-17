import { useEffect, useState } from "react";
import "./HistoryList.css";

import HistoryCard from "../HistoryCard/HistoryCard";
import HistoryEmpty from "../HistoryEmpty/HistoryEmpty";
import PageLoader from "../../../common/PageLoader";

import { getHistory } from "../../../service/history.service";

export default function HistoryList({ filter }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  async function fetchHistory() {
    try {
      setLoading(true);

      const { data } = await getHistory(filter);

      console.log(data.data);
      
      setHistory(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  if (!history.length) {
    return <HistoryEmpty />;
  }

  return (
    <section className="history-list">
      {history.map((item) => (
        <HistoryCard key={item._id} item={item} />
      ))}
    </section>
  );
}