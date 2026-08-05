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
      return res.redirect(download.filePath);
    }

    // ==========================
    // Device Storage
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

    // Partial Streaming
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");

      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunkSize = end - start + 1;

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": contentType,
        "Content-Disposition": "inline",
      });

      fs.createReadStream(filePath, {
        start,
        end,
      }).pipe(res);

      return;
    }

    // Full File
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
      "Content-Disposition": "inline",
    });

    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error("Play Download:", error);

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

    // =========================================
    // CLOUD STORAGE
    // =========================================
    if (download.storageProvider === "platform") {
      const response = await fetch(download.filePath);

      if (!response.ok) {
        return res.status(404).json({
          success: false,
          message: "Cloud file not found.",
        });
      }

      const buffer = Buffer.from(await response.arrayBuffer());

      const extension =
        path.extname(new URL(download.filePath).pathname) || ".mp4";

      const safeTitle = (download.title || "video")
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
        .trim();

      const fileName = `${safeTitle}${extension}`;

      res.setHeader(
        "Content-Disposition",
        `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      );

      res.setHeader(
        "Content-Type",
        response.headers.get("content-type") || "application/octet-stream",
      );

      res.setHeader("Content-Length", buffer.length);

      return res.end(buffer);
    }

    // =========================================
    // DEVICE STORAGE
    // =========================================
    if (!download.filePath || !fs.existsSync(download.filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    const extension = path.extname(download.filePath);

    const safeTitle = (download.title || "video")
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
      .trim();

    const fileName = `${safeTitle}${extension}`;

    res.download(download.filePath, fileName, async (err) => {
      if (err) {
        console.error("Download Error:", err);

        if (!res.headersSent) {
          return res.status(500).json({
            success: false,
            message: "Download failed.",
          });
        }

        return;
      }

      try {
        // Device storage cleanup only
        if (download.storageProvider === "device") {
          // Delete temporary file
          if (fs.existsSync(download.filePath)) {
            await fs.promises.unlink(download.filePath);
          }

          // Delete MongoDB record
          await Download.findByIdAndDelete(download._id);
          
          // Clear Redis cache
          await redisClient.del(`downloads:${download.userId}`);
        }
      } catch (cleanupError) {
        console.error("Cleanup Error:", cleanupError);
      }
    });
  } catch (error) {
    console.error("Save Download Error:", error);

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
