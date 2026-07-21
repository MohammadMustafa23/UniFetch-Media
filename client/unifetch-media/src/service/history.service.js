import api from "./axios.js";

export const getHistory = (filter = "All") => {
  const params = filter === "All" ? {} : { status: filter };
  return api.get("/history/get", { params });
};

export const toggleFavorite = async (id) => {
  const response = await api.patch(`/history/favorite/${id}`);
  return response.data;
};

export const deleteHistory = async (id) => {
  const response = await api.delete(`/history/delete/${id}`);
  return response.data;
};

export const downloadFromHistory = async (id) => {
  const { data } = await api.post(`/history/download/${id}`);
  return data;
};

export const getFavorites = async () => {
  const { data } = await api.get("/history/favorites");
  return data;
};


export const globalSearch = async (query) => {
  const { data } = await api.get(`/search`, {
    params: { q: query }
  });

  return data;
};