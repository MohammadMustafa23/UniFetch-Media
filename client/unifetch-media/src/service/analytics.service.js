import api from "./axios.js";

export const getDashboardAnalytics = () => {
  return api.get("/analytics/dashboard");
};
