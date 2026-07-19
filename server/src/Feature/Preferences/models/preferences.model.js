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

    appearance: {
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "dark",
      },
    },

    download: {
      autoDownload: {
        type: Boolean,
        default: false,
      },

      autoPaste: {
        type: Boolean,
        default: false,
      },

      quality: {
        type: String,
        enum: ["best", "1080p", "720p", "480p", "360p"],
        default: "best",
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("UserPreference", preferenceSchema);
