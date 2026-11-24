import { Routes, Route, Navigate } from "react-router-dom";

// Páginas
import Login from "../../pages/Login/Login";
import Dashboard from "../../pages/Dashboard/Dashboard";
import Appointments from "../../pages/Appointments/Appointments";
import Clients from "../../pages/Clients/Clients";
import Pets from "../../pages/Pets/Pets";

function AppRoutes() {
  return (
    <Routes>
      {/* Autenticación */}
      <Route path="/login" element={<Login />} />

      {/* Páginas principales */}
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/appointments" element={<Appointments />} />

      <Route path="/clients" element={<Clients />} />

      <Route path="/pets" element={<Pets />} />

      {/* Redirecciones */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
