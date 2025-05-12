import axios from "axios";
import { getToken, removeToken } from "@/lib/localStorage";

// const API_BASE_URL = "https://estate-pro-backend.vercel.app/api";
const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      removeToken();
      // if (typeof window !== "undefined") {
      //   window.location.href = "/auth/login";
      // }
    }
    return Promise.reject(error);
  }
);

export default api;
