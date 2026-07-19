import fs from "fs";
import { promises as fsPromises } from "fs";
import mime from "mime-types";
import Download from "../download/models/download.model.js";
import path from "path";

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

    if (!fs.existsSync(download.filePath)) {
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

    // Partial Content (HTML5 Video Streaming)
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
    console.error(error);

    res.status(500).json({
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

    if (!fs.existsSync(download.filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    const extension = path.extname(download.filePath);

    const safeTitle = download.title.replace(/[<>:"/\\|?*]+/g, "").trim();

    const fileName = `${safeTitle}${extension}`;
    console.log(fileName);

    res.download(download.filePath, fileName);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to download file.",
    });
  }
};

export const deleteDownload = async (req, res) => {
  console.log("DELETE DOWNLOAD API HIT");
  try {
    const { id } = req.params;
    console.log(id);

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

    console.log(download);

    // Delete local file (if it exists)
    fs.unlink(download.filePath, async (err) => {
      if (err) {
        return res.status(404).json({
          success: false,
          message: "File Delete Error",
        });
      }

      await download.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Download deleted successfully.",
      });
    });
  } catch (error) {
    console.error("Delete Download:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete download.",
    });
  }
};
