import axios from "axios";

const API_BASE_URL = `http://${window.location.hostname}:3000/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;