
import { useState } from "react";
import {
  CalendarDays,
  List,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Clock,
  PawPrint,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import "./Appointments.css";

const demoAppointments = [
  {
    id: 1,
    day: 23,
    time: "09:00",
    pet: "Max",
    owner: "Carlos Mendoza",
    service: "Consulta general",
    veterinarian: "Dr. García",
    status: "CONFIRMED",
  },
  {
    id: 2,
    day: 23,
    time: "11:30",
    pet: "Luna",
    owner: "María González",
    service: "Vacunación",
    veterinarian: "Dr. García",
    status: "PENDING",
  },
  {
    id: 3,
    day: 25,
    time: "10:00",
    pet: "Rocky",
    owner: "Ana Martínez",
    service: "Revisión médica",
    veterinarian: "Dra. López",
    status: "CONFIRMED",
  },
  {
    id: 4,
    day: 27,
    time: "12:00",
    pet: "Milo",
    owner: "José Ramírez",
    service: "Desparasitación",
    veterinarian: "Dr. García",
    status: "CANCELLED",
  },
];

const statusLabels = {
  CONFIRMED: "Confirmada",
  PENDING: "Pendiente",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistió",
};

function Appointments() {
  const [role] = useState("VETERINARIAN");
  const [view, setView] = useState("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [search, setSearch] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // La semana comienza en lunes.
  const startingDay = (firstDay + 6) % 7;

  const monthName = new Intl.DateTimeFormat("es-MX", {
    month: "long",
    year: "numeric",
  }).format(currentDate);

  const changeMonth = (amount) => {
    const nextDate = new Date(year, month + amount, 1);
    setCurrentDate(nextDate);
    setSelectedDay(1);
  };

  const filteredAppointments = demoAppointments.filter((appointment) => {
    const text = `${appointment.pet} ${appointment.owner} ${appointment.service}`
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const selectedAppointments = filteredAppointments.filter(
    (appointment) => appointment.day === selectedDay
  );

  const getAppointmentsForDay = (day) =>
    demoAppointments.filter(
      (appointment) => appointment.day === day
    ).length;

  const todayAppointments = filteredAppointments.filter(
    (appointment) => appointment.day === selectedDay
  );

  return (
    <div className="appointments-layout">
      <Sidebar role={role} />

      <main className="appointments-main">

        <header className="appointments-topbar">
          <div className="appointments-breadcrumb">
            <span>VetCare</span>
            <span>/</span>
            <strong>Citas</strong>
          </div>

          <div className="appointments-user">
            <div className="user-avatar">V</div>
            <div>
              <strong>Personal veterinario</strong>
              <span>Veterinario</span>
            </div>
          </div>
        </header>

        <div className="appointments-content">

          <section className="appointments-heading">
            <div>
              <span className="appointments-subtitle">
                GESTIÓN DE CITAS
              </span>
              <h1>Agenda de citas</h1>
              <p>
                Consulta y administra las citas de tus pacientes.
              </p>
            </div>

            <button className="new-appointment-button" type="button">
              <Plus size={18} />
              Nueva cita
            </button>
          </section>

          <section className="appointments-toolbar">

            <div className="appointments-view-switch">
              <button
                type="button"
                className={view === "calendar" ? "selected" : ""}
                onClick={() => setView("calendar")}
              >
                <CalendarDays size={17} />
                Calendario
              </button>

              <button
                type="button"
                className={view === "list" ? "selected" : ""}
                onClick={() => setView("list")}
              >
                <List size={17} />
                Lista
              </button>
            </div>

            <div className="appointments-search">
              <Search size={17} />
              <input
                type="text"
                placeholder="Buscar mascota, cliente o servicio..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

          </section>

          {view === "calendar" ? (
            <section className="calendar-container">

              <div className="calendar-header">
                <div>
                  <h2>
                    {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                  </h2>
                  <p>Selecciona un día para consultar sus citas.</p>
                </div>

                <div className="calendar-navigation">
                  <button
                    type="button"
                    onClick={() => changeMonth(-1)}
                    aria-label="Mes anterior"
                  >
                    <ChevronLeft size={19} />
                  </button>

                  <button
                    type="button"
                    onClick={() => changeMonth(1)}
                    aria-label="Mes siguiente"
                  >
                    <ChevronRight size={19} />
                  </button>
                </div>
              </div>

              <div className="calendar-grid">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                  (day) => (
                    <div className="calendar-weekday" key={day}>
                      {day}
                    </div>
                  )
                )}

                {Array.from({ length: startingDay }, (_, index) => (
                  <div className="calendar-day empty" key={`empty-${index}`} />
                ))}

                {Array.from({ length: daysInMonth }, (_, index) => {
                  const day = index + 1;
                  const count = getAppointmentsForDay(day);

                  return (
                    <button
                      type="button"
                      key={day}
                      className={`calendar-day ${
                        selectedDay === day ? "active-day" : ""
                      }`}
                      onClick={() => setSelectedDay(day)}
                    >
                      <span>{day}</span>

                      {count > 0 && (
                        <small>
                          {count} {count === 1 ? "cita" : "citas"}
                        </small>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="selected-day-appointments">
                <div className="selected-day-heading">
                  <div>
                    <h3>Citas del {selectedDay} de {monthName}</h3>
                    <p>{selectedAppointments.length} citas encontradas</p>
                  </div>
                </div>

                {todayAppointments.length > 0 ? (
                  todayAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))
                ) : (
                  <div className="empty-appointments">
                    No hay citas para este día.
                  </div>
                )}
              </div>

            </section>
          ) : (
            <section className="appointments-list-container">

              <div className="calendar-header">
                <div>
                  <h2>Todas las citas</h2>
                  <p>Listado de citas registradas.</p>
                </div>
              </div>

              <div className="appointments-table-wrapper">
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>Hora</th>
                      <th>Mascota</th>
                      <th>Propietario</th>
                      <th>Servicio</th>
                      <th>Veterinario</th>
                      <th>Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.time}</td>
                        <td><strong>{appointment.pet}</strong></td>
                        <td>{appointment.owner}</td>
                        <td>{appointment.service}</td>
                        <td>{appointment.veterinarian}</td>
                        <td>
                          <AppointmentStatus status={appointment.status} />
                        </td>
                      </tr>
                    ))}

                    {filteredAppointments.length === 0 && (
                      <tr>
                        <td colSpan="6" className="empty-table">
                          No se encontraron citas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </section>
          )}

        </div>
      </main>
    </div>
  );
}

function AppointmentStatus({ status }) {
  return (
    <span className={`appointment-badge ${status.toLowerCase()}`}>
      {statusLabels[status]}
    </span>
  );
}

function AppointmentCard({ appointment }) {
  return (
    <article className="appointment-card">
      <div className="appointment-card-time">
        <Clock size={17} />
        <strong>{appointment.time}</strong>
      </div>

      <div className="appointment-card-pet">
        <div className="appointment-paw">
          <PawPrint size={19} />
        </div>

        <div>
          <strong>{appointment.pet}</strong>
          <span>{appointment.owner}</span>
          <small>{appointment.service}</small>
        </div>
      </div>

      <div className="appointment-card-vet">
        <span>Veterinario</span>
        <strong>{appointment.veterinarian}</strong>
      </div>

      <AppointmentStatus status={appointment.status} />
    </article>
  );
}

export default Appointments;
