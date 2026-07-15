import "./DownloadsGrid.css";

import PageLoader from "../../../common/PageLoader";
import DownloadCard from "../DownloadCard/DownloadCard";
import DownloadsEmpty from "../DownloadsEmpty/DownloadsEmpty";

export default function DownloadsGrid({ downloads, loading }) {
  if (loading) {
    return (
      <PageLoader
        title="Loading Downloads"
        message="Fetching your downloaded media library..."
      />
    );
  }

  if (!downloads.length) {
    return <DownloadsEmpty />;
  }

  return (
    <section className="downloads-grid">
      {downloads.map((download) => (
        <DownloadCard key={download._id} item={download} />
      ))}
    </section>
  );
}
