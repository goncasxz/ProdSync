import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("translot_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!isTokenExpired(parsed.token)) return parsed;
      } catch {
        localStorage.removeItem("translot_user");
      }
    }
    return null;
  });

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("translot_user");
    window.dispatchEvent(new Event("logout")); // caso api.js queira escutar
  }, []);

  // Checa token expirado a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.token && isTokenExpired(user.token)) {
        logout();
      }
    }, 60_000);

    return () => clearInterval(interval);
  }, [user, logout]);

  async function login(email, senha) {
    try {
      const res = await fetch("https://prodsync.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem("translot_user", JSON.stringify(data));
        return { ok: true };
      } else {
        return { ok: false, error: data.message || "Erro ao autenticar" };
      }
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  function isTokenExpired(token) {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      return !decoded.exp || decoded.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
