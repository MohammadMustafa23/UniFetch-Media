import api from "./axios.js";

export const getDownloadInfo = (url) => {
  return api.post("/download/info", { url });
};

export const startDownload = (data) => {
  return api.post("/download/start", data);
};
export const getDownloads = () => {
  return api.get("/download/downloads");
};

export const getQueue = () => {
  return api.get("/download/queue");
};

export const autoDownload = (data) => {
  return api.post("/download/autoDownload", data);
};


// queue Managment
export const retryDownload = (id) => {
  return api.post(`/download/retry/${id}`);
};

export const pauseDownload = (id) => {
  return api.post(`/download/pause/${id}`);
};

export const resumeDownload = (id) => {
  return api.post(`/download/resume/${id}`);
};

export const deleteDownload = (id) => {
  return api.delete(`/download/delete/${id}`);
};
