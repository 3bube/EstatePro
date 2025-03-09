import axios from "axios";
import { getToken, removeToken } from "@/lib/localStorage";

const API_BASE_URL = "https://estate-pro-backend.vercel.app/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      removeToken();
    }
    return Promise.reject(error);
  }
);

export default api;
