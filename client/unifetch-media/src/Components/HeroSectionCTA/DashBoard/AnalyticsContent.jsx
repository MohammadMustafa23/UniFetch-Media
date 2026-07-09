import { TrendingUp, Download, Clock3, HardDrive } from "lucide-react";

const platforms = [
  { name: "YouTube", value: 72 },
  { name: "Instagram", value: 28 },
];

const activity = [35, 52, 48, 68, 72, 84, 62];

export default function AnalyticsContent() {
  return (
    <div className="analyticsContent">
      {/* Top Stats */}

      <div className="analyticsStats">
        <div className="analyticsStatCard">
          <Download size={20} />
          <h2>1,284</h2>
          <span>Total Downloads</span>
        </div>

        <div className="analyticsStatCard">
          <TrendingUp size={20} />
          <h2>98.7%</h2>
          <span>Success Rate</span>
        </div>

        <div className="analyticsStatCard">
          <Clock3 size={20} />
          <h2>2m 14s</h2>
          <span>Average Time</span>
        </div>

        <div className="analyticsStatCard">
          <HardDrive size={20} />
          <h2>248 GB</h2>
          <span>Data Downloaded</span>
        </div>
      </div>

      {/* Bottom */}

      <div className="analyticsGrid">
        {/* Activity */}

        <div className="analyticsCard">
          <h3>Weekly Activity</h3>

          <div className="activityChart">
            {activity.map((value, index) => (
              <div className="activityBar" key={index}>
                <div
                  className="activityFill"
                  style={{
                    height: `${value}%`,
                    animationDelay: `${index * 0.08}s`,
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform */}

        <div className="analyticsCard">
          <h3>Platform Usage</h3>

          {platforms.map((item) => (
            <div className="platformUsage" key={item.name}>
              <div className="platformTop">
                <span>{item.name}</span>

                <strong>{item.value}%</strong>
              </div>

              <div className="platformTrack">
                <div
                  className="platformFill"
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
