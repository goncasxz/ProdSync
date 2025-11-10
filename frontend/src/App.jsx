import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import DashboardProto from "./pages/DashboardProto";

// Rota privada usando Outlet
function PrivateRoute() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/" replace />;
}

// Rota pública: se já estiver logado, redireciona para /painel
function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/painel" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login como página pública */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Todas as rotas privadas */}
          <Route element={<PrivateRoute />}>
            <Route path="/painel" element={<DashboardProto />} />
            {/* Futuras rotas privadas podem ser adicionadas aqui */}
          </Route>

          {/* Qualquer rota desconhecida volta pro login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
