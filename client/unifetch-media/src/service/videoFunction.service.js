import api from "./axios.js";

export const playDownload = (id) => {
  window.open(
    `http://localhost:3000/api/download/play/${id}`,
    "_blank",
    "noopener,noreferrer",
  );
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
    const match = disposition.match(/filename="?([^"]+)"?/);

    if (match) {
      fileName = match[1];
    }
  }

  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};

export const shareDownload = async (item) => {
  try {
    const response = await api.get(`/download/save/${item._id}`, {
      responseType: "blob",
    });

    const extension = item.format?.toLowerCase() || "mp4";

    const file = new File([response.data], `${item.title}.${extension}`, {
      type: response.data.type,
    });

    // Native File Share
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: item.title,
        text: "Shared from UniFetch",
        files: [file],
      });

      return;
    }

    // Fallback
    const url = URL.createObjectURL(file);

    await navigator.clipboard.writeText(url);

    toast.success("Temporary file link copied.");

    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (error) {
    console.error(error);
    toast.error("Unable to share file.");
  }
};
