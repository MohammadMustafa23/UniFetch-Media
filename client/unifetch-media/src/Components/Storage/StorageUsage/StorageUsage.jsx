import "./StorageUsage.css";

const storageItems = [
  {
    name: "Video files",
    value: "12.4 GB",
    progress: 68,
    color: "#5B8CFF",
  },
  {
    name: "Audio files",
    value: "3.9 GB",
    progress: 22,
    color: "#A78BFA",
  },
  {
    name: "Cache",
    value: "0.0 GB",
    progress: 0,
    color: "#34D399",
  },
];

export default function StorageUsage() {
  return (
    <section className="ufm-storage-card">
      <div className="ufm-storage-card-head">
        <h2>Space used</h2>

        <span>16.3 GB of 50 GB</span>
      </div>

      <div className="ufm-storage-total">
        <div className="ufm-storage-total-fill" style={{ width: "33%" }} />
      </div>

      <div className="ufm-storage-list">
        {storageItems.map((item) => (
          <div key={item.name} className="ufm-storage-item">
            <div className="ufm-storage-item-head">
              <span>{item.name}</span>

              <strong>{item.value}</strong>
            </div>

            <div className="ufm-storage-progress">
              <div
                className="ufm-storage-progress-fill"
                style={{
                  width: `${item.progress}%`,
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
