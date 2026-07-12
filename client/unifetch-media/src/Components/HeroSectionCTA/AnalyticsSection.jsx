import "./style/AnalyticsSection.css";

const weekStats = [
  { value: "128", label: "Files this week" },
  { value: "99.8", label: "% completed" },
  { value: "3", label: "Active devices" },
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
            Know what you've downloaded, and when
          </h2>
        </div>

        {/* Grid */}

        <div className="analyticsSection__grid">
          {/* Left Card */}

          <div className="analyticsCard analyticsCard--large">
            <h3>Your week in downloads</h3>

            <p className="analyticsCard__desc">
              A weekly view of your queue — what came in, how much landed
              successfully, and where your habits cluster.
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
            <h3>Format breakdown</h3>

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
