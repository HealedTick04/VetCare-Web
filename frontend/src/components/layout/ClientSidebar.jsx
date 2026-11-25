
import { NavLink, useNavigate } from "react-router-dom";
import {
  PawPrint,
  FileText,
  CalendarPlus,
  Pill,
  UserRound,
  LogOut,
} from "lucide-react";

import "./ClientSidebar.css";

const clientMenu = [
  {
    title: "MIS MASCOTAS",
    items: [
      {
        label: "Expedientes médicos",
        path: "/client/medical-records",
        icon: FileText,
      },
      {
        label: "Solicitar cita",
        path: "/client/appointments",
        icon: CalendarPlus,
      },
      {
        label: "Tratamientos",
        path: "/client/treatments",
        icon: Pill,
      },
    ],
  },
  {
    title: "CUENTA",
    items: [
      {
        label: "Mi perfil",
        path: "/client/profile",
        icon: UserRound,
      },
    ],
  },
];

function ClientSidebar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }

    navigate("/login");
  };

  return (
    <aside className="client-sidebar">
      <div className="client-sidebar-brand">
        <div className="client-sidebar-logo">
          <PawPrint size={25} />
        </div>

        <div>
          <h2>VetCare</h2>
          <span>Portal del cliente</span>
        </div>
      </div>

      <nav
        className="client-sidebar-navigation"
        aria-label="Menú del cliente"
      >
        {clientMenu.map((section) => (
          <div
            className="client-sidebar-section"
            key={section.title}
          >
            <h3>{section.title}</h3>

            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `client-sidebar-link ${
                      isActive ? "active" : ""
                    }`
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

      <div className="client-sidebar-bottom">
        <button
          type="button"
          className="client-sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

export default ClientSidebar;
