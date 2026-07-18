import "./FileDistribution.css";

const colors = [
  "#5B8CFF",
  "#A78BFA",
  "#34D399",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
];

const formatNames = {
  mp4: "Video (MP4)",
  mp3: "Audio (MP3)",
  webm: "Video (WEBM)",
  mkv: "Video (MKV)",
  mov: "Video (MOV)",
  jpg: "Image (JPG)",
  jpeg: "Image (JPEG)",
  png: "Image (PNG)",
  gif: "Image (GIF)",
};

export default function FileDistribution({ analytics }) {
  const files = analytics?.fileTypeDistribution || [];
  const total = analytics?.totalDownloads || 0;

  return (
    <section className="ufm-file-distribution">
      <h2>File Type Distribution</h2>

      <div className="ufm-file-list">
        {files.length === 0 ? (
          <p>No file data available.</p>
        ) : (
          files.map((item, index) => {
            const percent =
              total === 0 ? 0 : Math.round((item.total / total) * 100);

            return (
              <div key={item._id} className="ufm-file-item">
                <div className="ufm-file-head">
                  <span>
                    {formatNames[item._id?.toLowerCase()] ||
                      item._id?.toUpperCase()}
                  </span>

                  <strong>{percent}%</strong>
                </div>

                <div className="ufm-file-progress">
                  <div
                    className="ufm-file-fill"
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
