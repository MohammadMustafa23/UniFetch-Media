import { Play, Check } from "lucide-react";

export default function DashboardContent() {
  return (
    <div className="dashboardHome">
      {/* Left */}

      <div className="dashboardCard">
        <h3>Recent Activity</h3>

        <div className="activityList">
          <div className="activityItem">
            <span>Launch_Trailer.mp4</span>

            <span className="status success">
              <Check size={14} />
              Done
            </span>
          </div>

          <div className="activityItem">
            <span>Podcast_Ep42.mp3</span>

            <span className="status progress">62%</span>
          </div>

          <div className="activityItem">
            <span>Studio_Session.mp4</span>

            <span className="status success">
              <Check size={14} />
              Done
            </span>
          </div>
        </div>
      </div>

      {/* Center */}

      <div className="dashboardCard">
        <h3>Now Previewing</h3>

        <div className="previewVideo">
          <button>
            <Play fill="white" size={20} />
          </button>
        </div>

        <h4>Behind the Scenes — Studio Cut</h4>

        <p>Creator Studio • 06:48</p>
      </div>

      {/* Right */}

      <div className="dashboardCard">
        <h3>This Week</h3>

        <div className="statsColumn">
          <div className="statBox">
            <h2>128</h2>
            <span>Files fetched</span>
          </div>

          <div className="statBox">
            <h2>99.8%</h2>
            <span>Success rate</span>
          </div>

          <div className="statBox">
            <h2>3</h2>
            <span>Devices active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
