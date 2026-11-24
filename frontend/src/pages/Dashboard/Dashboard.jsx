
import { useState } from "react";
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
import "./Dashboard.css";

const appointments = [
  {
    time: "09:00",
    pet: "Max",
    owner: "Carlos Mendoza",
    service: "Consulta general",
    status: "Confirmada",
  },
  {
    time: "10:30",
    pet: "Luna",
    owner: "María González",
    service: "Vacunación",
    status: "Pendiente",
  },
  {
    time: "12:00",
    pet: "Rocky",
    owner: "Ana Martínez",
    service: "Revisión médica",
    status: "Confirmada",
  },
  {
    time: "13:30",
    pet: "Milo",
    owner: "José Ramírez",
    service: "Desparasitación",
    status: "Pendiente",
  },
];

const activities = [
  {
    title: "Nueva mascota registrada",
    description: "Max fue registrado en el sistema.",
    time: "Hace 15 minutos",
    icon: PawPrint,
  },
  {
    title: "Cita confirmada",
    description: "La cita de Luna fue confirmada.",
    time: "Hace 40 minutos",
    icon: CalendarDays,
  },
  {
    title: "Nuevo expediente médico",
    description: "Se creó un expediente para Rocky.",
    time: "Hace 1 hora",
    icon: FileText,
  },
];

function Dashboard() {
  const [role] = useState("VETERINARIAN");

  const currentDate = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const statistics = [
    {
      title: "Citas de hoy",
      value: "08",
      description: "Citas programadas",
      icon: CalendarDays,
      color: "blue",
    },
    {
      title: "Mascotas",
      value: "124",
      description: "Pacientes registrados",
      icon: PawPrint,
      color: "green",
    },
    {
      title: "Clientes",
      value: "86",
      description: "Propietarios registrados",
      icon: Users,
      color: "purple",
    },
    {
      title: "Consultas realizadas",
      value: "12",
      description: "Durante esta semana",
      icon: Stethoscope,
      color: "orange",
    },
  ];

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
              placeholder="Buscar en VetCare..."
            />
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="notification-button"
              aria-label="Notificaciones"
            >
              <Bell size={20} />
              <span className="notification-indicator"></span>
            </button>

            <div className="topbar-user">
              <div className="user-avatar">V</div>
              <div>
                <strong>Personal veterinario</strong>
                <span>Veterinario</span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <div className="dashboard-content">

          <section className="dashboard-welcome">
            <div>
              <span className="dashboard-date">{currentDate}</span>
              <h1>¡Buen día!</h1>
              <p>
                Aquí tienes un resumen de la actividad de tu clínica.
              </p>
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
                <article className="stat-card" key={item.title}>
                  <div className={`stat-icon ${item.color}`}>
                    <Icon size={22} />
                  </div>

                  <div className="stat-information">
                    <span>{item.title}</span>
                    <h2>{item.value}</h2>
                    <p>{item.description}</p>
                  </div>

                  <ArrowUpRight className="stat-arrow" size={18} />
                </article>
              );
            })}
          </section>

          {/* Agenda y actividad */}
          <section className="dashboard-panels">

            <article className="dashboard-panel appointments-panel">
              <div className="panel-heading">
                <div>
                  <h2>Próximas citas</h2>
                  <p>Agenda de atención de hoy</p>
                </div>

                <button type="button" className="panel-action">
                  Ver agenda
                  <ArrowUpRight size={16} />
                </button>
              </div>

              <div className="appointments-list">
                {appointments.map((appointment) => (
                  <div
                    className="appointment-item"
                    key={`${appointment.time}-${appointment.pet}`}
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
                        appointment.status === "Confirmada"
                          ? "confirmed"
                          : "pending"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="dashboard-panel activity-panel">
              <div className="panel-heading">
                <div>
                  <h2>Actividad reciente</h2>
                  <p>Últimos movimientos</p>
                </div>
              </div>

              <div className="activity-list">
                {activities.map((activity) => {
                  const Icon = activity.icon;

                  return (
                    <div className="activity-item" key={activity.title}>
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
                })}
              </div>
            </article>

          </section>

          {/* Accesos rápidos */}
          <section className="quick-access-section">
            <div className="panel-heading">
              <div>
                <h2>Accesos rápidos</h2>
                <p>Acciones frecuentes del personal</p>
              </div>
            </div>

            <div className="quick-access-grid">
              <article className="quick-access-card">
                <div className="quick-icon blue">
                  <UserPlus size={21} />
                </div>
                <div>
                  <strong>Registrar cliente</strong>
                  <span>Agregar un propietario</span>
                </div>
              </article>

              <article className="quick-access-card">
                <div className="quick-icon green">
                  <PawPrint size={21} />
                </div>
                <div>
                  <strong>Registrar mascota</strong>
                  <span>Agregar un paciente</span>
                </div>
              </article>

              <article className="quick-access-card">
                <div className="quick-icon purple">
                  <CalendarPlus size={21} />
                </div>
                <div>
                  <strong>Agendar cita</strong>
                  <span>Programar una consulta</span>
                </div>
              </article>

              <article className="quick-access-card">
                <div className="quick-icon orange">
                  <ClipboardList size={21} />
                </div>
                <div>
                  <strong>Nuevo expediente</strong>
                  <span>Registrar una consulta</span>
                </div>
              </article>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;
