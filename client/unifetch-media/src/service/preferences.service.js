// services/preferences.service.js
import api from "./axios.js";

export const getPreferences = () => {
  return api.get("/user/preferences");
};

export const updatePreferences = (data) => {
  return api.patch("/user/preferences", data);
};


