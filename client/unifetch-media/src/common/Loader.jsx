import "./Loader.css";

export default function Loader({
  text = "Loading...",
  fullScreen = true,
}) {
  return (
    <div className={fullScreen ? "loader-overlay" : "loader-container"}>
      <div className="loader">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <h2>UniFetch Media</h2>
      <p>{text}</p>
    </div>
  );
}