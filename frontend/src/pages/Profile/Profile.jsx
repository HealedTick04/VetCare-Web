
import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  ShieldCheck,
  Camera,
  Save,
  LockKeyhole,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    name: "Carlos Rodríguez",
    email: "carlos@vetcare.com",
    phone: "555 123 4567",
    address: "Ciudad de México, México",
    position: "Veterinario",
    specialty: "Medicina general",
  });

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [activeTab, setActiveTab] = useState("personal");

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPassword((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    alert("Los cambios del perfil se guardaron localmente.");
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (password.newPassword !== password.confirm) {
      alert("Las contraseñas nuevas no coinciden.");
      return;
    }

    if (password.newPassword.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    alert("La solicitud de cambio de contraseña se validó localmente.");

    setPassword({
      current: "",
      newPassword: "",
      confirm: "",
    });
  };

  return (
    <div className="profile-layout">
      <Sidebar role="VETERINARIAN" />

      <main className="profile-main">
        <header className="profile-header">
          <div>
            <span className="profile-breadcrumb">
              Administración / Mi perfil
            </span>
            <h1>Mi perfil</h1>
            <p>Consulta y administra la información de tu cuenta.</p>
          </div>
        </header>

        <section className="profile-overview">
          <div className="profile-avatar">
            <UserRound size={42} />
            <button title="Cambiar fotografía" type="button">
              <Camera size={15} />
            </button>
          </div>

          <div className="profile-overview-info">
            <h2>{profile.name}</h2>
            <p>{profile.position}</p>
            <span>
              <ShieldCheck size={15} />
              Cuenta de personal
            </span>
          </div>
        </section>

        <section className="profile-content">
          <nav className="profile-tabs">
            <button
              className={activeTab === "personal" ? "active" : ""}
              onClick={() => setActiveTab("personal")}
              type="button"
            >
              <UserRound size={17} />
              Información personal
            </button>

            <button
              className={activeTab === "security" ? "active" : ""}
              onClick={() => setActiveTab("security")}
              type="button"
            >
              <LockKeyhole size={17} />
              Seguridad
            </button>
          </nav>

          {activeTab === "personal" && (
            <form
              className="profile-form"
              onSubmit={handleProfileSubmit}
            >
              <div className="profile-section-heading">
                <h3>Información personal</h3>
                <p>Actualiza tus datos de contacto y perfil profesional.</p>
              </div>

              <div className="profile-form-grid">
                <div className="profile-field">
                  <label htmlFor="profile-name">Nombre completo</label>
                  <div className="profile-input-wrapper">
                    <UserRound size={17} />
                    <input
                      id="profile-name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-email">Correo electrónico</label>
                  <div className="profile-input-wrapper">
                    <Mail size={17} />
                    <input
                      id="profile-email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-phone">Teléfono</label>
                  <div className="profile-input-wrapper">
                    <Phone size={17} />
                    <input
                      id="profile-phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-address">Dirección</label>
                  <div className="profile-input-wrapper">
                    <MapPin size={17} />
                    <input
                      id="profile-address"
                      name="address"
                      value={profile.address}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-position">Cargo</label>
                  <div className="profile-input-wrapper">
                    <BriefcaseBusiness size={17} />
                    <input
                      id="profile-position"
                      name="position"
                      value={profile.position}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-specialty">Especialidad</label>
                  <div className="profile-input-wrapper">
                    <BriefcaseBusiness size={17} />
                    <input
                      id="profile-specialty"
                      name="specialty"
                      value={profile.specialty}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
              </div>

              <div className="profile-form-footer">
                <button className="profile-save-button" type="submit">
                  <Save size={17} />
                  Guardar cambios
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form
              className="profile-form"
              onSubmit={handlePasswordSubmit}
            >
              <div className="profile-section-heading">
                <h3>Seguridad de la cuenta</h3>
                <p>Administra la contraseña de acceso a VetCare.</p>
              </div>

              <div className="profile-password-fields">
                <div className="profile-field">
                  <label htmlFor="current-password">
                    Contraseña actual
                  </label>
                  <input
                    id="current-password"
                    className="profile-plain-input"
                    name="current"
                    type="password"
                    value={password.current}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="new-password">Nueva contraseña</label>
                  <input
                    id="new-password"
                    className="profile-plain-input"
                    name="newPassword"
                    type="password"
                    minLength={8}
                    value={password.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="confirm-password">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    id="confirm-password"
                    className="profile-plain-input"
                    name="confirm"
                    type="password"
                    minLength={8}
                    value={password.confirm}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>

              <div className="profile-security-note">
                <LockKeyhole size={18} />
                <p>
                  Utiliza una contraseña de al menos 8 caracteres. El cambio
                  real de contraseña se conectará posteriormente con el
                  backend.
                </p>
              </div>

              <div className="profile-form-footer">
                <button className="profile-save-button" type="submit">
                  <Save size={17} />
                  Actualizar contraseña
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

export default Profile;
