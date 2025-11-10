// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";
import { api } from "../services/api"; // seu axios configurado com baseURL do backend

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Estado do usuário
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("translot_user"));
    } catch {
      return null;
    }
  });

  // Loading global do auth
  const [loading, setLoading] = useState(false);

  // Login
  async function login(email, password) {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, senha: password });

      if (res.data.token) {
        const user = { ...res.data.usuario, token: res.data.token };
        setUser(user);
        localStorage.setItem("translot_user", JSON.stringify(user));
        setLoading(false);
        return { ok: true };
      } else {
        setUser(null);
        setLoading(false);
        return { ok: false, error: "Usuário ou senha incorretos" };
      }
    } catch (err) {
      setUser(null);
      setLoading(false);
      return { ok: false, error: err.response?.data?.error || err.message };
    }
  }

  // Logout
  function logout() {
    setUser(null);
    localStorage.removeItem("translot_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para consumir o AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
