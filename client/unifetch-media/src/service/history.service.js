import api from './axios.js'

export const getHistory = (filter = "All") => {
  const params = filter === "All" ? {} : { status: filter };

  return api.get("/history/get", { params });
};