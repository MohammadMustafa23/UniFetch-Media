import api from "./axios.js";
export const playDownload = async (id) => {
  try {
    const { data } = await api.get(`/download/play/${id}`);
    console.log(data);
    
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

  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);

  const disposition = response.headers["content-disposition"];

  let fileName = "download.mp4";

  if (disposition) {
    // RFC 5987 (filename*=UTF-8'')
    const utf8Match = disposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);

    if (utf8Match) {
      fileName = decodeURIComponent(utf8Match[1]);
    } else {
      // Normal filename=""
      const normalMatch = disposition.match(/filename\s*=\s*"([^"]+)"/i);

      if (normalMatch) {
        fileName = normalMatch[1];
      }
    }
  }

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const shareDownload = async (item) => {
  try {
    // ==========================
    // Cloud Storage
    // ==========================
    if (item.storageProvider === "platform") {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: "Shared from UniFetch",
          url: item.filePath,
        });

        return;
      }

      await navigator.clipboard.writeText(item.filePath);

      toast.success("Cloud link copied.");

      return;
    }

    // ==========================
    // Device Storage
    // ==========================
    const response = await api.get(`/download/save/${item._id}`, {
      responseType: "blob",
    });

    const extension = item.format?.toLowerCase() || "mp4";

    const file = new File([response.data], `${item.title}.${extension}`, {
      type: response.data.type,
    });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: item.title,
        text: "Shared from UniFetch",
        files: [file],
      });

      return;
    }

    const url = URL.createObjectURL(file);

    await navigator.clipboard.writeText(url);

    toast.success("Temporary file link copied.");

    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (error) {
    toast.error("Unable to share file.");
  }
};
