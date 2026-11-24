import { Routes, Route, Navigate } from "react-router-dom";

// Páginas
import Login from "../../pages/Login/Login";
import Dashboard from "../../pages/Dashboard/Dashboard";
import Appointments from "../../pages/Appointments/Appointments";
import Clients from "../../pages/Clients/Clients";
import Pets from "../../pages/Pets/Pets";
import MedicalRecords from "../../pages/MedicalRecords/MedicalRecords";
import Treatments from "../../pages/Treatments/Treatments";
import Services from "../../pages/Services/Services";
import Inventory from "../../pages/Inventory/Inventory";
import Notifications from "../../pages/Notifications/Notifications";
import Profile from "../../pages/Profile/Profile";
import Users from "../../pages/Users/Users";
import Reports from "../../pages/Reports/Reports";
import Settings from "../../pages/Settings/Settings";

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

      <Route path="/medical-records" element={<MedicalRecords />} />

      <Route path="/treatments" element={<Treatments />} />

      <Route path="/services" element={<Services />} />
      
      <Route path="/inventory" element={<Inventory />} />

      <Route path="/notifications" element={<Notifications />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/users" element={<Users />} />

      <Route path="/reports" element={<Reports />} />

      <Route path="/settings" element={<Settings />} />
      {/* Redirecciones */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
