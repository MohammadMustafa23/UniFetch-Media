import "./DownloadsGrid.css";

import { useState } from "react";
import { toast } from "sonner";

import PageLoader from "../../../common/PageLoader";
import VideoPlayerModal from "../../../common/VideoPlayerModal";
import ConfirmModal from "../../../common/ConfirmModal";

import DownloadCard from "../DownloadCard/DownloadCard";
import DownloadsEmpty from "../DownloadsEmpty/DownloadsEmpty";

import {
  saveDownload,
  shareDownload,
  deleteDownload,
} from "../../../service/videoFunction.service.js";

export default function DownloadsGrid({
  downloads,
  loading,
  fetchDownloads, // Pass from parent
}) {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDownload, setSelectedDownload] = useState(null);

  const handlePlay = (item) => {
    setSelectedVideo(item);
    setIsPlayerOpen(true);
  };

  const handleSave = (item) => {
    saveDownload(item._id);
  };

  const handleShare = async (item) => {
    await shareDownload(item);
  };

  const handleDelete = (item) => {
    setSelectedDownload(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDownload) return;

    try {
      const response = await deleteDownload(selectedDownload._id);

      toast.success(response.message);

      // Refresh downloads
      if (fetchDownloads) {
        await fetchDownloads();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete download.",
      );
    } finally {
      setShowDeleteModal(false);
      setSelectedDownload(null);
    }
  };

  if (loading) {
    return (
      <PageLoader
        title="Loading Downloads"
        message="Fetching your downloaded media library..."
      />
    );
  }

  if (!downloads.length) {
    return <DownloadsEmpty />;
  }

  return (
    <>
      <section className="downloads-grid">
        {downloads.map((download) => (
          <DownloadCard
            key={download._id}
            item={download}
            onPlay={handlePlay}
            onSave={handleSave}
            onShare={handleShare}
            onDelete={handleDelete}
          />
        ))}
      </section>

      <VideoPlayerModal
        isOpen={isPlayerOpen}
        title={selectedVideo?.title}
        videoUrl={
          selectedVideo
            ? `http://localhost:3000/api/download/play/${selectedVideo._id}`
            : ""
        }
        onClose={() => {
          setIsPlayerOpen(false);
          setSelectedVideo(null);
        }}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Download?"
        message={`Are you sure you want to delete "${selectedDownload?.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedDownload(null);
        }}
      />
    </>
  );
}
