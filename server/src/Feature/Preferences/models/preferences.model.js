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
        default: true,
      },

      mediaType: {
        type: String,
        enum: ["video", "audio"],
        default: "video",
      },

      quality: {
        type: String,
        enum: [
          "best",
          "2160",
          "1440",
          "1080",
          "720",
          "480",
          "360",
          "240",
          "144",
        ],
        default: "best",
      },

      videoFormat: {
        type: String,
        enum: ["mp4", "webm"],
        default: "mp4",
      },

      audioFormat: {
        type: String,
        enum: ["mp3", "m4a", "wav"],
        default: "mp3",
      },

      maxConcurrent: {
        type: Number,
        min: 1,
        max: 5,
        default: 3,
      },
    },

    privacy: {
      saveHistory: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("UserPreference", preferenceSchema);
