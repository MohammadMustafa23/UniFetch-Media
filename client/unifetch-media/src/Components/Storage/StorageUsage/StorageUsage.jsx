import "./StorageUsage.css";

export default function StorageUsage({ storage }) {
  const formatSize = (bytes = 0) => {
    if (!bytes) return "0 B";

    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  };

  const totalDisk = storage?.totalDisk || 50 * 1024 * 1024 * 1024;
  const usedStorage = storage?.usedStorage || 0;

  const totalPercentage = Math.min((usedStorage / totalDisk) * 100, 100);

  const storageItems = [
    {
      name: "Video files",
      value: storage?.videoSize || 0,
      color: "#5B8CFF",
    },
    {
      name: "Audio files",
      value: storage?.audioSize || 0,
      color: "#A78BFA",
    },
    {
      name: "Image files",
      value: storage?.imageSize || 0,
      color: "#F59E0B",
    },
    {
      name: "Cache",
      value: storage?.cacheSize || 0,
      color: "#34D399",
    },
  ];

  return (
    <section className="ufm-storage-card">
      <div className="ufm-storage-card-head">
        <h2>Space used</h2>

        <span>
          {formatSize(usedStorage)} of {formatSize(totalDisk)}
        </span>
      </div>

      <div className="ufm-storage-total">
        <div
          className="ufm-storage-total-fill"
          style={{
            width: `${totalPercentage}%`,
          }}
        />
      </div>

      <div className="ufm-storage-list">
        {storageItems.map((item) => {
          const percentage = totalDisk
            ? Math.min((item.value / totalDisk) * 100, 100)
            : 0;

          return (
            <div key={item.name} className="ufm-storage-item">
              <div className="ufm-storage-item-head">
                <span>{item.name}</span>

                <strong>{formatSize(item.value)}</strong>
              </div>

              <div className="ufm-storage-progress">
                <div
                  className="ufm-storage-progress-fill"
                  style={{
                    width: `${percentage}%`,
                    background: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
