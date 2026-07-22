import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema(
  {
    // Owner
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Original Media URL
    url: {
      type: String,
      required: true,
      trim: true,
    },

    // Platform
    platform: {
      type: String,
      enum: ["youtube", "instagram", "facebook", "tiktok", "twitter", "other"],
      required: true,
    },

    // Metadata
    title: {
      type: String,
      default: "",
      trim: true,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    uploader: {
      type: String,
      default: "",
    },

    duration: {
      type: Number,
      default: 0,
    },

    // User Selection
    quality: {
      type: String,
      enum: ["best", "2160", "1440", "1080", "720", "480", "360", "240", "144"],
      default: "best",
    },

    storageProvider: {
      type: String,
      enum: ["device", "cloudinary"],
      default: "device",
    },

    format: {
      type: String,
      enum: ["mp4", "webm", "mp3", "m4a"],
      default: "mp4",
    },

    // Download Progress
    status: {
      type: String,
      enum: [
        "pending",
        "fetching",
        "queued",
        "downloading",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Local Storage
    fileName: {
      type: String,
      default: "",
    },

    filePath: {
      type: String,
      default: "",
    },

    fileSize: {
      type: Number,
      default: 0,
    },

    // Error (if any)
    error: {
      type: String,
      default: "",
    },

    // Timeline
    startedAt: Date,

    completedAt: Date,
  },
  {
    timestamps: true,
  },
);

// Helpful indexes
downloadSchema.index({ userId: 1, createdAt: -1 });
downloadSchema.index({ userId: 1, status: 1 });

export default mongoose.model("Download", downloadSchema);
