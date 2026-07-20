import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },

    type: {
      type: String,
      enum: ["success", "error", "info", "warning"],
      default: "info",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    metadata: {
      downloadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Download",
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Notification", notificationSchema);
