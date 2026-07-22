import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    storage: {
      provider: {
        type: String,
        enum: ["device", "cloudinary"],
        default: "device",
      },
    },

    autoDownload: {
      type: Boolean,
      default: false,
    },

    quality: {
      type: String,
      enum: ["best", "1080p", "720p", "480p", "360p"],
      default: "best",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("UserPreference", preferenceSchema);
