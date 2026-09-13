import "../src/config/env.js";
import downloadQueue from "../src/Feature/download/queue/download.bullmq.js";

try {
  await downloadQueue.obliterate({
    force: true,
  });

  console.log("[BullMQ] media-downloads queue cleaned successfully.");
} catch (error) {
  console.error("[BullMQ] Queue cleanup failed:", error.message);
  process.exitCode == 1;
} finally {
  await downloadQueue.close();
}
