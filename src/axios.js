import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:1010",
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${window.localStorage.getItem(
    "token"
  )}`;
  return config;
});

export default api;
