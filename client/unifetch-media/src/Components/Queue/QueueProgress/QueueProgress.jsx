import "./QueueProgress.css";

const QueueProgress = ({ progress }) => {
  return (
    <div className="queue-progress">
      <div className="queue-progress-fill" style={{ width: `${progress}%` }} />
    </div>
  );
};

export default QueueProgress;
