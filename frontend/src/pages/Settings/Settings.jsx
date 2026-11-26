import { useEffect, useState } from "react";
import {
  Building2,
  Globe,
  Bell,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import { settingsService } from "../../services/api/settingsService";
import { authService } from "../../services/api/authService";
import "./Settings.css";

const sections = [
  {
    id: "clinic",
    label: "Información de la clínica",
    icon: Building2,
  },
  {
    id: "preferences",
    label: "Preferencias generales",
    icon: Globe,
  },
  {
    id: "notifications",
    label: "Notificaciones",
    icon: Bell,
  },
  {
    id: "security",
    label: "Seguridad y sistema",
    icon: ShieldCheck,
  },
];

function Settings() {
  const currentUser = authService.getCurrentUser();
  const role = currentUser?.role || "ADMIN";

  const [activeSection, setActiveSection] = useState("clinic");

  const [clinic, setClinic] = useState(() => settingsService.getAll().clinic);
  const [preferences, setPreferences] = useState(
    () => settingsService.getAll().preferences
  );
  const [notifications, setNotifications] = useState(
    () => settingsService.getAll().notifications
  );

  const [backendOnline, setBackendOnline] = useState(null);

  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
    let mounted = true;
    settingsService.checkBackendHealth().then((isOk) => {
      if (mounted) setBackendOnline(isOk);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleClinicChange = (event) => {
    const { name, value } = event.target;

    setClinic((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFeedback({ type: "", message: "" });
  };

  const handlePreferenceChange = (event) => {
    const { name, value } = event.target;

    setPreferences((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFeedback({ type: "", message: "" });
  };

  const handleNotificationChange = (event) => {
    const { name, checked } = event.target;

    setNotifications((previous) => ({
      ...previous,
      [name]: checked,
    }));

    setFeedback({ type: "", message: "" });
  };

  const validateClinic = () => {
    if (clinic.name.trim().length < 3) {
      return "El nombre de la clínica debe tener al menos 3 caracteres.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(clinic.email.trim())) {
      return "Ingresa un correo electrónico válido.";
    }

    const phoneDigits = clinic.phone.replace(/\D/g, "");

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return "El teléfono debe contener entre 10 y 15 dígitos.";
    }

    if (clinic.address.trim().length < 5) {
      return "Ingresa una dirección válida.";
    }

    if (!clinic.openingTime || !clinic.closingTime) {
      return "Debes indicar el horario de apertura y cierre.";
    }

    if (clinic.openingTime >= clinic.closingTime) {
      return "La hora de cierre debe ser posterior a la hora de apertura.";
    }

    return "";
  };

  const handleSave = () => {
    if (activeSection === "clinic") {
      const validationError = validateClinic();

      if (validationError) {
        setFeedback({
          type: "error",
          message: validationError,
        });
        return;
      }

      settingsService.saveSection("clinic", clinic);
    }

    if (activeSection === "preferences") {
      if (
        !preferences.language ||
        !preferences.timezone ||
        !preferences.dateFormat ||
        !preferences.currency
      ) {
        setFeedback({
          type: "error",
          message: "Completa todas las preferencias antes de guardar.",
        });
        return;
      }

      settingsService.saveSection("preferences", preferences);
    }

    if (activeSection === "notifications") {
      settingsService.saveSection("notifications", notifications);
    }

    setFeedback({
      type: "success",
      message: "La configuración de esta sección se guardó correctamente.",
    });
  };

  const renderFeedback = () => {
    if (!feedback.message) return null;

    const FeedbackIcon =
      feedback.type === "success" ? CheckCircle2 : AlertCircle;

    return (
      <div
        className={`settings-feedback ${feedback.type}`}
        role={feedback.type === "error" ? "alert" : "status"}
      >
        <FeedbackIcon size={18} />
        <span>{feedback.message}</span>
      </div>
    );
  };

  return (
    <div className="settings-layout">
      <Sidebar role={role} />

      <main className="settings-main">
        <header className="settings-header">
          <div>
            <span className="settings-breadcrumb">
              Administración / Configuración
            </span>
            <h1>Configuración</h1>
            <p>Administra las preferencias generales de tu clínica.</p>
          </div>
        </header>

        <div className="settings-container">
          <aside className="settings-navigation">
            <h3>Configuración</h3>

            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <button
                  key={section.id}
                  type="button"
                  className={`settings-nav-item ${
                    activeSection === section.id ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveSection(section.id);
                    setFeedback({ type: "", message: "" });
                  }}
                >
                  <Icon size={19} />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </aside>

          <section className="settings-content">
            {activeSection === "clinic" && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div>
                    <h2>Información de la clínica</h2>
                    <p>Actualiza los datos principales de {clinic.name}.</p>
                  </div>
                  <Building2 size={23} />
                </div>

                <div className="settings-form-grid">
                  <div className="settings-field">
                    <label htmlFor="clinic-name">Nombre de la clínica</label>
                    <input
                      id="clinic-name"
                      name="name"
                      value={clinic.name}
                      onChange={handleClinicChange}
                      placeholder="Nombre de la clínica"
                      maxLength={100}
                      required
                    />
                  </div>

                  <div className="settings-field">
                    <label htmlFor="clinic-email">Correo electrónico</label>
                    <input
                      id="clinic-email"
                      type="email"
                      name="email"
                      value={clinic.email}
                      onChange={handleClinicChange}
                      placeholder="contacto@vetcare.com"
                      maxLength={150}
                      required
                    />
                  </div>

                  <div className="settings-field">
                    <label htmlFor="clinic-phone">Teléfono</label>
                    <input
                      id="clinic-phone"
                      type="tel"
                      name="phone"
                      value={clinic.phone}
                      onChange={handleClinicChange}
                      placeholder="55 1234 5678"
                      maxLength={20}
                      required
                    />
                  </div>

                  <div className="settings-field">
                    <label htmlFor="clinic-address">Dirección</label>
                    <input
                      id="clinic-address"
                      name="address"
                      value={clinic.address}
                      onChange={handleClinicChange}
                      placeholder="Dirección de la clínica"
                      maxLength={200}
                      required
                    />
                  </div>

                  <div className="settings-field">
                    <label htmlFor="opening-time">Hora de apertura</label>
                    <input
                      id="opening-time"
                      type="time"
                      name="openingTime"
                      value={clinic.openingTime}
                      onChange={handleClinicChange}
                      required
                    />
                  </div>

                  <div className="settings-field">
                    <label htmlFor="closing-time">Hora de cierre</label>
                    <input
                      id="closing-time"
                      type="time"
                      name="closingTime"
                      value={clinic.closingTime}
                      onChange={handleClinicChange}
                      required
                    />
                  </div>
                </div>

                <div className="settings-section-note">
                  <Clock size={17} />
                  <span>
                    Este horario se utiliza como referencia para la
                    administración de citas de la clínica.
                  </span>
                </div>
              </div>
            )}

            {activeSection === "preferences" && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div>
                    <h2>Preferencias generales</h2>
                    <p>Personaliza el comportamiento de la aplicación.</p>
                  </div>
                  <Globe size={23} />
                </div>

                <div className="settings-form-grid">
                  <div className="settings-field">
                    <label htmlFor="preference-language">Idioma</label>
                    <select
                      id="preference-language"
                      name="language"
                      value={preferences.language}
                      onChange={handlePreferenceChange}
                    >
                      <option value="Español">Español</option>
                      <option value="English">English</option>
                    </select>
                  </div>

                  <div className="settings-field">
                    <label htmlFor="preference-timezone">Zona horaria</label>
                    <select
                      id="preference-timezone"
                      name="timezone"
                      value={preferences.timezone}
                      onChange={handlePreferenceChange}
                    >
                      <option value="America/Mexico_City">
                        Ciudad de México
                      </option>
                      <option value="America/Cancun">Cancún</option>
                      <option value="America/Tijuana">Tijuana</option>
                    </select>
                  </div>

                  <div className="settings-field">
                    <label htmlFor="preference-date">Formato de fecha</label>
                    <select
                      id="preference-date"
                      name="dateFormat"
                      value={preferences.dateFormat}
                      onChange={handlePreferenceChange}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="settings-field">
                    <label htmlFor="preference-currency">Moneda</label>
                    <select
                      id="preference-currency"
                      name="currency"
                      value={preferences.currency}
                      onChange={handlePreferenceChange}
                    >
                      <option value="MXN">Peso mexicano (MXN)</option>
                      <option value="USD">Dólar estadounidense (USD)</option>
                    </select>
                  </div>
                </div>

                <div className="settings-section-note">
                  <Globe size={17} />
                  <span>
                    Estas preferencias se aplican en tu sesión de trabajo
                    actual.
                  </span>
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div>
                    <h2>Preferencias de notificaciones</h2>
                    <p>Selecciona qué avisos deseas recibir.</p>
                  </div>
                  <Bell size={23} />
                </div>

                <div className="settings-options">
                  <label className="settings-option">
                    <div>
                      <strong>Nuevas citas</strong>
                      <p>Recibir avisos cuando se registre una cita.</p>
                    </div>
                    <input
                      type="checkbox"
                      name="newAppointments"
                      checked={notifications.newAppointments}
                      onChange={handleNotificationChange}
                    />
                  </label>

                  <label className="settings-option">
                    <div>
                      <strong>Citas canceladas</strong>
                      <p>Notificar cuando una cita sea cancelada.</p>
                    </div>
                    <input
                      type="checkbox"
                      name="cancelledAppointments"
                      checked={notifications.cancelledAppointments}
                      onChange={handleNotificationChange}
                    />
                  </label>

                  <label className="settings-option">
                    <div>
                      <strong>Inventario bajo</strong>
                      <p>
                        Avisar cuando un producto alcance su stock mínimo.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="lowInventory"
                      checked={notifications.lowInventory}
                      onChange={handleNotificationChange}
                    />
                  </label>

                  <label className="settings-option">
                    <div>
                      <strong>Notificaciones por correo</strong>
                      <p>Recibir avisos mediante correo electrónico.</p>
                    </div>
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={notifications.emailNotifications}
                      onChange={handleNotificationChange}
                    />
                  </label>
                </div>

                <div className="settings-section-note">
                  <Bell size={17} />
                  <span>
                    Estos filtros controlan qué alertas se muestran en el
                    Centro de Notificaciones.
                  </span>
                </div>
              </div>
            )}

            {activeSection === "security" && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div>
                    <h2>Seguridad y sistema</h2>
                    <p>Información general y estado de conexión.</p>
                  </div>
                  <ShieldCheck size={23} />
                </div>

                <div className="settings-system-info">
                  <div>
                    <span>Nombre del sistema</span>
                    <strong>{clinic.name}</strong>
                  </div>

                  <div>
                    <span>Versión</span>
                    <strong>1.0.0</strong>
                  </div>

                  <div>
                    <span>Estado de la API (Spring Boot)</span>
                    <strong
                      className={
                        backendOnline === false ? "" : "system-status"
                      }
                      style={
                        backendOnline === false
                          ? { color: "#dc2626" }
                          : undefined
                      }
                    >
                      {backendOnline === null
                        ? "Verificando..."
                        : backendOnline
                        ? "Operativo · Conectado"
                        : "Sin conexión con el servidor"}
                    </strong>
                  </div>

                  <div>
                    <span>Sesión actual</span>
                    <strong>
                      {currentUser?.email || "Invitado"} ({role})
                    </strong>
                  </div>
                </div>

                <div className="settings-security-note">
                  <ShieldCheck size={18} />
                  <p>
                    La autenticación, sesiones y control de permisos por rol
                    están protegidos mediante Spring Security y tokens JWT.
                  </p>
                </div>
              </div>
            )}

            {renderFeedback()}

            {activeSection !== "security" && (
              <div className="settings-actions">
                <button
                  type="button"
                  className="settings-save-button"
                  onClick={handleSave}
                >
                  <Save size={18} />
                  Guardar cambios
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Settings;