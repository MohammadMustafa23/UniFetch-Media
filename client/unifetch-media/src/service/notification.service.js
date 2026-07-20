import api from "./axios.js";

export const getNotifications = async () => {
  const { data } = await api.get("/user/notification");
  return data.notifications;
};

export const markAsRead = async (id) => {
  return api.patch(`/user/${id}/read`);
};

export const markAllAsRead = async () => {
  return api.patch("/user/read-all");
};

export const deleteNotification = async (id) => {
  return api.delete(`/user/${id}`);
};

export const clearNotifications = async () => {
  return api.delete("/user/clear");
};
