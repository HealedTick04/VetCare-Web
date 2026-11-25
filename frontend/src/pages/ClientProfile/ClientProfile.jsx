
import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Pencil,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  User,
  Contact,
} from "lucide-react";

import ClientSidebar from "../../components/layout/ClientSidebar";
import "./ClientProfile.css";

const initialProfile = {
  firstName: "Mayte",
  lastName: "Mesinas Torres",
  email: "mayte@example.com",
  phone: "9511234567",
  address: "Puerto Escondido, Oaxaca, México",
  emergencyContact: "María García",
  emergencyPhone: "9517654321",
};

function ClientProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [formData, setFormData] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`
    .toUpperCase();

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es obligatorio.";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "El nombre debe tener al menos 2 caracteres.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Los apellidos son obligatorios.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Ingresa un correo electrónico válido.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio.";
    } else if (!/^[0-9+\s()-]{10,16}$/.test(formData.phone.trim())) {
      newErrors.phone = "Ingresa un número de teléfono válido.";
    }

    if (
      formData.emergencyPhone.trim() &&
      !/^[0-9+\s()-]{10,16}$/.test(formData.emergencyPhone.trim())
    ) {
      newErrors.emergencyPhone = "Ingresa un teléfono de emergencia válido.";
    }

    if (
      formData.emergencyContact.trim() &&
      !formData.emergencyPhone.trim()
    ) {
      newErrors.emergencyPhone =
        "Ingresa el teléfono del contacto de emergencia.";
    }

    if (
      formData.emergencyPhone.trim() &&
      !formData.emergencyContact.trim()
    ) {
      newErrors.emergencyContact =
        "Ingresa el nombre del contacto de emergencia.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setFormData(profile);
    setErrors({});
    setSuccessMessage("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(profile);
    setErrors({});
    setSuccessMessage("");
    setIsEditing(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updatedProfile = {
      ...formData,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      emergencyContact: formData.emergencyContact.trim(),
      emergencyPhone: formData.emergencyPhone.trim(),
    };

    setProfile(updatedProfile);
    setFormData(updatedProfile);
    setIsEditing(false);
    setErrors({});
    setSuccessMessage("Tus datos personales se actualizaron correctamente.");
  };

  return (
    <div className="client-profile-layout">
      <ClientSidebar />

      <main className="client-profile-main">
        <header className="client-profile-header">
          <div>
            <span className="client-profile-eyebrow">
              MI CUENTA
            </span>

            <h1>Mi perfil</h1>

            <p>
              Consulta y administra tu información personal y de contacto.
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              className="client-profile-edit-button"
              onClick={handleEdit}
            >
              <Pencil size={17} />
              Editar perfil
            </button>
          )}
        </header>

        {successMessage && (
          <div className="client-profile-success">
            <CheckCircle size={19} />
            <span>{successMessage}</span>
          </div>
        )}

        <section className="client-profile-summary">
          <div className="client-profile-avatar">
            {initials}
          </div>

          <div className="client-profile-summary-info">
            <h2>{profile.firstName} {profile.lastName}</h2>
            <p>{profile.email}</p>

            <span className="client-profile-role">
              <UserRound size={14} />
              Cliente VetCare
            </span>
          </div>

          <div className="client-profile-account-status">
            <ShieldCheck size={18} />
            <span>Cuenta de cliente</span>
          </div>
        </section>

        <form onSubmit={handleSubmit}>
          <section className="client-profile-section">
            <div className="client-profile-section-heading">
              <div className="client-profile-section-icon">
                <User size={20} />
              </div>

              <div>
                <h2>Información personal</h2>
                <p>Datos básicos asociados a tu cuenta.</p>
              </div>
            </div>

            <div className="client-profile-fields">
              <div className="client-profile-field">
                <label htmlFor="firstName">Nombre *</label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  maxLength={60}
                  className={errors.firstName ? "field-error" : ""}
                />

                {errors.firstName && (
                  <small>{errors.firstName}</small>
                )}
              </div>

              <div className="client-profile-field">
                <label htmlFor="lastName">Apellidos *</label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  maxLength={80}
                  className={errors.lastName ? "field-error" : ""}
                />

                {errors.lastName && (
                  <small>{errors.lastName}</small>
                )}
              </div>

              <div className="client-profile-field">
                <label htmlFor="email">Correo electrónico *</label>

                <div className="client-profile-input-icon">
                  <Mail size={17} />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    maxLength={120}
                    className={errors.email ? "field-error" : ""}
                  />
                </div>

                {errors.email && (
                  <small>{errors.email}</small>
                )}
              </div>

              <div className="client-profile-field">
                <label htmlFor="phone">Teléfono *</label>

                <div className="client-profile-input-icon">
                  <Phone size={17} />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    maxLength={16}
                    className={errors.phone ? "field-error" : ""}
                  />
                </div>

                {errors.phone && (
                  <small>{errors.phone}</small>
                )}
              </div>

              <div className="client-profile-field full-width">
                <label htmlFor="address">Dirección</label>

                <div className="client-profile-input-icon">
                  <MapPin size={17} />

                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    maxLength={180}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="client-profile-section">
            <div className="client-profile-section-heading">
              <div className="client-profile-section-icon">
                <Contact size={20} />
              </div>

              <div>
                <h2>Contacto de emergencia</h2>
                <p>
                  Persona a quien la clínica podrá contactar si es necesario.
                </p>
              </div>
            </div>

            <div className="client-profile-fields">
              <div className="client-profile-field">
                <label htmlFor="emergencyContact">
                  Nombre del contacto
                </label>

                <input
                  id="emergencyContact"
                  name="emergencyContact"
                  type="text"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  disabled={!isEditing}
                  maxLength={100}
                  className={errors.emergencyContact ? "field-error" : ""}
                />

                {errors.emergencyContact && (
                  <small>{errors.emergencyContact}</small>
                )}
              </div>

              <div className="client-profile-field">
                <label htmlFor="emergencyPhone">
                  Teléfono del contacto
                </label>

                <div className="client-profile-input-icon">
                  <Phone size={17} />

                  <input
                    id="emergencyPhone"
                    name="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    maxLength={16}
                    className={errors.emergencyPhone ? "field-error" : ""}
                  />
                </div>

                {errors.emergencyPhone && (
                  <small>{errors.emergencyPhone}</small>
                )}
              </div>
            </div>
          </section>

          {isEditing && (
            <div className="client-profile-form-actions">
              <button
                type="button"
                className="client-profile-cancel-button"
                onClick={handleCancel}
              >
                <X size={17} />
                Cancelar
              </button>

              <button
                type="submit"
                className="client-profile-save-button"
              >
                <Save size={17} />
                Guardar cambios
              </button>
            </div>
          )}
        </form>

        <div className="client-profile-security-note">
          <ShieldCheck size={20} />

          <div>
            <strong>Protección de tus datos</strong>
            <p>
              Tu información personal debe ser accesible únicamente
              para ti y para el personal autorizado de la clínica.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ClientProfile;
