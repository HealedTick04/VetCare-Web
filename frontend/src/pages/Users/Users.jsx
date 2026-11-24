
import { useMemo, useState } from "react";
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
import "./Users.css";

const demoUsers = [
  {
    id: 1,
    name: "Carlos Rodríguez",
    email: "carlos@vetcare.com",
    phone: "555 123 4567",
    role: "Administrador",
    status: "Activo",
    registrationDate: "12/03/2026",
  },
  {
    id: 2,
    name: "Mariana López",
    email: "mariana@vetcare.com",
    phone: "555 234 5678",
    role: "Veterinario",
    status: "Activo",
    registrationDate: "15/03/2026",
  },
  {
    id: 3,
    name: "Fernando García",
    email: "fernando@email.com",
    phone: "555 345 6789",
    role: "Cliente",
    status: "Activo",
    registrationDate: "20/03/2026",
  },
  {
    id: 4,
    name: "Andrea Martínez",
    email: "andrea@vetcare.com",
    phone: "555 456 7890",
    role: "Veterinario",
    status: "Inactivo",
    registrationDate: "22/03/2026",
  },
  {
    id: 5,
    name: "Roberto Hernández",
    email: "roberto@email.com",
    phone: "555 567 8901",
    role: "Cliente",
    status: "Activo",
    registrationDate: "25/03/2026",
  },
  {
    id: 6,
    name: "Lucía Torres",
    email: "lucia@email.com",
    phone: "555 678 9012",
    role: "Cliente",
    status: "Inactivo",
    registrationDate: "28/03/2026",
  },
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  role: "Cliente",
};

function Users() {
  const [users, setUsers] = useState(demoUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const totalUsers = users.length;

  const administrators = users.filter(
    (user) => user.role === "Administrador"
  ).length;

  const veterinarians = users.filter(
    (user) => user.role === "Veterinario"
  ).length;

  const clients = users.filter(
    (user) => user.role === "Cliente"
  ).length;

  const activeUsers = users.filter(
    (user) => user.status === "Activo"
  ).length;

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const normalizedSearch = search.toLowerCase().trim();

      const matchesSearch =
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.phone.includes(normalizedSearch);

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
    setModalOpen(true);
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setModalMode("view");
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setModalMode("edit");
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setErrors({});
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
    } else {
      const emailExists = users.some(
        (user) =>
          user.email.toLowerCase() === form.email.trim().toLowerCase() &&
          user.id !== selectedUser?.id
      );

      if (emailExists) {
        newErrors.email = "Ya existe un usuario con este correo.";
      }
    }

    if (!form.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio.";
    } else if (!/^[0-9+\s()-]{8,20}$/.test(form.phone.trim())) {
      newErrors.phone = "Ingresa un número de teléfono válido.";
    }

    if (!form.role) {
      newErrors.role = "Selecciona un rol.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    if (modalMode === "create") {
      const newUser = {
        id: Date.now(),
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        role: form.role,
        status: "Activo",
        registrationDate: new Intl.DateTimeFormat("es-MX").format(
          new Date()
        ),
      };

      setUsers((previous) => [newUser, ...previous]);
    }

    if (modalMode === "edit" && selectedUser) {
      setUsers((previous) =>
        previous.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                role: form.role,
              }
            : user
        )
      );
    }

    closeModal();
  };

  const toggleUserStatus = (user) => {
    const newStatus = user.status === "Activo" ? "Inactivo" : "Activo";

    const confirmed = window.confirm(
      `¿Deseas ${newStatus === "Activo" ? "activar" : "desactivar"} la cuenta de ${user.name}?`
    );

    if (!confirmed) return;

    setUsers((previous) =>
      previous.map((item) =>
        item.id === user.id
          ? { ...item, status: newStatus }
          : item
      )
    );
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
      <Sidebar role="ADMIN" />

      <main className="users-main">
        <header className="users-header">
          <div>
            <span className="users-breadcrumb">
              Administración / Usuarios
            </span>
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
              <p>Consulta las cuentas existentes en el sistema.</p>
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

                {filteredUsers.length === 0 && (
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
              >
                {modalMode === "create"
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
              <label htmlFor="user-name">Nombre completo</label>
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
              <label htmlFor="user-email">Correo electrónico</label>
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
              <label htmlFor="user-role">Rol del usuario</label>
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

            <p className="users-form-note">
              La cuenta se registrará como activa. La configuración de
              credenciales y acceso se realizará posteriormente desde el
              backend.
            </p>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default Users;
