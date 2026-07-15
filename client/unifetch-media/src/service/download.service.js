import api  from "./axios.js";

export const getDownloadInfo = (url) => {
   return api.post("/download/info",{url});
};

export const startDownload = (data) => {
  return api.post("/download/start", data);
};
export const getDownloads = () =>{
  return api.get('/download/downloads');
}