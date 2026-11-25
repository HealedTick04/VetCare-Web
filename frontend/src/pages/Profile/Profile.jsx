import { useEffect, useState } from "react";
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
import { userService } from "../../services/api/userService";
import { authService } from "../../services/api/authService";
import "./Profile.css";

const roleLabels = {
  ADMIN: "Administrador",
  VETERINARIAN: "Veterinario",
  CLIENT: "Cliente",
};

function Profile() {
  const currentUser = authService.getCurrentUser();
  const role = currentUser?.role || "VETERINARIAN";
  const userId = currentUser?.userId;

  const extraStorageKey = `vetcare_profile_extra_${userId || "default"}`;

  const [profile, setProfile] = useState({
    name: currentUser
      ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim()
      : "",
    email: currentUser?.email || "",
    phone: "",
    address: "",
    position: roleLabels[role] || role,
    specialty: role === "CLIENT" ? "Propietario de mascota" : "Medicina general",
  });

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const savedExtra = JSON.parse(
          localStorage.getItem(extraStorageKey) || "{}"
        );

        if (userId) {
          const data = await userService.getById(userId);
          setProfile((prev) => ({
            ...prev,
            name: data.name || prev.name,
            email: data.email || prev.email,
            phone: data.phone || "",
            position: data.roleLabel || prev.position,
            address: savedExtra.address || "",
            specialty: savedExtra.specialty || prev.specialty,
          }));
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId, extraStorageKey]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
    setFeedback({ type: "", text: "" });
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPassword((current) => ({
      ...current,
      [name]: value,
    }));
    setFeedback({ type: "", text: "" });
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setFeedback({ type: "", text: "" });

    try {
      setSaving(true);

      // Guardar campos complementarios locales
      localStorage.setItem(
        extraStorageKey,
        JSON.stringify({
          address: profile.address,
          specialty: profile.specialty,
        })
      );

      if (userId) {
        const updated = await userService.update(userId, {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          role,
        });

        // Sincronizar sesión en localStorage
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
          localStorage.setItem(
            "vetcare_user",
            JSON.stringify({
              ...storedUser,
              firstName: updated.firstName,
              lastName: updated.lastName,
              email: updated.email,
            })
          );
        }
      }

      setFeedback({
        type: "success",
        text: "Los cambios de tu perfil se actualizaron correctamente.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text:
          err.response?.data?.message ||
          "No se pudieron guardar los cambios. Verifica tu sesión.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    setFeedback({ type: "", text: "" });

    if (password.newPassword !== password.confirm) {
      setFeedback({
        type: "error",
        text: "Las contraseñas nuevas no coinciden.",
      });
      return;
    }

    if (password.newPassword.length < 8) {
      setFeedback({
        type: "error",
        text: "La contraseña debe tener al menos 8 caracteres.",
      });
      return;
    }

    setFeedback({
      type: "success",
      text: "Validación correcta. Para restablecer contraseñas en base de datos, un administrador puede gestionar la cuenta o habilitar un endpoint dedicado.",
    });

    setPassword({
      current: "",
      newPassword: "",
      confirm: "",
    });
  };

  const accountBadge =
    role === "ADMIN"
      ? "Cuenta de administrador"
      : role === "VETERINARIAN"
      ? "Cuenta de personal"
      : "Cuenta de cliente";

  return (
    <div className="profile-layout">
      <Sidebar role={role} />

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
            <h2>{loading ? "Cargando..." : profile.name || "Usuario"}</h2>
            <p>{profile.position}</p>
            <span>
              <ShieldCheck size={15} />
              {accountBadge}
            </span>
          </div>
        </section>

        <section className="profile-content">
          <nav className="profile-tabs">
            <button
              className={activeTab === "personal" ? "active" : ""}
              onClick={() => {
                setActiveTab("personal");
                setFeedback({ type: "", text: "" });
              }}
              type="button"
            >
              <UserRound size={17} />
              Información personal
            </button>

            <button
              className={activeTab === "security" ? "active" : ""}
              onClick={() => {
                setActiveTab("security");
                setFeedback({ type: "", text: "" });
              }}
              type="button"
            >
              <LockKeyhole size={17} />
              Seguridad
            </button>
          </nav>

          {feedback.text && (
            <p
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "0.9rem",
                backgroundColor:
                  feedback.type === "error" ? "#fde8e8" : "#def7ec",
                color: feedback.type === "error" ? "#9b1c1c" : "#03543f",
              }}
            >
              {feedback.text}
            </p>
          )}

          {activeTab === "personal" && (
            <form className="profile-form" onSubmit={handleProfileSubmit}>
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
                      placeholder="555 123 4567"
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
                      placeholder="Ciudad, Estado"
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-position">Cargo / Rol</label>
                  <div className="profile-input-wrapper">
                    <BriefcaseBusiness size={17} />
                    <input
                      id="profile-position"
                      name="position"
                      value={profile.position}
                      disabled
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-specialty">
                    {role === "CLIENT" ? "Notas" : "Especialidad"}
                  </label>
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
                <button
                  className="profile-save-button"
                  type="submit"
                  disabled={saving}
                >
                  <Save size={17} />
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form className="profile-form" onSubmit={handlePasswordSubmit}>
              <div className="profile-section-heading">
                <h3>Seguridad de la cuenta</h3>
                <p>Administra la contraseña de acceso a VetCare.</p>
              </div>

              <div className="profile-password-fields">
                <div className="profile-field">
                  <label htmlFor="current-password">Contraseña actual</label>
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
                <p>Utiliza una contraseña de al menos 8 caracteres.</p>
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