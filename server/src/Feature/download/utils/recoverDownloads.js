import Download from "../models/download.model.js";

export const recoverDownloads = async () => {
  const result = await Download.updateMany(
    {
      status: {
        $in: ["queued", "downloading"],
      },
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

  console.log(`⚠️ Recovered ${result.modifiedCount} interrupted download(s).`);
};
