import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./login.css";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) nav("/painel");
    else setError(res.error || "Erro ao autenticar");
  }

  return (
    <div className="login-bg-dark">
      <div className="login-card-dark">
        <header className="login-head">
          <div className="brand-mark">◆</div>
          <div>
            <h1 className="title">ProdSync</h1>
            <p className="subtitle">Por favor se identifique</p>
          </div>
        </header>

        {error && <div className="alert error">{error}</div>}

        <form onSubmit={onSubmit} className="form">
          <label className="field">
            <span className="label">E-mail</span>
            <input
              type="email"
              placeholder="admin@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="label">Senha</span>
            <input
              type={showPwd ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="inline-actions right">
              <button
                type="button"
                className="link tiny"
                onClick={() => setShowPwd((s) => !s)}
              >
                {showPwd ? "Ocultar senha" : "Mostrar senha"}
              </button>
            </div>
          </label>

          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
