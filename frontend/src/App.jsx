import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import DashboardProto from "./pages/DashboardProto";

// protege rotas: se não estiver logado, volta pro login
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login como página inicial */}
          <Route path="/" element={<Login />} />

          {/* Painel (protegido) */}
          <Route
            path="/painel"
            element={
              <PrivateRoute>
                <DashboardProto />
              </PrivateRoute>
            }
          />

          {/* Qualquer rota desconhecida volta pro login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
