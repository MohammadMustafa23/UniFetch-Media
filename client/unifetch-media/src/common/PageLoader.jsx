import "./PageLoader.css";

export default function PageLoader({
  title = "Please wait",
  message = "Processing your request...",
}) {
  return (
    <div className="uf-page-loader">
      <div className="uf-loader-card">
        <div className="uf-loader-logo">
          <div className="uf-ring ring-one"></div>
          <div className="uf-ring ring-two"></div>

          <div className="uf-center">UF</div>
        </div>

        <h3>{title}</h3>

        <p>{message}</p>

        <div className="uf-progress">
          <div className="uf-progress-bar"></div>
        </div>
      </div>
    </div>
  );
}
