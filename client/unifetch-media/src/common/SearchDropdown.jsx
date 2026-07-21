import "./SearchDropdown.css";
import { Download, History, PlaySquareIcon, CameraIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchDropdown({ results, loading, query, onClose }) {
  const navigate = useNavigate();

  if (!query) return null;

  if (loading) {
    return (
      <div className="ufm-search-dropdown">
        <div className="ufm-search-loading">Searching...</div>
      </div>
    );
  }

  const { downloads, history } = results;

  if (downloads.length === 0 && history.length === 0) {
    return (
      <div className="ufm-search-dropdown">
        <div className="ufm-search-empty">No results found.</div>
      </div>
    );
  }

  return (
    <div className="ufm-search-dropdown">
      {downloads.length > 0 && (
        <>
          <div className="ufm-search-title">Downloads</div>

          {downloads.map((item) => (
            <div
              key={item._id}
              className="ufm-search-item"
              onClick={() => navigate(`/downloads?id=${item._id}`)}
            >
              <Download size={18} />

              <div className="ufm-search-info">
                <h4>{item.title}</h4>

                <span>
                  {item.platform === "youtube" ? (
                    <PlaySquareIcon size={14} />
                  ) : (
                    <CameraIcon size={14} />
                  )}

                  {item.platform}
                </span>
              </div>
            </div>
          ))}
        </>
      )}

      {history.length > 0 && (
        <>
          <div className="ufm-search-title">History</div>

          {history.map((item) => (
            <div
              key={item._id}
              className="ufm-search-item"
              onClick={() => navigate(`/history?id=${item._id}`)}
            >
              <History size={18} />

              <div className="ufm-search-info">
                <h4>{item.title}</h4>

                <span>
                  {item.platform === "youtube" ? (
                    <PlaySquareIcon size={14} />
                  ) : (
                    <CameraIcon size={14} />
                  )}

                  {item.platform}
                </span>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
