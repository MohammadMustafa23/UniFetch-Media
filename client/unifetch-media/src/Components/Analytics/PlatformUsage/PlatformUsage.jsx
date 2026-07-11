import "./PlatformUsage.css";

const platforms = [
  {
    name: "YouTube",
    percent: 68,
    color: "#5B8CFF",
  },
  {
    name: "Instagram",
    percent: 32,
    color: "#A78BFA",
  },
];

export default function PlatformUsage() {
  return (
    <section className="ufm-platform-usage">
      <h2>Platform usage</h2>

      <div className="ufm-platform-list">
        {platforms.map((item) => (
          <div key={item.name} className="ufm-platform-item">
            <div className="ufm-platform-head">
              <span>{item.name}</span>

              <strong>{item.percent}%</strong>
            </div>

            <div className="ufm-platform-progress">
              <div
                className="ufm-platform-fill"
                style={{
                  width: `${item.percent}%`,
                  background: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
