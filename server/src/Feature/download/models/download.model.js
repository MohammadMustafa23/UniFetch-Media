import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoId: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
    },

    platform: {
      type: String,
      enum: ["youtube", "instagram", "facebook", "tiktok", "twitter", "other"],
      required: true,
    },

    storageProvider: {
      type: String,
      enum: ["device", "platform"],
      default: "device",
    },

    thumbnail: {
      type: String,
      default: "",
    },

    duration: {
      type: Number,
      default: 0, // seconds
    },

    quality: {
      type: String,
      default: "best",
    },

    format: {
      type: String,
      default: "mp4",
    },

    status: {
      type: String,
      enum: ["queued", "downloading", "completed", "failed", "cancelled"],
      default: "queued",
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    fileSize: {
      type: Number,
      default: 0, // bytes
    },

    downloadedSize: {
      type: Number,
      default: 0, // bytes
    },

    downloadSpeed: {
      type: String,
      default: "",
    },

    eta: {
      type: String,
      default: "",
    },

    filePath: {
      type: String,
      default: "",
    },

    error: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Download", downloadSchema);
