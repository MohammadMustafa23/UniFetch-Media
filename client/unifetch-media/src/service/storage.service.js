import api from "./axios.js";

export const getStorage = () => {
  return api.get("/storage");
};

export const clearCache = () => {
  return api.delete("/storage/cache");
};

export const removeFailedDownloads = () => {
  return api.delete("/storage/failed");
};