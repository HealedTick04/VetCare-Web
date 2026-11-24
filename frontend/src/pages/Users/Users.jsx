
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
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
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

function Users() {
  const [users] = useState(demoUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

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
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search);

      const matchesRole =
        roleFilter === "Todos" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "Todos" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

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

          <button className="users-primary-button">
            <Plus size={18} />
            Nuevo usuario
          </button>
        </header>

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
                          {user.name.charAt(0)}
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
                        <button title="Ver usuario">
                          <Eye size={17} />
                        </button>
                        <button title="Editar usuario">
                          <Pencil size={17} />
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
    </div>
  );
}

export default Users;
