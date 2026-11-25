import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Users as UsersIcon,
  ShieldCheck,
  UserRound,
  UserCheck,
  Eye,
  Pencil,
  Filter,
  UserX,
  X,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Modal from "../../components/common/Modal";
import { userService } from "../../services/api/userService";
import { authService } from "../../services/api/authService";
import "./Users.css";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "Cliente",
};

function Users() {
  const currentUser = authService.getCurrentUser();
  const currentRole = currentUser?.role || "ADMIN";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const totalUsers = users.length;

  const administrators = users.filter(
    (user) => user.role === "Administrador"
  ).length;

  const veterinarians = users.filter(
    (user) => user.role === "Veterinario"
  ).length;

  const clients = users.filter((user) => user.role === "Cliente").length;

  const activeUsers = users.filter((user) => user.status === "Activo").length;

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const normalizedSearch = search.toLowerCase().trim();

      const matchesSearch =
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        (user.phone || "").includes(normalizedSearch);

      const matchesRole =
        roleFilter === "Todos" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "Todos" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedUser(null);
    setForm(emptyForm);
    setErrors({});
    setServerError("");
    setModalOpen(true);
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setModalMode("view");
    setServerError("");
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setModalMode("edit");
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      phone: user.phone === "Sin teléfono" ? "" : user.phone,
      role: user.role,
    });
    setErrors({});
    setServerError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setErrors({});
    setServerError("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "El nombre es obligatorio.";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres.";
    }

    if (!form.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Ingresa un correo electrónico válido.";
    }

    if (modalMode === "create") {
      if (!form.password.trim()) {
        newErrors.password = "La contraseña inicial es obligatoria.";
      } else if (form.password.trim().length < 8) {
        newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
      }
    }

    if (form.phone.trim() && !/^[0-9+\s()-]{8,20}$/.test(form.phone.trim())) {
      newErrors.phone = "Ingresa un número de teléfono válido.";
    }

    if (!form.role) {
      newErrors.role = "Selecciona un rol.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    try {
      setSaving(true);
      if (modalMode === "create") {
        await userService.create(form);
      } else if (modalMode === "edit" && selectedUser) {
        await userService.update(selectedUser.id, form);
      }
      await loadUsers();
      closeModal();
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Error al guardar el usuario. Verifica los datos o permisos."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleUserStatus = async (user) => {
    const newStatus = user.status === "Activo" ? "Inactivo" : "Activo";

    const confirmed = window.confirm(
      `¿Deseas ${
        newStatus === "Activo" ? "activar" : "desactivar"
      } la cuenta de ${user.name}?`
    );

    if (!confirmed) return;

    try {
      await userService.toggleActive(user.id);
      await loadUsers();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "No se pudo cambiar el estado del usuario."
      );
    }
  };

  const isReadOnly = modalMode === "view";

  const modalTitle =
    modalMode === "create"
      ? "Registrar usuario"
      : modalMode === "edit"
      ? "Editar usuario"
      : "Información del usuario";

  const modalDescription =
    modalMode === "create"
      ? "Completa los datos para registrar una nueva cuenta."
      : modalMode === "edit"
      ? "Modifica la información de la cuenta seleccionada."
      : "Consulta los datos y el estado de esta cuenta.";

  return (
    <div className="users-layout">
      <Sidebar role={currentRole} />

      <main className="users-main">
        <header className="users-header">
          <div>
            <span className="users-breadcrumb">Administración / Usuarios</span>
            <h1>Gestión de usuarios</h1>
            <p>Administra las cuentas y permisos de VetCare.</p>
          </div>

          <button
            type="button"
            className="users-primary-button"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Nuevo usuario
          </button>
        </header>

        {/* Estadísticas */}
        <section className="users-stats">
          <div className="users-stat-card">
            <div className="users-stat-icon blue">
              <UsersIcon size={22} />
            </div>
            <div>
              <span>Total de usuarios</span>
              <strong>{totalUsers}</strong>
            </div>
          </div>

          <div className="users-stat-card">
            <div className="users-stat-icon purple">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span>Administradores</span>
              <strong>{administrators}</strong>
            </div>
          </div>

          <div className="users-stat-card">
            <div className="users-stat-icon green">
              <UserCheck size={22} />
            </div>
            <div>
              <span>Veterinarios</span>
              <strong>{veterinarians}</strong>
            </div>
          </div>

          <div className="users-stat-card">
            <div className="users-stat-icon orange">
              <UserRound size={22} />
            </div>
            <div>
              <span>Clientes</span>
              <strong>{clients}</strong>
            </div>
          </div>
        </section>

        {/* Tabla de usuarios */}
        <section className="users-content">
          <div className="users-content-header">
            <div>
              <h2>Usuarios registrados</h2>
              <p>
                {loading
                  ? "Cargando usuarios..."
                  : "Consulta las cuentas existentes en el sistema."}
              </p>
            </div>

            <span className="users-active-counter">
              {activeUsers} usuarios activos
            </span>
          </div>

          <div className="users-filters">
            <div className="users-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar por nombre, correo o teléfono..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              {search && (
                <button
                  type="button"
                  className="users-clear-search"
                  onClick={() => setSearch("")}
                  aria-label="Limpiar búsqueda"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="users-filter-select">
              <Filter size={17} />
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
              >
                <option value="Todos">Todos los roles</option>
                <option value="Administrador">Administrador</option>
                <option value="Veterinario">Veterinario</option>
                <option value="Cliente">Cliente</option>
              </select>
            </div>

            <select
              className="users-status-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Contacto</th>
                  <th>Rol</th>
                  <th>Fecha de registro</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="users-user-cell">
                        <div className="users-user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <strong>{user.name}</strong>
                      </div>
                    </td>

                    <td>
                      <div className="users-contact-cell">
                        <span>{user.email}</span>
                        <small>{user.phone}</small>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`users-role ${
                          user.role === "Administrador"
                            ? "admin"
                            : user.role === "Veterinario"
                            ? "vet"
                            : "client"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>{user.registrationDate}</td>

                    <td>
                      <span
                        className={`users-status ${
                          user.status === "Activo" ? "active" : "inactive"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td>
                      <div className="users-actions">
                        <button
                          type="button"
                          title="Ver usuario"
                          aria-label={`Ver usuario ${user.name}`}
                          onClick={() => openViewModal(user)}
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          title="Editar usuario"
                          aria-label={`Editar usuario ${user.name}`}
                          onClick={() => openEditModal(user)}
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          className={
                            user.status === "Activo"
                              ? "users-deactivate-action"
                              : "users-activate-action"
                          }
                          title={
                            user.status === "Activo"
                              ? "Desactivar usuario"
                              : "Activar usuario"
                          }
                          aria-label={
                            user.status === "Activo"
                              ? `Desactivar usuario ${user.name}`
                              : `Activar usuario ${user.name}`
                          }
                          onClick={() => toggleUserStatus(user)}
                        >
                          {user.status === "Activo" ? (
                            <UserX size={17} />
                          ) : (
                            <UserCheck size={17} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!loading && filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="users-empty">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="users-table-footer">
            Mostrando {filteredUsers.length} de {totalUsers} usuarios
          </div>
        </section>
      </main>

      {/* Modal de usuarios */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={modalTitle}
        description={modalDescription}
        size="medium"
        footer={
          isReadOnly ? (
            <button
              type="button"
              className="users-modal-secondary"
              onClick={closeModal}
            >
              Cerrar
            </button>
          ) : (
            <>
              <button
                type="button"
                className="users-modal-secondary"
                onClick={closeModal}
              >
                Cancelar
              </button>

              <button
                type="submit"
                form="users-form"
                className="users-modal-primary"
                disabled={saving}
              >
                {saving
                  ? "Guardando..."
                  : modalMode === "create"
                  ? "Registrar usuario"
                  : "Guardar cambios"}
              </button>
            </>
          )
        }
      >
        {isReadOnly && selectedUser ? (
          <div className="users-detail">
            <div className="users-detail-avatar">
              {selectedUser.name.charAt(0).toUpperCase()}
            </div>

            <h3>{selectedUser.name}</h3>
            <span
              className={`users-role ${
                selectedUser.role === "Administrador"
                  ? "admin"
                  : selectedUser.role === "Veterinario"
                  ? "vet"
                  : "client"
              }`}
            >
              {selectedUser.role}
            </span>

            <div className="users-detail-information">
              <div>
                <span>Correo electrónico</span>
                <strong>{selectedUser.email}</strong>
              </div>

              <div>
                <span>Teléfono</span>
                <strong>{selectedUser.phone}</strong>
              </div>

              <div>
                <span>Fecha de registro</span>
                <strong>{selectedUser.registrationDate}</strong>
              </div>

              <div>
                <span>Estado de la cuenta</span>
                <strong
                  className={
                    selectedUser.status === "Activo"
                      ? "users-detail-active"
                      : "users-detail-inactive"
                  }
                >
                  {selectedUser.status}
                </strong>
              </div>
            </div>
          </div>
        ) : (
          <form
            id="users-form"
            className="users-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="users-form-field">
              <label htmlFor="user-name">Nombre completo *</label>
              <input
                id="user-name"
                name="name"
                type="text"
                placeholder="Ej. Mariana López"
                value={form.name}
                onChange={handleInputChange}
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && (
                <small className="users-form-error">{errors.name}</small>
              )}
            </div>

            <div className="users-form-field">
              <label htmlFor="user-email">Correo electrónico *</label>
              <input
                id="user-email"
                name="email"
                type="email"
                placeholder="usuario@correo.com"
                value={form.email}
                onChange={handleInputChange}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && (
                <small className="users-form-error">{errors.email}</small>
              )}
            </div>

            {modalMode === "create" && (
              <div className="users-form-field">
                <label htmlFor="user-password">
                  Contraseña inicial (mín. 8 caracteres) *
                </label>
                <input
                  id="user-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleInputChange}
                  className={errors.password ? "input-error" : ""}
                />
                {errors.password && (
                  <small className="users-form-error">{errors.password}</small>
                )}
              </div>
            )}

            <div className="users-form-field">
              <label htmlFor="user-phone">Teléfono</label>
              <input
                id="user-phone"
                name="phone"
                type="tel"
                placeholder="555 123 4567"
                value={form.phone}
                onChange={handleInputChange}
                className={errors.phone ? "input-error" : ""}
              />
              {errors.phone && (
                <small className="users-form-error">{errors.phone}</small>
              )}
            </div>

            <div className="users-form-field">
              <label htmlFor="user-role">Rol del usuario *</label>
              <select
                id="user-role"
                name="role"
                value={form.role}
                onChange={handleInputChange}
                className={errors.role ? "input-error" : ""}
              >
                <option value="Cliente">Cliente</option>
                <option value="Veterinario">Veterinario</option>
                <option value="Administrador">Administrador</option>
              </select>
              {errors.role && (
                <small className="users-form-error">{errors.role}</small>
              )}
            </div>

            {serverError && (
              <p className="users-form-error" style={{ marginTop: "8px" }}>
                {serverError}
              </p>
            )}
          </form>
        )}
      </Modal>
    </div>
  );
}

export default Users;