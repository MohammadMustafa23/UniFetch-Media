import "./Loader.css";

export default function Loader({
  text = "Preparing your workspace...",
  fullScreen = true,
}) {
  return (
    <div className={fullScreen ? "ufm-loader-overlay" : "ufm-loader"}>
      <div className="ufm-loader-card">
        {/* Animated Logo */}
        <div className="ufm-logo">
          <div className="ufm-ring ring-1"></div>
          <div className="ufm-ring ring-2"></div>

          <div className="ufm-center">
            <span>UF</span>
          </div>
        </div>

        {/* Brand */}
        <h2 className="ufm-brand">
          UniFetch <span>Media</span>
        </h2>

        {/* Status */}
        <p className="ufm-status">{text}</p>

        {/* Progress */}
        <div className="ufm-progress">
          <div className="ufm-progress-fill"></div>
        </div>

        {/* Loading Dots */}
        <div className="ufm-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
