
import { useState } from "react";
import {
  Building2,
  Globe,
  Bell,
  ShieldCheck,
  Save,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import "./Settings.css";

function Settings() {
  const [activeSection, setActiveSection] = useState("clinic");

  const [clinic, setClinic] = useState({
    name: "VetCare",
    email: "contacto@vetcare.com",
    phone: "55 1234 5678",
    address: "Ciudad de México, México",
    openingTime: "09:00",
    closingTime: "18:00",
  });

  const [preferences, setPreferences] = useState({
    language: "Español",
    timezone: "America/Mexico_City",
    dateFormat: "DD/MM/YYYY",
    currency: "MXN",
  });

  const [notifications, setNotifications] = useState({
    newAppointments: true,
    cancelledAppointments: true,
    lowInventory: true,
    emailNotifications: false,
  });

  const handleClinicChange = (event) => {
    const { name, value } = event.target;

    setClinic((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePreferenceChange = (event) => {
    const { name, value } = event.target;

    setPreferences((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleNotificationChange = (event) => {
    const { name, checked } = event.target;

    setNotifications((previous) => ({
      ...previous,
      [name]: checked,
    }));
  };

  const handleSave = () => {
    alert("La configuración se ha guardado localmente.");
  };

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

  return (
    <div className="settings-layout">
      <Sidebar role="ADMIN" />

      <main className="settings-main">
        <header className="settings-header">
          <div>
            <span className="settings-breadcrumb">
              Administración / Configuración
            </span>
            <h1>Configuración</h1>
            <p>
              Administra las preferencias generales de tu clínica.
            </p>
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
                  className={`settings-nav-item ${
                    activeSection === section.id ? "active" : ""
                  }`}
                  onClick={() => setActiveSection(section.id)}
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
                    <p>
                      Actualiza los datos principales de VetCare.
                    </p>
                  </div>
                  <Building2 size={23} />
                </div>

                <div className="settings-form-grid">
                  <div className="settings-field">
                    <label>Nombre de la clínica</label>
                    <input
                      name="name"
                      value={clinic.name}
                      onChange={handleClinicChange}
                    />
                  </div>

                  <div className="settings-field">
                    <label>Correo electrónico</label>
                    <input
                      type="email"
                      name="email"
                      value={clinic.email}
                      onChange={handleClinicChange}
                    />
                  </div>

                  <div className="settings-field">
                    <label>Teléfono</label>
                    <input
                      name="phone"
                      value={clinic.phone}
                      onChange={handleClinicChange}
                    />
                  </div>

                  <div className="settings-field">
                    <label>Dirección</label>
                    <input
                      name="address"
                      value={clinic.address}
                      onChange={handleClinicChange}
                    />
                  </div>

                  <div className="settings-field">
                    <label>Hora de apertura</label>
                    <input
                      type="time"
                      name="openingTime"
                      value={clinic.openingTime}
                      onChange={handleClinicChange}
                    />
                  </div>

                  <div className="settings-field">
                    <label>Hora de cierre</label>
                    <input
                      type="time"
                      name="closingTime"
                      value={clinic.closingTime}
                      onChange={handleClinicChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "preferences" && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div>
                    <h2>Preferencias generales</h2>
                    <p>
                      Personaliza el comportamiento de la aplicación.
                    </p>
                  </div>
                  <Globe size={23} />
                </div>

                <div className="settings-form-grid">
                  <div className="settings-field">
                    <label>Idioma</label>
                    <select
                      name="language"
                      value={preferences.language}
                      onChange={handlePreferenceChange}
                    >
                      <option>Español</option>
                      <option>English</option>
                    </select>
                  </div>

                  <div className="settings-field">
                    <label>Zona horaria</label>
                    <select
                      name="timezone"
                      value={preferences.timezone}
                      onChange={handlePreferenceChange}
                    >
                      <option value="America/Mexico_City">
                        Ciudad de México
                      </option>
                      <option value="America/Cancun">
                        Cancún
                      </option>
                      <option value="America/Tijuana">
                        Tijuana
                      </option>
                    </select>
                  </div>

                  <div className="settings-field">
                    <label>Formato de fecha</label>
                    <select
                      name="dateFormat"
                      value={preferences.dateFormat}
                      onChange={handlePreferenceChange}
                    >
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="settings-field">
                    <label>Moneda</label>
                    <select
                      name="currency"
                      value={preferences.currency}
                      onChange={handlePreferenceChange}
                    >
                      <option value="MXN">Peso mexicano (MXN)</option>
                      <option value="USD">Dólar estadounidense (USD)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div>
                    <h2>Preferencias de notificaciones</h2>
                    <p>
                      Selecciona qué avisos deseas recibir.
                    </p>
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
                      <p>Avisar cuando un producto alcance su stock mínimo.</p>
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
              </div>
            )}

            {activeSection === "security" && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div>
                    <h2>Seguridad y sistema</h2>
                    <p>
                      Información general sobre el sistema.
                    </p>
                  </div>
                  <ShieldCheck size={23} />
                </div>

                <div className="settings-system-info">
                  <div>
                    <span>Nombre del sistema</span>
                    <strong>VetCare</strong>
                  </div>

                  <div>
                    <span>Versión</span>
                    <strong>1.0.0</strong>
                  </div>

                  <div>
                    <span>Estado del sistema</span>
                    <strong className="system-status">
                      Operativo
                    </strong>
                  </div>

                  <div>
                    <span>Tipo de instalación</span>
                    <strong>Clínica individual</strong>
                  </div>
                </div>

                <div className="settings-security-note">
                  Las opciones de seguridad de usuarios y sesiones se
                  administrarán cuando conectemos la autenticación del
                  backend.
                </div>
              </div>
            )}

            <div className="settings-actions">
              <button
                className="settings-save-button"
                onClick={handleSave}
              >
                <Save size={18} />
                Guardar cambios
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Settings;
