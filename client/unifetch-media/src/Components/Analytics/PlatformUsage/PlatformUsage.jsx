import "./PlatformUsage.css";

const colors = [
  "#5B8CFF",
  "#A78BFA",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
];

export default function PlatformUsage({ analytics }) {
  const platforms = analytics?.platformUsage || [];
  const total = analytics?.totalDownloads || 0;

  return (
    <section className="ufm-platform-usage">
      <h2>Platform Usage</h2>

      <div className="ufm-platform-list">
        {platforms.length === 0 ? (
          <p>No platform data available.</p>
        ) : (
          platforms.map((item, index) => {
            const percent =
              total === 0 ? 0 : Math.round((item.total / total) * 100);

            return (
              <div key={item._id} className="ufm-platform-item">
                <div className="ufm-platform-head">
                  <span>
                    {item._id.charAt(0).toUpperCase() + item._id.slice(1)}
                  </span>

                  <strong>{percent}%</strong>
                </div>

                <div className="ufm-platform-progress">
                  <div
                    className="ufm-platform-fill"
                    style={{
                      width: `${percent}%`,
                      background: colors[index % colors.length],
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
