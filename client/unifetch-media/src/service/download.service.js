import api  from "./axios.js";

export const getDownloadInfo = (url) => {
   return api.post("/download/info",{url});
};