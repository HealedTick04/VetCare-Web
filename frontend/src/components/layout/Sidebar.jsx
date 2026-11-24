
import { NavLink, useNavigate } from "react-router-dom";
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
      {
        label: "Expedientes médicos",
        path: "/medical-records",
        icon: FileText,
      },
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
      {
        label: "Reportes",
        path: "/reports",
        icon: ChartNoAxesCombined,
      },
      { label: "Configuración", path: "/settings", icon: Settings },
    ],
  },
];

const clientMenu = [
  {
    title: "GENERAL",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "Mis citas", path: "/appointments", icon: CalendarDays },
    ],
  },
  {
    title: "MIS MASCOTAS",
    items: [
      { label: "Mascotas", path: "/pets", icon: PawPrint },
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

function Sidebar({
  role = "VETERINARIAN",
  onLogout,
}) {
  const navigate = useNavigate();

  const normalizedRole = role?.toUpperCase();

  const isAdmin = normalizedRole === "ADMIN";
  const isClient = normalizedRole === "CLIENT";

  const menu = isAdmin
    ? [...mainMenu.slice(0, 3), ...adminMenu, mainMenu[3]]
    : isClient
      ? clientMenu
      : mainMenu;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }

    navigate("/login");
  };

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

      <nav
        className="sidebar-navigation"
        aria-label="Menú principal"
      >
        {menu.map((section) => (
          <div className="sidebar-section" key={section.title}>
            <h3>{section.title}</h3>

            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} aria-hidden="true" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
