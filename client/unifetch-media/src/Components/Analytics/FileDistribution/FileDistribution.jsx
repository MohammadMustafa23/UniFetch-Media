import "./FileDistribution.css";

const fileTypes = [
  {
    name: "Video (MP4)",
    percent: 64,
    color: "#5B8CFF",
  },
  {
    name: "Audio (MP3)",
    percent: 28,
    color: "#A78BFA",
  },
  {
    name: "Images / Other",
    percent: 8,
    color: "#34D399",
  },
];

export default function FileDistribution() {
  return (
    <section className="ufm-file-distribution">
      <h2>File type distribution</h2>

      <div className="ufm-file-list">
        {fileTypes.map((item) => (
          <div key={item.name} className="ufm-file-item">
            <div className="ufm-file-head">
              <span>{item.name}</span>

              <strong>{item.percent}%</strong>
            </div>

            <div className="ufm-file-progress">
              <div
                className="ufm-file-fill"
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
