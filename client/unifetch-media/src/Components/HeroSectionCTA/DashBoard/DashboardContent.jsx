import { Play, Check } from "lucide-react";

export default function DashboardContent() {
  return (
    <div className="dashboardHome">
      {/* Left */}

      <div className="dashboardCard">
        <h3>Recent Activity</h3>

        <div className="activityList">
          <div className="activityItem">
            <span>React Crash Course.mp4</span>

            <span className="status success">
              <Check size={14} />
              Completed
            </span>
          </div>

          <div className="activityItem">
            <span>Node.js Podcast.mp3</span>

            <span className="status progress">62%</span>
          </div>

          <div className="activityItem">
            <span>Instagram Reel.mp4</span>

            <span className="status success">
              <Check size={14} />
              Completed
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

        <h4>React Crash Course</h4>

        <p>YouTube • 14:32 • 1080p</p>
      </div>

      {/* Right */}

      <div className="dashboardCard">
        <h3>This Week</h3>

        <div className="statsColumn">
          <div className="statBox">
            <h2>128</h2>
            <span>Downloads</span>
          </div>

          <div className="statBox">
            <h2>99.8%</h2>
            <span>Success Rate</span>
          </div>

          <div className="statBox">
            <h2>248 GB</h2>
            <span>Storage Used</span>
          </div>
        </div>
      </div>
    </div>
  );
}
