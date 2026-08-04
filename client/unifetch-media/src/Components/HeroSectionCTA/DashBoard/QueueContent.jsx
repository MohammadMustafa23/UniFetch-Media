import { Pause, Play, CheckCircle2, Clock3 } from "lucide-react";

const downloads = [
  {
    name: "React Crash Course.mp4",
    progress: 82,
    speed: "18.2 MB/s",
    eta: "12s",
    status: "Downloading",
  },
  {
    name: "Node.js Podcast.mp3",
    progress: 56,
    speed: "7.6 MB/s",
    eta: "34s",
    status: "Downloading",
  },
  {
    name: "JavaScript Tutorial.mp4",
    progress: 100,
    speed: "--",
    eta: "Completed",
    status: "Done",
  },
];

export default function QueueContent() {
  return (
    <div className="queueContent">
      {/* Header */}

      <div className="queueHeader">
        <div>
          <h2>Download Queue</h2>
          <p>Manage your active downloads</p>
        </div>

        <button className="queueAction">
          <Pause size={18} />
          Pause All
        </button>
      </div>

      {/* List */}

      <div className="queueList">
        {downloads.map((item) => (
          <div className="queueItem" key={item.name}>
            <div className="queueTop">
              <div>
                <h4>{item.name}</h4>

                <span>{item.speed}</span>
              </div>

              <div className="queueStatus">
                {item.status === "Done" ? (
                  <>
                    <CheckCircle2 size={16} />
                    Completed
                  </>
                ) : (
                  <>
                    <Clock3 size={16} />
                    {item.eta}
                  </>
                )}
              </div>
            </div>

            <div className="progressTrack">
              <div
                className="progressFill"
                style={{ width: `${item.progress}%` }}
              ></div>
            </div>

            <div className="queueBottom">
              <strong>{item.progress}%</strong>

              {item.status !== "Done" ? (
                <button className="miniButton">
                  <Pause size={15} />
                </button>
              ) : (
                <button className="miniButton">
                  <Play size={15} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
