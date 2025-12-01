import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api"; // Importa sua instância configurada

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Ao iniciar, verifica se já tem usuário salvo
  useEffect(() => {
    const storedUser = localStorage.getItem("translot_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 2. Função de Login integrada ao Backend
  async function login(email, senha) {
    try {
      // Chama o endpoint POST /auth/login
      const response = await api.post("/auth/login", { email, senha });

      if (response.data.ok) {
        const { token, usuario } = response.data;
        
        // Monta o objeto de usuário com o token
        const userData = { token, ...usuario };

        // Salva no localStorage (para o api.js ler depois)
        localStorage.setItem("translot_user", JSON.stringify(userData));
        
        // Atualiza o estado global
        setUser(userData);
        return { ok: true };
      }
      return { ok: false, error: "Erro desconhecido no login." };
    } catch (error) {
      console.error("Erro no login:", error);
      // Pega a mensagem de erro do backend (ex: "Usuário/senha inválidos")
      const msg = error.response?.data?.error || "Falha ao conectar com o servidor.";
      return { ok: false, error: msg };
    }
  }

  // 3. Função de Logout
  function logout() {
    localStorage.removeItem("translot_user");
    setUser(null);
    // Opcional: Redirecionar via window.location ou navigate se necessário
  }

  // Escuta o evento de logout forçado (criado no seu api.js quando o token expira)
  useEffect(() => {
    const handleLogout = () => logout();
    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, signed: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}