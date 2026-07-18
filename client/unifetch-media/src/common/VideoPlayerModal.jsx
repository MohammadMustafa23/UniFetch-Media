import "./VideoPlayModel.css";

import { X } from "lucide-react";

export default function VideoPlayerModal({ isOpen, videoUrl, title, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div className="video-modal" onClick={(e) => e.stopPropagation()}>
        <div className="video-modal-header">
          <h2>{title}</h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <video
          src={videoUrl}
          controls
          autoPlay
          playsInline
          className="video-player"
        />
      </div>
    </div>
  );
}
