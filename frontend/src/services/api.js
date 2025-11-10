// src/services/api.js
import axios from "axios";
import { useAuth } from "../context/AuthContext";

// Cria instância do Axios
export const api = axios.create({
  baseURL: "https://prodsync.onrender.com", // ajuste para a URL do seu backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token em todas as requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("translot_user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
