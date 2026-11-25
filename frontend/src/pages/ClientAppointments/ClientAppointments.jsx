
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  PawPrint,
  Stethoscope,
  ClipboardList,
  Send,
  X,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
} from "lucide-react";

import ClientSidebar from "../../components/layout/ClientSidebar";
import "./ClientAppointments.css";

const demoPets = [
  {
    id: 1,
    name: "Max",
    species: "Perro",
    breed: "Golden Retriever",
    age: "4 años",
  },
  {
    id: 2,
    name: "Luna",
    species: "Gato",
    breed: "Doméstico",
    age: "2 años",
  },
];

const demoServices = [
  { id: 1, name: "Consulta general", duration: "30 minutos" },
  { id: 2, name: "Vacunación", duration: "20 minutos" },
  { id: 3, name: "Desparasitación", duration: "20 minutos" },
  { id: 4, name: "Consulta dermatológica", duration: "40 minutos" },
  { id: 5, name: "Consulta especializada", duration: "45 minutos" },
  { id: 6, name: "Revisión de seguimiento", duration: "20 minutos" },
];

const demoAppointments = [
  {
    id: 1,
    petId: 1,
    petName: "Max",
    service: "Consulta general",
    date: "2026-11-28",
    time: "10:30",
    reason: "Ha presentado falta de apetito durante los últimos días.",
    status: "PENDING",
    createdAt: "2026-11-23",
  },
  {
    id: 2,
    petId: 2,
    petName: "Luna",
    service: "Vacunación",
    date: "2026-11-20",
    time: "12:00",
    reason: "Aplicación de vacuna correspondiente.",
    status: "CONFIRMED",
    createdAt: "2026-11-18",
  },
  {
    id: 3,
    petId: 1,
    petName: "Max",
    service: "Desparasitación",
    date: "2026-11-15",
    time: "09:00",
    reason: "Desparasitación periódica.",
    status: "CANCELLED",
    createdAt: "2026-11-10",
  },
];

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (date) => {
  if (!date) return "Sin fecha";

  return new Date(`${date}T12:00:00`).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getStatusInfo = (status) => {
  const statuses = {
    PENDING: {
      label: "Pendiente de confirmación",
      className: "pending",
      icon: AlertCircle,
    },
    CONFIRMED: {
      label: "Confirmada",
      className: "confirmed",
      icon: CheckCircle,
    },
    REJECTED: {
      label: "Rechazada",
      className: "rejected",
      icon: XCircle,
    },
    CANCELLED: {
      label: "Cancelada",
      className: "cancelled",
      icon: XCircle,
    },
  };

  return statuses[status] || statuses.PENDING;
};

function ClientAppointments() {
  const [appointments, setAppointments] = useState(demoAppointments);

  const [formData, setFormData] = useState({
    petId: "",
    serviceId: "",
    date: "",
    time: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  const today = getToday();

  const filteredAppointments = useMemo(() => {
    if (selectedFilter === "ALL") {
      return appointments;
    }

    return appointments.filter(
      (appointment) => appointment.status === selectedFilter
    );
  }, [appointments, selectedFilter]);

  const pendingCount = appointments.filter(
    (appointment) => appointment.status === "PENDING"
  ).length;

  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === "CONFIRMED"
  ).length;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.petId) {
      newErrors.petId = "Selecciona una mascota.";
    }

    if (!formData.serviceId) {
      newErrors.serviceId = "Selecciona un servicio.";
    }

    if (!formData.date) {
      newErrors.date = "Selecciona una fecha.";
    } else if (formData.date < today) {
      newErrors.date = "La fecha no puede ser anterior a hoy.";
    }

    if (!formData.time) {
      newErrors.time = "Propón una hora para la cita.";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Describe brevemente el motivo de la consulta.";
    } else if (formData.reason.trim().length < 10) {
      newErrors.reason = "Escribe al menos 10 caracteres.";
    } else if (formData.reason.trim().length > 500) {
      newErrors.reason = "El motivo no puede superar los 500 caracteres.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      petId: "",
      serviceId: "",
      date: "",
      time: "",
      reason: "",
    });

    setErrors({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    const selectedPet = demoPets.find(
      (pet) => pet.id === Number(formData.petId)
    );

    const selectedService = demoServices.find(
      (service) => service.id === Number(formData.serviceId)
    );

    const newAppointment = {
      id: Date.now(),
      petId: selectedPet.id,
      petName: selectedPet.name,
      service: selectedService.name,
      date: formData.date,
      time: formData.time,
      reason: formData.reason.trim(),
      status: "PENDING",
      createdAt: today,
    };

    setAppointments((previous) => [
      newAppointment,
      ...previous,
    ]);

    resetForm();

    setSelectedFilter("ALL");

    setSuccessMessage(
      "Tu solicitud se ha registrado correctamente. La clínica deberá confirmar la fecha y hora propuestas."
    );
  };

  const handleCancel = (appointmentId) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas cancelar esta solicitud?"
    );

    if (!confirmed) return;

    setAppointments((previous) =>
      previous.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, status: "CANCELLED" }
          : appointment
      )
    );
  };

  return (
    <div className="client-appointments-layout">
      <ClientSidebar />

      <main className="client-appointments-main">
        <header className="client-appointments-header">
          <div>
            <span className="client-appointments-eyebrow">
              ATENCIÓN VETERINARIA
            </span>

            <h1>Solicitar cita</h1>

            <p>
              Propón una fecha y hora para que nuestra clínica
              pueda revisar y confirmar tu solicitud.
            </p>
          </div>
        </header>

        <section className="client-appointments-stats">
          <article className="client-appointment-stat-card">
            <div className="client-appointment-stat-icon blue">
              <ClipboardList size={22} />
            </div>

            <div>
              <span>Solicitudes registradas</span>
              <strong>{appointments.length}</strong>
            </div>
          </article>

          <article className="client-appointment-stat-card">
            <div className="client-appointment-stat-icon orange">
              <Clock size={22} />
            </div>

            <div>
              <span>Pendientes</span>
              <strong>{pendingCount}</strong>
            </div>
          </article>

          <article className="client-appointment-stat-card">
            <div className="client-appointment-stat-icon green">
              <CheckCircle size={22} />
            </div>

            <div>
              <span>Confirmadas</span>
              <strong>{confirmedCount}</strong>
            </div>
          </article>
        </section>

        <section className="client-appointment-content">
          <div className="client-appointment-form-card">
            <div className="client-appointment-section-heading">
              <div className="client-appointment-heading-icon">
                <CalendarDays size={21} />
              </div>

              <div>
                <h2>Nueva solicitud</h2>
                <p>Completa los datos para solicitar tu cita.</p>
              </div>
            </div>

            <div className="client-appointment-notice">
              <AlertCircle size={19} />

              <p>
                La fecha y hora que selecciones son una propuesta.
                La cita no quedará confirmada hasta que la clínica
                revise tu solicitud.
              </p>
            </div>

            {successMessage && (
              <div className="client-appointment-success">
                <CheckCircle size={19} />
                <span>{successMessage}</span>
              </div>
            )}

            <form
              className="client-appointment-form"
              onSubmit={handleSubmit}
            >
              <div className="client-appointment-field">
                <label htmlFor="petId">
                  Mascota <span>*</span>
                </label>

                <div className="client-appointment-input-wrapper">
                  <PawPrint size={18} />

                  <select
                    id="petId"
                    name="petId"
                    value={formData.petId}
                    onChange={handleChange}
                    className={errors.petId ? "input-error" : ""}
                  >
                    <option value="">Selecciona una mascota</option>

                    {demoPets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name} - {pet.species} ({pet.breed})
                      </option>
                    ))}
                  </select>
                </div>

                {errors.petId && (
                  <small className="client-appointment-error">
                    {errors.petId}
                  </small>
                )}
              </div>

              <div className="client-appointment-field">
                <label htmlFor="serviceId">
                  Servicio veterinario <span>*</span>
                </label>

                <div className="client-appointment-input-wrapper">
                  <Stethoscope size={18} />

                  <select
                    id="serviceId"
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    className={errors.serviceId ? "input-error" : ""}
                  >
                    <option value="">Selecciona un servicio</option>

                    {demoServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - {service.duration}
                      </option>
                    ))}
                  </select>
                </div>

                {errors.serviceId && (
                  <small className="client-appointment-error">
                    {errors.serviceId}
                  </small>
                )}
              </div>

              <div className="client-appointment-form-row">
                <div className="client-appointment-field">
                  <label htmlFor="date">
                    Fecha propuesta <span>*</span>
                  </label>

                  <div className="client-appointment-input-wrapper">
                    <CalendarDays size={18} />

                    <input
                      id="date"
                      type="date"
                      name="date"
                      min={today}
                      value={formData.date}
                      onChange={handleChange}
                      className={errors.date ? "input-error" : ""}
                    />
                  </div>

                  {errors.date && (
                    <small className="client-appointment-error">
                      {errors.date}
                    </small>
                  )}
                </div>

                <div className="client-appointment-field">
                  <label htmlFor="time">
                    Hora propuesta <span>*</span>
                  </label>

                  <div className="client-appointment-input-wrapper">
                    <Clock size={18} />

                    <input
                      id="time"
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className={errors.time ? "input-error" : ""}
                    />
                  </div>

                  {errors.time && (
                    <small className="client-appointment-error">
                      {errors.time}
                    </small>
                  )}
                </div>
              </div>

              <div className="client-appointment-field">
                <label htmlFor="reason">
                  Motivo de la consulta <span>*</span>
                </label>

                <div className="client-appointment-input-wrapper textarea-wrapper">
                  <FileText size={18} />

                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Describe brevemente qué necesita tu mascota..."
                    rows={4}
                    maxLength={500}
                    className={errors.reason ? "input-error" : ""}
                  />
                </div>

                <div className="client-appointment-textarea-footer">
                  {errors.reason ? (
                    <small className="client-appointment-error">
                      {errors.reason}
                    </small>
                  ) : (
                    <small>
                      Describe el motivo para que la clínica
                      pueda preparar la atención.
                    </small>
                  )}

                  <small>{formData.reason.length}/500</small>
                </div>
              </div>

              <div className="client-appointment-form-actions">
                <button
                  type="button"
                  className="client-appointment-reset-button"
                  onClick={resetForm}
                >
                  Limpiar
                </button>

                <button
                  type="submit"
                  className="client-appointment-submit-button"
                >
                  <Send size={17} />
                  Enviar solicitud
                </button>
              </div>
            </form>
          </div>

          <aside className="client-appointment-help-card">
            <div className="client-appointment-help-icon">
              <Stethoscope size={25} />
            </div>

            <h3>¿Cómo funciona?</h3>

            <div className="client-appointment-steps">
              <div className="client-appointment-step">
                <span>1</span>
                <div>
                  <strong>Envía tu propuesta</strong>
                  <p>
                    Selecciona a tu mascota, el servicio y
                    el horario que prefieras.
                  </p>
                </div>
              </div>

              <div className="client-appointment-step">
                <span>2</span>
                <div>
                  <strong>Revisión de la clínica</strong>
                  <p>
                    El personal revisará la disponibilidad
                    y los datos de tu solicitud.
                  </p>
                </div>
              </div>

              <div className="client-appointment-step">
                <span>3</span>
                <div>
                  <strong>Confirmación</strong>
                  <p>
                    Podrás consultar el estado actualizado
                    de tu solicitud desde esta página.
                  </p>
                </div>
              </div>
            </div>

            <div className="client-appointment-help-note">
              <AlertCircle size={17} />
              <p>
                Enviar una solicitud no garantiza que el horario
                propuesto esté disponible.
              </p>
            </div>
          </aside>
        </section>

        <section className="client-appointment-history">
          <div className="client-appointment-history-header">
            <div>
              <h2>Mis solicitudes</h2>
              <p>
                Consulta el estado de las citas que has solicitado.
              </p>
            </div>

            <div className="client-appointment-filter">
              <select
                value={selectedFilter}
                onChange={(event) => setSelectedFilter(event.target.value)}
                aria-label="Filtrar solicitudes"
              >
                <option value="ALL">Todas</option>
                <option value="PENDING">Pendientes</option>
                <option value="CONFIRMED">Confirmadas</option>
                <option value="REJECTED">Rechazadas</option>
                <option value="CANCELLED">Canceladas</option>
              </select>
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="client-appointment-empty">
              <ClipboardList size={35} />
              <h3>No hay solicitudes</h3>
              <p>
                No tienes solicitudes registradas con este estado.
              </p>
            </div>
          ) : (
            <div className="client-appointment-list">
              {filteredAppointments.map((appointment) => {
                const status = getStatusInfo(appointment.status);
                const StatusIcon = status.icon;

                return (
                  <article
                    className="client-appointment-history-card"
                    key={appointment.id}
                  >
                    <div className="client-appointment-history-main">
                      <div className="client-appointment-pet-icon">
                        <PawPrint size={22} />
                      </div>

                      <div className="client-appointment-history-info">
                        <div className="client-appointment-history-title">
                          <h3>{appointment.service}</h3>

                          <span
                            className={`client-appointment-status ${status.className}`}
                          >
                            <StatusIcon size={14} />
                            {status.label}
                          </span>
                        </div>

                        <p className="client-appointment-pet-name">
                          Mascota: {appointment.petName}
                        </p>

                        <div className="client-appointment-history-details">
                          <span>
                            <CalendarDays size={15} />
                            {formatDate(appointment.date)}
                          </span>

                          <span>
                            <Clock size={15} />
                            {appointment.time}
                          </span>
                        </div>

                        <p className="client-appointment-reason">
                          {appointment.reason}
                        </p>
                      </div>
                    </div>

                    {appointment.status === "PENDING" && (
                      <button
                        type="button"
                        className="client-appointment-cancel-button"
                        onClick={() => handleCancel(appointment.id)}
                      >
                        <X size={16} />
                        Cancelar solicitud
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ClientAppointments;
