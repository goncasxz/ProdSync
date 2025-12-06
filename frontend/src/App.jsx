import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import DashboardProto from "./pages/DashboardProto";
import { api } from "./services/api";

function ApiDocsRedirect() {
  useEffect(() => {
    const backendUrl = api.defaults.baseURL;
    window.location.href = `${backendUrl}/api-docs`;
  }, []);

  return <div style={{color:'#fff', padding: 20}}>Redirecionando para documentação...</div>;
}

function PrivateRoute() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/" replace />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/painel" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/api-docs" element={<ApiDocsRedirect />} />
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route element={<PrivateRoute />}>
            <Route path="/painel" element={<DashboardProto />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
