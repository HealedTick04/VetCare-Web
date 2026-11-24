
import { useMemo, useState } from "react";
import {
  CalendarDays,
  List,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Clock,
  PawPrint,
  Eye,
  Pencil,
  Ban,
  CheckCircle2,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Modal from "../../components/common/Modal";
import "./Appointments.css";

function getDateString(year, month, day) {
  const date = new Date(year, month, day);
  const formattedYear = date.getFullYear();
  const formattedMonth = String(date.getMonth() + 1).padStart(2, "0");
  const formattedDay = String(date.getDate()).padStart(2, "0");

  return `${formattedYear}-${formattedMonth}-${formattedDay}`;
}

function getTodayDate() {
  const today = new Date();
  return getDateString(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
}

function formatDate(dateString) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

const demoAppointments = [
  {
    id: 1,
    date: getDateString(currentYear, currentMonth, 23),
    time: "09:00",
    pet: "Max",
    owner: "Carlos Mendoza",
    service: "Consulta general",
    veterinarian: "Dr. García",
    status: "CONFIRMED",
    notes: "Revisión general de rutina.",
  },
  {
    id: 2,
    date: getDateString(currentYear, currentMonth, 23),
    time: "11:30",
    pet: "Luna",
    owner: "María González",
    service: "Vacunación",
    veterinarian: "Dr. García",
    status: "PENDING",
    notes: "",
  },
  {
    id: 3,
    date: getDateString(currentYear, currentMonth, 25),
    time: "10:00",
    pet: "Rocky",
    owner: "Ana Martínez",
    service: "Revisión médica",
    veterinarian: "Dra. López",
    status: "CONFIRMED",
    notes: "",
  },
  {
    id: 4,
    date: getDateString(currentYear, currentMonth, 27),
    time: "12:00",
    pet: "Milo",
    owner: "José Ramírez",
    service: "Desparasitación",
    veterinarian: "Dr. García",
    status: "CANCELLED",
    notes: "",
  },
];

const statusLabels = {
  CONFIRMED: "Confirmada",
  PENDING: "Pendiente",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistió",
};

const emptyForm = {
  date: getTodayDate(),
  time: "09:00",
  pet: "",
  owner: "",
  service: "Consulta general",
  veterinarian: "Dr. García",
  status: "PENDING",
  notes: "",
};

const veterinarians = ["Dr. García", "Dra. López", "Dr. Hernández"];

function Appointments() {
  const [role] = useState("VETERINARIAN");
  const [appointments, setAppointments] = useState(demoAppointments);
  const [view, setView] = useState("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
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

  const filteredAppointments = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return appointments
      .filter((appointment) => {
        const text = [
          appointment.pet,
          appointment.owner,
          appointment.service,
          appointment.veterinarian,
          appointment.time,
          formatDate(appointment.date),
        ]
          .join(" ")
          .toLowerCase();

        return text.includes(searchText);
      })
      .sort((a, b) => {
        const dateComparison = a.date.localeCompare(b.date);

        return dateComparison !== 0
          ? dateComparison
          : a.time.localeCompare(b.time);
      });
  }, [appointments, search]);

  const selectedDate = getDateString(year, month, selectedDay);

  const selectedAppointments = filteredAppointments.filter(
    (appointment) => appointment.date === selectedDate
  );

  const getAppointmentsForDay = (day) => {
    const date = getDateString(year, month, day);

    return appointments.filter(
      (appointment) => appointment.date === date
    ).length;
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedAppointment(null);
    setFormData({
      ...emptyForm,
      date: selectedDate,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openViewModal = (appointment) => {
    setModalMode("view");
    setSelectedAppointment(appointment);
    setFormData({
      date: appointment.date,
      time: appointment.time,
      pet: appointment.pet,
      owner: appointment.owner,
      service: appointment.service,
      veterinarian: appointment.veterinarian,
      status: appointment.status,
      notes: appointment.notes || "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (appointment) => {
    setModalMode("edit");
    setSelectedAppointment(appointment);
    setFormData({
      date: appointment.date,
      time: appointment.time,
      pet: appointment.pet,
      owner: appointment.owner,
      service: appointment.service,
      veterinarian: appointment.veterinarian,
      status: appointment.status,
      notes: appointment.notes || "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
    setFormError("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.date ||
      !formData.time ||
      !formData.pet.trim() ||
      !formData.owner.trim() ||
      !formData.service.trim() ||
      !formData.veterinarian
    ) {
      setFormError("Completa todos los campos obligatorios.");
      return;
    }

    const hasConflict = appointments.some(
      (appointment) =>
        appointment.id !== selectedAppointment?.id &&
        appointment.date === formData.date &&
        appointment.time === formData.time &&
        appointment.veterinarian === formData.veterinarian &&
        appointment.status !== "CANCELLED"
    );

    if (hasConflict) {
      setFormError(
        "Este veterinario ya tiene una cita asignada en esa fecha y hora."
      );
      return;
    }

    const appointmentData = {
      ...formData,
      pet: formData.pet.trim(),
      owner: formData.owner.trim(),
      service: formData.service.trim(),
      notes: formData.notes.trim(),
    };

    if (modalMode === "create") {
      setAppointments((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...appointmentData,
        },
      ]);
    }

    if (modalMode === "edit" && selectedAppointment) {
      setAppointments((previous) =>
        previous.map((appointment) =>
          appointment.id === selectedAppointment.id
            ? { ...appointment, ...appointmentData }
            : appointment
        )
      );
    }

    const [selectedYear, selectedMonth, selectedDateDay] =
      appointmentData.date.split("-").map(Number);

    setCurrentDate(new Date(selectedYear, selectedMonth - 1, 1));
    setSelectedDay(selectedDateDay);

    closeModal();
  };

  const handleCancel = (appointment) => {
    const confirmed = window.confirm(
      `¿Deseas cancelar la cita de ${appointment.pet}?`
    );

    if (!confirmed) return;

    setAppointments((previous) =>
      previous.map((item) =>
        item.id === appointment.id
          ? { ...item, status: "CANCELLED" }
          : item
      )
    );
  };

  const handleComplete = (appointment) => {
    const confirmed = window.confirm(
      `¿Marcar como completada la cita de ${appointment.pet}?`
    );

    if (!confirmed) return;

    setAppointments((previous) =>
      previous.map((item) =>
        item.id === appointment.id
          ? { ...item, status: "COMPLETED" }
          : item
      )
    );
  };

  const modalTitle =
    modalMode === "create"
      ? "Nueva cita"
      : modalMode === "edit"
        ? "Editar cita"
        : "Detalles de la cita";

  const renderAppointmentActions = (appointment) => (
    <div className="appointment-actions">
      <button
        type="button"
        title="Ver cita"
        onClick={() => openViewModal(appointment)}
      >
        <Eye size={16} />
      </button>

      <button
        type="button"
        title="Editar cita"
        onClick={() => openEditModal(appointment)}
      >
        <Pencil size={16} />
      </button>

      {appointment.status !== "CANCELLED" &&
        appointment.status !== "COMPLETED" && (
          <>
            <button
              type="button"
              title="Marcar como completada"
              className="appointment-complete-action"
              onClick={() => handleComplete(appointment)}
            >
              <CheckCircle2 size={16} />
            </button>

            <button
              type="button"
              title="Cancelar cita"
              className="appointment-cancel-action"
              onClick={() => handleCancel(appointment)}
            >
              <Ban size={16} />
            </button>
          </>
        )}
    </div>
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

            <button
              className="new-appointment-button"
              type="button"
              onClick={openCreateModal}
            >
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
                    {monthName.charAt(0).toUpperCase() +
                      monthName.slice(1)}
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
                  <div
                    className="calendar-day empty"
                    key={`empty-${index}`}
                  />
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
                    <h3>
                      Citas del {selectedDay} de {monthName}
                    </h3>
                    <p>
                      {selectedAppointments.length} citas encontradas
                    </p>
                  </div>

                  <button
                    type="button"
                    className="appointment-day-add"
                    onClick={openCreateModal}
                  >
                    <Plus size={16} />
                    Agregar cita
                  </button>
                </div>

                {selectedAppointments.length > 0 ? (
                  selectedAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      actions={renderAppointmentActions(appointment)}
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
                  <p>
                    Listado de {filteredAppointments.length} citas
                    registradas.
                  </p>
                </div>
              </div>

              <div className="appointments-table-wrapper">
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Mascota</th>
                      <th>Propietario</th>
                      <th>Servicio</th>
                      <th>Veterinario</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{formatDate(appointment.date)}</td>
                        <td>{appointment.time}</td>
                        <td>
                          <strong>{appointment.pet}</strong>
                        </td>
                        <td>{appointment.owner}</td>
                        <td>{appointment.service}</td>
                        <td>{appointment.veterinarian}</td>
                        <td>
                          <AppointmentStatus
                            status={appointment.status}
                          />
                        </td>
                        <td>
                          {renderAppointmentActions(appointment)}
                        </td>
                      </tr>
                    ))}

                    {filteredAppointments.length === 0 && (
                      <tr>
                        <td colSpan="8" className="empty-table">
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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        description={
          modalMode === "view"
            ? "Consulta la información de la cita seleccionada."
            : "Completa la información para programar la cita."
        }
        size="large"
        footer={
          <>
            <button
              type="button"
              className="appointment-secondary-button"
              onClick={closeModal}
            >
              {modalMode === "view" ? "Cerrar" : "Cancelar"}
            </button>

            {modalMode !== "view" && (
              <button
                type="submit"
                form="appointment-form"
                className="new-appointment-button"
              >
                {modalMode === "create"
                  ? "Guardar cita"
                  : "Guardar cambios"}
              </button>
            )}
          </>
        }
      >
        <form
          id="appointment-form"
          onSubmit={handleSubmit}
          className="appointment-form"
        >
          <div className="appointment-form-grid">
            <div className="appointment-form-field">
              <label>Fecha *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                disabled={modalMode === "view"}
              />
            </div>

            <div className="appointment-form-field">
              <label>Hora *</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                disabled={modalMode === "view"}
              />
            </div>

            <div className="appointment-form-field">
              <label>Nombre de la mascota *</label>
              <input
                type="text"
                name="pet"
                value={formData.pet}
                onChange={handleInputChange}
                placeholder="Ej. Max"
                disabled={modalMode === "view"}
              />
            </div>

            <div className="appointment-form-field">
              <label>Propietario *</label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                placeholder="Nombre del propietario"
                disabled={modalMode === "view"}
              />
            </div>

            <div className="appointment-form-field">
              <label>Servicio *</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                disabled={modalMode === "view"}
              >
                <option value="Consulta general">Consulta general</option>
                <option value="Vacunación">Vacunación</option>
                <option value="Revisión médica">Revisión médica</option>
                <option value="Desparasitación">Desparasitación</option>
                <option value="Estética">Estética</option>
                <option value="Cirugía">Cirugía</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="appointment-form-field">
              <label>Veterinario *</label>
              <select
                name="veterinarian"
                value={formData.veterinarian}
                onChange={handleInputChange}
                disabled={modalMode === "view"}
              >
                {veterinarians.map((veterinarian) => (
                  <option key={veterinarian} value={veterinarian}>
                    {veterinarian}
                  </option>
                ))}
              </select>
            </div>

            <div className="appointment-form-field">
              <label>Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={modalMode === "view"}
              >
                <option value="PENDING">Pendiente</option>
                <option value="CONFIRMED">Confirmada</option>
                <option value="COMPLETED">Completada</option>
                <option value="CANCELLED">Cancelada</option>
                <option value="NO_SHOW">No asistió</option>
              </select>
            </div>

            <div className="appointment-form-field appointment-form-full">
              <label>Observaciones</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Información adicional sobre la cita..."
                disabled={modalMode === "view"}
              />
            </div>
          </div>

          {formError && (
            <p className="appointment-form-error">{formError}</p>
          )}
        </form>
      </Modal>
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

function AppointmentCard({ appointment, actions }) {
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

      {actions}
    </article>
  );
}

export default Appointments;

