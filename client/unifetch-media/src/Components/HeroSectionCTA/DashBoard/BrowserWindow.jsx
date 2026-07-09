import "../style/DashboardShowcase.css";

export default function BrowserWindow({ children }) {
  return (
    <div className="browserWindow">
      {/* Browser Top Bar */}

      <div className="browserWindow__top">
        <div className="browserWindow__controls">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="browserWindow__address">
          app.unifetch.media/dashboard
        </div>
      </div>

      {/* Browser Body */}

      <div className="browserWindow__body">{children}</div>
    </div>
  );
}
