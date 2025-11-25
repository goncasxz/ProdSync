import { createContext, useContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("translot_user");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!isTokenExpired(parsed.token)) return parsed;
    }
    return null;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (user && isTokenExpired(user.token)) {
        logout();
      }
    }, 1000 * 60); // checa a cada minuto
    return () => clearInterval(interval);
  }, [user]);

  async function login(email, password) {
    try {
      const res = await fetch("https://prodsync.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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

  function logout() {
    setUser(null);
    localStorage.removeItem("translot_user");
    // opcional: dispara evento global para api.js
    window.dispatchEvent(new Event("logout"));
  }

  function isTokenExpired(token) {
    if (!token) return true;
    try {
      const decoded = jwt_decode(token);
      if (!decoded.exp) return true;
      const now = Date.now() / 1000;
      return decoded.exp < now;
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
