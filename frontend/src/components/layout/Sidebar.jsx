
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  PawPrint,
  FileText,
  Pill,
  Stethoscope,
  Package,
  Bell,
  UserRound,
  LogOut,
  UserCog,
  ChartNoAxesCombined,
  Settings,
} from "lucide-react";

import "./Sidebar.css";

const mainMenu = [
  {
    title: "GENERAL",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "Citas", path: "/appointments", icon: CalendarDays },
    ],
  },
  {
    title: "GESTIÓN DE PACIENTES",
    items: [
      { label: "Clientes", path: "/clients", icon: Users },
      { label: "Mascotas", path: "/pets", icon: PawPrint },
      { label: "Expedientes médicos", path: "/medical-records", icon: FileText },
      { label: "Tratamientos", path: "/treatments", icon: Pill },
    ],
  },
  {
    title: "CLÍNICA",
    items: [
      { label: "Servicios", path: "/services", icon: Stethoscope },
      { label: "Inventario", path: "/inventory", icon: Package },
    ],
  },
  {
    title: "CUENTA",
    items: [
      { label: "Notificaciones", path: "/notifications", icon: Bell },
      { label: "Mi perfil", path: "/profile", icon: UserRound },
    ],
  },
];

const adminMenu = [
  {
    title: "ADMINISTRACIÓN",
    items: [
      { label: "Usuarios", path: "/users", icon: UserCog },
      { label: "Reportes", path: "/reports", icon: ChartNoAxesCombined },
      { label: "Configuración", path: "/settings", icon: Settings },
    ],
  },
];

function Sidebar({ role = "VETERINARIAN" }) {
  const isAdmin = role === "ADMIN";

  const menu = isAdmin
    ? [...mainMenu.slice(0, 3), ...adminMenu, mainMenu[3]]
    : mainMenu;

  return (
    <aside className="sidebar">

      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <PawPrint size={25} />
        </div>

        <div>
          <h2>VetCare</h2>
          <span>Gestión veterinaria</span>
        </div>
      </div>

      <nav className="sidebar-navigation">
        {menu.map((section) => (
          <div className="sidebar-section" key={section.title}>
            <h3>{section.title}</h3>

            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={19} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/login" className="sidebar-logout">
          <LogOut size={19} />
          <span>Cerrar sesión</span>
        </NavLink>
      </div>

    </aside>
  );
}

export default Sidebar;
