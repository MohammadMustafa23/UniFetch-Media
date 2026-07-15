import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    // Owner
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Original URL
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
    videoId: {
      type: String,
      default: "",
      index: true,
    },

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

    type: {
      type: String,
      enum: ["video", "audio", "image", "short"],
      default: "video",
    },

    availableQualities: {
      type: [String],
      default: [],
    },

    bestQuality: {
      type: String,
      default: "",
    },

    // User Activity
    favorite: {
      type: Boolean,
      default: false,
    },

    lastViewedAt: Date,

    lastDownloadedAt: Date,

    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// One history per user per URL
historySchema.index({ userId: 1, url: 1 }, { unique: true });

// Recent History
historySchema.index({
  userId: 1,
  createdAt: -1,
});

// Favorites
historySchema.index({
  userId: 1,
  favorite: 1,
});

export default mongoose.model("History", historySchema);
