import "./Loader.css";

export default function Loader({
  text = "Preparing Workspace...",
  fullScreen = true,
}) {
  return (
    <div className={fullScreen ? "ufm-loader-overlay" : "ufm-loader"}>
      <div className="ufm-loader-container">
        {/* Orbit Loader */}
        <div className="ufm-loader-orbit">
          <span className="ufm-dot dot-1"></span>
          <span className="ufm-dot dot-2"></span>
          <span className="ufm-dot dot-3"></span>
          <span className="ufm-dot dot-4"></span>

          <div className="ufm-loader-core">
            <span>UF</span>
          </div>
        </div>

        <h3 className="ufm-loader-title">UniFetch Media</h3>

        <p className="ufm-loader-text">{text}</p>
      </div>
    </div>
  );
}
