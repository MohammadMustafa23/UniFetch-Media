import "./PageLoader.css";

export default function PageLoader({
  title = "Please wait",
  message = "Processing your request...",
}) {
  return (
    <div className="page-loader-overlay">
      <div className="page-loader-card">
        {/* Loader */}
        <div className="page-loader-icon">
          <div className="page-loader-spinner"></div>

          <div className="uf-center">UF</div>
        </div>

        {/* Content */}
        <div className="page-loader-content">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>

        {/* Progress */}
        <div className="uf-progress">
          <div className="uf-progress-bar"></div>
        </div>
      </div>
    </div>
  );
}
