import "./style/AnalyticsSection.css";

const weekStats = [
  { value: "128", label: "Downloads" },
  { value: "99.8%", label: "Success Rate" },
  { value: "248 GB", label: "Storage Used" },
];

const chartData = [35, 58, 46, 72, 90, 62, 76];

const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function AnalyticsSection() {
  return (
    <section className="analyticsSection">
      <div className="analyticsSection__container">
        {/* Header */}

        <div className="analyticsSection__header">
          <div className="platformSection__label">
            <span className="uf-section-line"></span>
            <p>ANALYTICS</p>
          </div>

          <h2 className="analyticsSection__title">
            Track your download activity
          </h2>
        </div>

        {/* Grid */}

        <div className="analyticsSection__grid">
          {/* Left Card */}

          <div className="analyticsCard analyticsCard--large">
            <h3>Weekly Overview</h3>

            <p className="analyticsCard__desc">
              View your downloads, success rate, and storage usage.
            </p>

            <div className="analyticsStats">
              {weekStats.map((item) => (
                <div className="analyticsStat" key={item.label}>
                  <h4>{item.value}</h4>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Chart */}

            <div className="analyticsChart">
              {chartData.map((height, index) => (
                <div className="analyticsChart__item" key={index}>
                  <div
                    className="analyticsChart__bar"
                    style={{
                      height: `${height}%`,
                    }}
                  ></div>

                  <span>{days[index]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card */}

          <div className="analyticsCard analyticsCard--small">
            <h3>Download Formats</h3>

            <div className="analyticsDonut">
              <div className="analyticsDonut__inner">
                <h2>72%</h2>
              </div>
            </div>

            <div className="analyticsLegend">
              <div>
                <span className="blue"></span>
                MP4 • 72%
              </div>

              <div>
                <span className="gray"></span>
                MP3 • 28%
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
