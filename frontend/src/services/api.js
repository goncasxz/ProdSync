import axios from "axios";

// Cria instância do Axios
export const api = axios.create({
  baseURL: "https://prodsync.onrender.com",
  headers: { "Content-Type": "application/json" },
});

// Interceptor para adicionar token em todas as requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("prodsync_user"));
    if (user?.token) {
      const token = user.token;
      const exp = JSON.parse(atob(token.split(".")[1])).exp;
      const now = Date.now() / 1000;
      if (exp < now) {
        // dispara logout globalmente
        window.dispatchEvent(new Event("logout"));
        return Promise.reject({ message: "Token expirado" });
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Escuta evento global de logout
window.addEventListener("logout", () => {
  localStorage.removeItem("prodsync_user");
});
