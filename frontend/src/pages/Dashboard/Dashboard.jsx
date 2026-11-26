import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  PawPrint,
  Users,
  Stethoscope,
  Bell,
  Search,
  Clock,
  ArrowUpRight,
  ClipboardList,
  FileText,
  UserPlus,
  CalendarPlus,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import { appointmentService } from "../../services/api/appointmentService";
import { petService } from "../../services/api/petService";
import { medicalRecordService } from "../../services/api/medicalRecordService";
import { clientService } from "../../services/api/clientService";
import { authService } from "../../services/api/authService";
import "./Dashboard.css";

const statusLabels = {
  CONFIRMED: "Confirmada",
  PENDING: "Pendiente",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistió",
};

function getTodayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function Dashboard() {
  const currentUser = authService.getCurrentUser();
  const role = currentUser?.role || "VETERINARIAN";
  const isClient = role === "CLIENT";

  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [clients, setClients] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [apptsData, petsData, recordsData] = await Promise.all([
          appointmentService.getAll(),
          petService.getAll(),
          medicalRecordService.getAll().catch(() => []),
        ]);

        setAppointments(apptsData);
        setPets(petsData);
        setRecords(recordsData);

        if (!isClient) {
          const clientsData = await clientService.getAll().catch(() => []);
          setClients(clientsData);
        }
      } catch (error) {
        console.error("Error al cargar resumen del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isClient]);

  const currentDate = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const todayISO = getTodayISO();

  // Citas de hoy activas (no canceladas)
  const todayAppointments = useMemo(() => {
    return appointments
      .filter((a) => a.date === todayISO && a.status !== "CANCELLED")
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, todayISO]);

  // Si hoy no hay citas, mostramos las próximas citas futuras pendientes/confirmadas
  const upcomingAppointments = useMemo(() => {
    const baseList =
      todayAppointments.length > 0
        ? todayAppointments
        : appointments
            .filter(
              (a) =>
                a.date >= todayISO &&
                (a.status === "PENDING" || a.status === "CONFIRMED")
            )
            .sort((a, b) =>
              `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
            )
            .slice(0, 5);

    return baseList.map((a) => ({
      id: a.id,
      time: a.date === todayISO ? a.time : `${a.date.slice(5)} ${a.time}`,
      pet: a.pet,
      owner: a.owner,
      service: a.service,
      status: statusLabels[a.status] || a.status,
      rawStatus: a.status,
    }));
  }, [appointments, todayAppointments, todayISO]);

  // Actividad reciente construida a partir de expedientes, citas y mascotas reales
  const recentActivities = useMemo(() => {
    const feed = [];

    records.slice(0, 3).forEach((r) => {
      feed.push({
        id: `rec-${r.id}`,
        title: "Nuevo expediente médico",
        description: `Consulta registrada para ${r.pet} (${r.diagnosis}).`,
        time: r.date || "Reciente",
        icon: FileText,
      });
    });

    appointments.slice(0, 3).forEach((a) => {
      feed.push({
        id: `app-${a.id}`,
        title: `Cita ${
          (statusLabels[a.status] || a.status).toLowerCase()
        }`,
        description: `${a.pet} — ${a.service} (${a.date} ${a.time}).`,
        time: a.veterinarian,
        icon: CalendarDays,
      });
    });

    pets.slice(0, 2).forEach((p) => {
      feed.push({
        id: `pet-${p.id}`,
        title: "Paciente registrado",
        description: `${p.name} (${p.species}) — Prop. ${p.owner}.`,
        time: p.registrationDate || "En directorio",
        icon: PawPrint,
      });
    });

    return feed.slice(0, 5);
  }, [records, appointments, pets]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredAppointments = useMemo(() => {
    return upcomingAppointments.filter((appointment) =>
      [
        appointment.time,
        appointment.pet,
        appointment.owner,
        appointment.service,
        appointment.status,
      ].some((value) => (value || "").toLowerCase().includes(normalizedSearch))
    );
  }, [upcomingAppointments, normalizedSearch]);

  const filteredActivities = useMemo(() => {
    return recentActivities.filter((activity) =>
      [activity.title, activity.description, activity.time].some((value) =>
        (value || "").toLowerCase().includes(normalizedSearch)
      )
    );
  }, [recentActivities, normalizedSearch]);

  // Consultas realizadas en los últimos 7 días
  const weeklyRecordsCount = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoISO = weekAgo.toISOString().split("T")[0];
    return records.filter((r) => r.date && r.date >= weekAgoISO).length;
  }, [records]);

  const statistics = [
    {
      title: "Citas de hoy",
      value: loading ? "..." : String(todayAppointments.length).padStart(2, "0"),
      description: "Citas programadas",
      icon: CalendarDays,
      color: "blue",
      path: "/appointments",
    },
    {
      title: isClient ? "Mis mascotas" : "Mascotas",
      value: loading ? "..." : String(pets.length),
      description: "Pacientes registrados",
      icon: PawPrint,
      color: "green",
      path: "/pets",
    },
    ...(!isClient
      ? [
          {
            title: "Clientes",
            value: loading ? "..." : String(clients.length),
            description: "Propietarios registrados",
            icon: Users,
            color: "purple",
            path: "/clients",
          },
        ]
      : []),
    {
      title: "Consultas realizadas",
      value: loading ? "..." : String(weeklyRecordsCount),
      description: "Durante los últimos 7 días",
      icon: Stethoscope,
      color: "orange",
      path: "/medical-records",
    },
  ];

  const quickAccess = [
    ...(!isClient
      ? [
          {
            title: "Registrar cliente",
            description: "Agregar un propietario",
            icon: UserPlus,
            color: "blue",
            path: "/clients",
          },
        ]
      : []),
    {
      title: "Registrar mascota",
      description: "Agregar un paciente",
      icon: PawPrint,
      color: "green",
      path: "/pets",
    },
    {
      title: "Agendar cita",
      description: "Programar una consulta",
      icon: CalendarPlus,
      color: "purple",
      path: "/appointments",
    },
    ...(!isClient
      ? [
          {
            title: "Nuevo expediente",
            description: "Registrar una consulta",
            icon: ClipboardList,
            color: "orange",
            path: "/medical-records",
          },
        ]
      : []),
  ];

  const displayName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "Personal veterinario";

  const roleDisplay = {
    ADMIN: "Administrador",
    VETERINARIAN: "Veterinario",
    CLIENT: "Cliente",
  }[role] || role;

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />

      <main className="dashboard-main">
        {/* Barra superior */}
        <header className="dashboard-topbar">
          <div className="topbar-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Buscar citas o actividades..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            {searchTerm && (
              <button
                type="button"
                className="search-clear-button"
                onClick={() => setSearchTerm("")}
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>
            )}
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="notification-button"
              aria-label="Ir a notificaciones"
              onClick={() => navigate("/notifications")}
            >
              <Bell size={20} />
              <span className="notification-indicator"></span>
            </button>

            <div className="topbar-user">
              <div className="user-avatar">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong>{displayName}</strong>
                <span>{roleDisplay}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <div className="dashboard-content">
          <section className="dashboard-welcome">
            <div>
              <span className="dashboard-date">{currentDate}</span>
              <h1>¡Buen día, {currentUser?.firstName || "equipo"}!</h1>
              <p>Aquí tienes un resumen de la actividad de tu clínica.</p>
            </div>

            <div className="welcome-decoration">
              <PawPrint size={55} />
            </div>
          </section>

          {/* Estadísticas */}
          <section className="statistics-grid">
            {statistics.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  type="button"
                  className="stat-card"
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  title={`Ir a ${item.title}`}
                >
                  <div className={`stat-icon ${item.color}`}>
                    <Icon size={22} />
                  </div>

                  <div className="stat-information">
                    <span>{item.title}</span>
                    <h2>{item.value}</h2>
                    <p>{item.description}</p>
                  </div>

                  <ArrowUpRight className="stat-arrow" size={18} />
                </button>
              );
            })}
          </section>

          {/* Agenda y actividad */}
          <section className="dashboard-panels">
            <article className="dashboard-panel appointments-panel">
              <div className="panel-heading">
                <div>
                  <h2>Próximas citas</h2>
                  <p>
                    {todayAppointments.length > 0
                      ? "Agenda de atención de hoy"
                      : "Próximas citas programadas"}
                  </p>
                </div>

                <button
                  type="button"
                  className="panel-action"
                  onClick={() => navigate("/appointments")}
                >
                  Ver agenda
                  <ArrowUpRight size={16} />
                </button>
              </div>

              <div className="appointments-list">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <div
                      className="appointment-item"
                      key={appointment.id}
                    >
                      <div className="appointment-time">
                        <Clock size={15} />
                        <span>{appointment.time}</span>
                      </div>

                      <div className="appointment-pet">
                        <strong>{appointment.pet}</strong>
                        <span>{appointment.owner}</span>
                        <small>{appointment.service}</small>
                      </div>

                      <span
                        className={`appointment-status ${
                          appointment.rawStatus === "CONFIRMED"
                            ? "confirmed"
                            : "pending"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="dashboard-empty-message">
                    {loading
                      ? "Cargando citas..."
                      : "No hay citas próximas programadas."}
                  </p>
                )}
              </div>
            </article>

            <article className="dashboard-panel activity-panel">
              <div className="panel-heading">
                <div>
                  <h2>Actividad reciente</h2>
                  <p>Últimos movimientos en el sistema</p>
                </div>
              </div>

              <div className="activity-list">
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => {
                    const Icon = activity.icon;

                    return (
                      <div className="activity-item" key={activity.id}>
                        <div className="activity-icon">
                          <Icon size={18} />
                        </div>

                        <div className="activity-information">
                          <strong>{activity.title}</strong>
                          <p>{activity.description}</p>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="dashboard-empty-message">
                    {loading
                      ? "Cargando actividad..."
                      : "No hay movimientos recientes."}
                  </p>
                )}
              </div>
            </article>
          </section>

          {/* Accesos rápidos */}
          <section className="quick-access-section">
            <div className="panel-heading">
              <div>
                <h2>Accesos rápidos</h2>
                <p>Acciones frecuentes</p>
              </div>
            </div>

            <div className="quick-access-grid">
              {quickAccess.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    type="button"
                    className="quick-access-card"
                    key={item.title}
                    onClick={() => navigate(item.path)}
                  >
                    <div className={`quick-icon ${item.color}`}>
                      <Icon size={21} />
                    </div>

                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </div>

                    <ArrowUpRight className="quick-access-arrow" size={17} />
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;