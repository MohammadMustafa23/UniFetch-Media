import './PageLoader.css'
export default function PageLoader({
  title = "Please wait",
  message = "Processing your request...",
}) {
  return (
    <div className="uf-loader-overlay">
      <div className="uf-loader-card">
        <div className="uf-loader-spinner">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <h3>{title}</h3>
        <p>{message}</p>
      </div>
    </div>
  );
}
