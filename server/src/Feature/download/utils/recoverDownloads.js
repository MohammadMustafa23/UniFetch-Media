import Download from "../models/download.model.js";

export const recoverDownloads = async () => {
  try {
    const result = await Download.updateMany(
      {
        status: "downloading",
      },
      {
        $set: {
          status: "failed",
          error: "Download interrupted because the server restarted.",
          downloadSpeed: "",
          eta: "",
        },
      },
    );

    console.log(
      `[Recovery] Marked ${result.modifiedCount} interrupted download(s) as failed.`,
    );
  } catch (error) {
    console.error("[Recovery] Failed:", error.message);
  }
};
