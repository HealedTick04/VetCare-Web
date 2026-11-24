import { Routes, Route, Navigate } from "react-router-dom";

// Páginas
import Login from "../../pages/Login/Login";
import Dashboard from "../../pages/Dashboard/Dashboard";

function AppRoutes() {
  return (
    <Routes>
      {/* Autenticación */}
      <Route path="/login" element={<Login />} />

      {/* Páginas principales */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Redirecciones */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
