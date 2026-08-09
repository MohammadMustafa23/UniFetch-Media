import fs from "fs";
import { promises as fsPromises } from "fs";
import mime from "mime-types";
import Download from "../download/models/download.model.js";
import path from "path";
import { deleteFromCloudinary } from "../../cloud/cloudinary.js";
import { redisClient } from "../../config/redis.js";
import User from "../../models/user.model.js";

export const playDownload = async (req, res) => {

  try {
    const { id } = req.params;

    const download = await Download.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!download) {
      return res.status(404).json({
        success: false,
        message: "Download not found.",
      });
    }

    // ==========================
    // Cloud Storage
    // ==========================
    if (download.storageProvider === "platform") {
      return res.status(200).json({
        success: true,
        type: "cloud",
        url: download.filePath,
      });
    }

    // ==========================
    // Local Storage
    // ==========================
    if (!download.filePath || !fs.existsSync(download.filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    const filePath = download.filePath;
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const contentType = mime.lookup(filePath) || "application/octet-stream";

    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");

      const start = Number(parts[0]);
      const end = parts[1] ? Number(parts[1]) : fileSize - 1;

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": contentType,
        "Content-Disposition": "inline",
      });

      return fs
        .createReadStream(filePath, {
          start,
          end,
        })
        .pipe(res);
    }

    res.writeHead(200, {
      "Content-Length": fileSize,
      "Accept-Ranges": "bytes",
      "Content-Type": contentType,
      "Content-Disposition": "inline",
    });

    return fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

export const saveDownload = async (req, res) => {
  try {
    const { id } = req.params;

    const download = await Download.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!download) {
      return res.status(404).json({
        success: false,
        message: "Download not found.",
      });
    }

    if (!download.filePath) {
      return res.status(404).json({
        success: false,
        message: "File path not found.",
      });
    }

    // =====================================================
    // COMMON FILENAME
    // =====================================================

    const cleanTitle = (download.title || "video")
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
      .trim();

    const safeTitle = cleanTitle || "video";

    // =====================================================
    // CLOUD / PLATFORM STORAGE
    // =====================================================

    if (download.storageProvider === "platform") {
      console.log("==============================================");
      console.log("SAVE DOWNLOAD - PLATFORM");
      console.log("==============================================");
      console.log("Download ID:", download._id.toString());
      console.log("Cloud URL:", download.filePath);

      const response = await fetch(download.filePath);

      if (!response.ok || !response.body) {
        console.error(
          "Cloud file fetch failed:",
          response.status,
          response.statusText,
        );

        return res.status(404).json({
          success: false,
          message: "Cloud file not found.",
        });
      }

      // Get extension from URL
      let extension = ".mp4";

      try {
        extension =
          path.extname(new URL(download.filePath).pathname) || ".mp4";
      } catch {
        extension = ".mp4";
      }

      const fileName = `${safeTitle}${extension}`;

      const contentType =
        response.headers.get("content-type") ||
        "application/octet-stream";

      const contentLength = response.headers.get("content-length");

      // =================================================
      // RESPONSE HEADERS
      // =================================================

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(fileName)}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      );

      res.setHeader("Content-Type", contentType);

      if (contentLength) {
        res.setHeader("Content-Length", contentLength);
      }

      console.log("File Name:", fileName);
      console.log("Content Type:", contentType);
      console.log("Content Length:", contentLength || "unknown");
      console.log("==============================================");

      // =================================================
      // STREAM CLOUD FILE
      // =================================================

      try {
        const { Readable } = await import("stream");

        const nodeStream = Readable.fromWeb(response.body);

        nodeStream.on("error", (streamError) => {
          console.error("Cloud stream error:", streamError);
        });

        nodeStream.pipe(res);

        return;
      } catch (streamError) {
        console.error("Cloud streaming error:", streamError);

        if (!res.headersSent) {
          return res.status(500).json({
            success: false,
            message: "Failed to stream cloud file.",
          });
        }

        return;
      }
    }

    // =====================================================
    // DEVICE / LOCAL STORAGE
    // =====================================================

    if (download.storageProvider === "device") {
      console.log("==============================================");
      console.log("SAVE DOWNLOAD - DEVICE");
      console.log("==============================================");
      console.log("Download ID:", download._id.toString());
      console.log("File Path:", download.filePath);

      // -----------------------------------------------
      // Check file
      // -----------------------------------------------

      if (!fs.existsSync(download.filePath)) {
        console.error(
          "File does not exist:",
          download.filePath,
        );

        return res.status(404).json({
          success: false,
          message: "File not found on server.",
        });
      }

      const stats = await fs.promises.stat(download.filePath);

      if (!stats.isFile()) {
        return res.status(400).json({
          success: false,
          message: "Download path is not a file.",
        });
      }

      // -----------------------------------------------
      // Extension
      // -----------------------------------------------

      const extension =
        path.extname(download.filePath).toLowerCase() || ".mp4";

      const fileName = `${safeTitle}${extension}`;

      // -----------------------------------------------
      // Content type
      // -----------------------------------------------

      const mimeTypes = {
        ".mp4": "video/mp4",
        ".webm": "video/webm",
        ".mkv": "video/x-matroska",
        ".mov": "video/quicktime",

        ".mp3": "audio/mpeg",
        ".m4a": "audio/mp4",
        ".wav": "audio/wav",
        ".ogg": "audio/ogg",
        ".opus": "audio/ogg",
        ".aac": "audio/aac",

        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
      };

      const contentType =
        mimeTypes[extension] ||
        "application/octet-stream";

      // -----------------------------------------------
      // Debug
      // -----------------------------------------------

      console.log("File Exists:", true);
      console.log("File Size:", stats.size);
      console.log("File Name:", fileName);
      console.log("Content Type:", contentType);

      // -----------------------------------------------
      // Headers
      // -----------------------------------------------

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(fileName)}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      );

      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Length", stats.size);

      // -----------------------------------------------
      // Stream file
      // -----------------------------------------------

      const fileStream = fs.createReadStream(
        download.filePath,
      );

      let streamFinished = false;

      fileStream.on("error", (error) => {
        console.error("File stream error:", error);

        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: "Failed to read download file.",
          });
        } else {
          res.destroy(error);
        }
      });

      fileStream.on("end", async () => {
        streamFinished = true;

        console.log(
          "File successfully sent to client:",
          fileName,
        );

        // =============================================
        // CLEANUP AFTER SUCCESSFUL SEND
        // =============================================

        try {
          if (fs.existsSync(download.filePath)) {
            await fs.promises.unlink(download.filePath);

            console.log(
              "Temporary file deleted:",
              download.filePath,
            );
          }

          await Download.findByIdAndDelete(
            download._id,
          );

          await redisClient.del(
            `downloads:${download.userId}`,
          );

          console.log("Download record cleaned up.");
        } catch (cleanupError) {
          console.error(
            "Cleanup Error:",
            cleanupError,
          );
        }
      });

      fileStream.pipe(res);

      return;
    }

    // =====================================================
    // UNKNOWN STORAGE PROVIDER
    // =====================================================

    return res.status(400).json({
      success: false,
      message: `Unsupported storage provider: ${download.storageProvider}`,
    });
  } catch (error) {
    console.error("Save Download Error:", error);

    if (res.headersSent) {
      return res.destroy(error);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to download file.",
    });
  }
};

export const deleteDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const download = await Download.findOne({
      _id: id,
      userId: req.user._id,
    });

    const cacheKey = `downloads:${req.user._id}`;

    if (!download) {
      return res.status(404).json({
        success: false,
        message: "Download not found.",
      });
    }

    // ==========================
    // Cloud Storage
    // ==========================
    if (download.storageProvider === "platform") {
      try {
        // Delete from Cloudinary
        await deleteFromCloudinary(download.publicId);

        // Reduce user's cloud storage
        await User.findByIdAndUpdate(download.userId, {
          $inc: {
            "cloudStorage.used": -download.fileSize,
          },
        });

        await download.deleteOne();

        // Clear Redis Cache
        await redisClient.del(cacheKey);
        await redisClient.del(`storage:${download.userId}`);

        return res.status(200).json({
          success: true,
          message: "Cloud download deleted successfully.",
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to delete cloud file.",
        });
      }
    }

    // ==========================
    // Device Storage
    // ==========================
    if (download.filePath && fs.existsSync(download.filePath)) {
      await fs.promises.unlink(download.filePath);
    }

    await download.deleteOne();

    // Clear Redis Cache
    await redisClient.del(cacheKey);

    return res.status(200).json({
      success: true,
      message: "Cloud download deleted successfully.",
    });

    return res.status(200).json({
      success: true,
      message: "Download deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Download:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete download.",
    });
  }
};
