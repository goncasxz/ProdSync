import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
export function useAuth() { return useContext(AuthContext); }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("demo_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (email, password) => {
    if (email === "admin@demo.com" && password === "123456") {
      const u = { email };
      setUser(u);
      localStorage.setItem("demo_user", JSON.stringify(u));
      return { ok: true };
    }
    return { ok: false, error: "Credenciais inválidas" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("demo_user");
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
