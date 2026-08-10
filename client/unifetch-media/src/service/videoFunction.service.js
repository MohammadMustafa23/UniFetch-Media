import api from "./axios.js";
export const playDownload = async (id) => {
  try {
    const { data } = await api.get(`/download/play/${id}`);
    // Cloudinary / Platform Storage
    if (data.success && data.type === "cloud") {
      window.open(data.url, "_blank");
      return;
    }

    // Local Storage
    window.open(
      `${import.meta.env.VITE_BACKEND_URL}/download/play/${id}`,
      "_blank"
    );
  } catch (error) {
    console.error("Play Error:", error);
  }
};

export const deleteDownload = async (id) => {
  const { data } = await api.delete(`/download/delete/${id}`);
  return data;
};
export const saveDownload = async (id) => {
  const response = await api.get(`/download/save/${id}`, {
    responseType: "blob",
  });

  // -----------------------------------------
  // Check that we actually received a file
  // -----------------------------------------

  if (!response.data || response.data.size === 0) {
    throw new Error("Empty file received from server.");
  }

  // -----------------------------------------
  // Preserve server Content-Type
  // -----------------------------------------

  const contentType =
    response.headers["content-type"] ||
    "application/octet-stream";

  const blob = new Blob([response.data], {
    type: contentType,
  });

  // -----------------------------------------
  // Create download URL
  // -----------------------------------------

  const url = window.URL.createObjectURL(blob);

  // -----------------------------------------
  // Get filename
  // -----------------------------------------

  const disposition =
    response.headers["content-disposition"];

  let fileName = "download";

  if (disposition) {
    // filename*=UTF-8''filename.mp4
    const utf8Match = disposition.match(
      /filename\*\s*=\s*UTF-8''([^;]+)/i
    );

    if (utf8Match?.[1]) {
      fileName = decodeURIComponent(
        utf8Match[1]
      );
    } else {
      // filename="filename.mp4"
      const normalMatch = disposition.match(
        /filename\s*=\s*"([^"]+)"/i
      );

      if (normalMatch?.[1]) {
        fileName = normalMatch[1];
      }
    }
  }

  // -----------------------------------------
  // Create temporary download link
  // -----------------------------------------

  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);

  link.click();

  link.remove();

  // IMPORTANT:
  // Don't revoke immediately.
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 5000);
};


export const shareDownload = async (item) => {
  try {
    // ==========================================
    // CLOUD / PLATFORM STORAGE
    // ==========================================

    if (item.storageProvider === "platform") {
      if (navigator.share) {
        await navigator.share({
          title: item.title || "UniFetch Download",
          text: "Shared from UniFetch",
          url: item.filePath,
        });

        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(item.filePath);

        toast.success("Cloud link copied.");
        return;
      }

      toast.error("Sharing is not supported on this device.");
      return;
    }

    // ==========================================
    // DEVICE STORAGE
    // ==========================================

    const response = await api.get(
      `/download/save/${item._id}`,
      {
        responseType: "blob",
      },
    );

    if (!response.data || response.data.size === 0) {
      throw new Error("Empty file received.");
    }

    // ==========================================
    // Get correct content type
    // ==========================================

    const contentType =
      response.headers["content-type"] ||
      response.data.type ||
      "application/octet-stream";

    // ==========================================
    // Get extension
    // ==========================================

    let extension = "mp4";

    if (contentType === "audio/mpeg") {
      extension = "mp3";
    } else if (contentType === "audio/mp4") {
      extension = "m4a";
    } else if (contentType === "video/webm") {
      extension = "webm";
    } else if (contentType === "video/quicktime") {
      extension = "mov";
    } else if (contentType === "image/jpeg") {
      extension = "jpg";
    } else if (contentType === "image/png") {
      extension = "png";
    } else if (item.format) {
      extension = item.format
        .toLowerCase()
        .replace(".", "");
    }

    // ==========================================
    // Filename
    // ==========================================

    const safeTitle =
      (item.title || "UniFetch Download")
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
        .trim() || "UniFetch Download";

    const fileName = `${safeTitle}.${extension}`;

    // ==========================================
    // Create File
    // ==========================================

    const file = new File(
      [response.data],
      fileName,
      {
        type: contentType,
      },
    );

   

    // ==========================================
    // MOBILE / WEB SHARE
    // ==========================================

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({
        files: [file],
      })
    ) {
      await navigator.share({
        title: item.title || "UniFetch Download",
        text: "Shared from UniFetch",
        files: [file],
      });

      return;
    }

    // ==========================================
    // Fallback: normal browser download
    // ==========================================

    const url = URL.createObjectURL(file);

    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);

    toast.success("File downloaded.");
  } catch (error) {
    console.error(
      "Share Download Error:",
      error,
    );

    // User cancelled native share
    if (error?.name === "AbortError") {
      return;
    }

    toast.error(
      "Unable to share file.",
    );
  }
};