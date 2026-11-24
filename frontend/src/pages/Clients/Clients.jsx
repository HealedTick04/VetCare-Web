
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Users,
  UserCheck,
  UserX,
  PawPrint,
  Eye,
  Pencil,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import "./Clients.css";

const demoClients = [
  {
    id: 1,
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "951 123 4567",
    address: "Centro, Oaxaca",
    pets: 2,
    status: "Activo",
  },
  {
    id: 2,
    name: "Carlos Ramírez",
    email: "carlos.ramirez@email.com",
    phone: "951 234 5678",
    address: "Reforma, Oaxaca",
    pets: 1,
    status: "Activo",
  },
  {
    id: 3,
    name: "Ana Martínez",
    email: "ana.martinez@email.com",
    phone: "951 345 6789",
    address: "Jalatlaco, Oaxaca",
    pets: 3,
    status: "Activo",
  },
  {
    id: 4,
    name: "Luis Hernández",
    email: "luis.hernandez@email.com",
    phone: "951 456 7890",
    address: "Xochimilco, Oaxaca",
    pets: 0,
    status: "Inactivo",
  },
  {
    id: 5,
    name: "Sofía Torres",
    email: "sofia.torres@email.com",
    phone: "951 567 8901",
    address: "Santa Lucía, Oaxaca",
    pets: 2,
    status: "Activo",
  },
];

function Clients() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const filteredClients = useMemo(() => {
    return demoClients.filter((client) => {
      const matchesSearch = [
        client.name,
        client.email,
        client.phone,
      ].some((value) =>
        value.toLowerCase().includes(search.toLowerCase())
      );

      const matchesStatus =
        statusFilter === "Todos" ||
        client.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const activeClients = demoClients.filter(
    (client) => client.status === "Activo"
  ).length;

  const inactiveClients = demoClients.filter(
    (client) => client.status === "Inactivo"
  ).length;

  const totalPets = demoClients.reduce(
    (total, client) => total + client.pets,
    0
  );

  return (
    <div className="clients-layout">
      <Sidebar role="VETERINARIAN" />

      <main className="clients-main">
        <header className="clients-header">
          <div>
            <span className="clients-breadcrumb">
              Gestión / Clientes
            </span>
            <h1>Clientes</h1>
            <p>
              Administra la información de los propietarios
              de las mascotas.
            </p>
          </div>

          <button className="clients-primary-btn">
            <Plus size={18} />
            Nuevo cliente
          </button>
        </header>

        <section className="clients-stats">
          <div className="client-stat-card">
            <div className="client-stat-icon blue">
              <Users size={22} />
            </div>
            <div>
              <span>Total de clientes</span>
              <h2>{demoClients.length}</h2>
            </div>
          </div>

          <div className="client-stat-card">
            <div className="client-stat-icon green">
              <UserCheck size={22} />
            </div>
            <div>
              <span>Clientes activos</span>
              <h2>{activeClients}</h2>
            </div>
          </div>

          <div className="client-stat-card">
            <div className="client-stat-icon orange">
              <UserX size={22} />
            </div>
            <div>
              <span>Clientes inactivos</span>
              <h2>{inactiveClients}</h2>
            </div>
          </div>

          <div className="client-stat-card">
            <div className="client-stat-icon purple">
              <PawPrint size={22} />
            </div>
            <div>
              <span>Mascotas registradas</span>
              <h2>{totalPets}</h2>
            </div>
          </div>
        </section>

        <section className="clients-content">
          <div className="clients-toolbar">
            <div className="clients-search">
              <Search size={19} />
              <input
                type="text"
                placeholder="Buscar por nombre, correo o teléfono..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Activo">Activos</option>
              <option value="Inactivo">Inactivos</option>
            </select>
          </div>

          <div className="clients-table-header">
            <div>
              <h2>Directorio de clientes</h2>
              <p>
                {filteredClients.length} clientes encontrados
              </p>
            </div>
          </div>

          <div className="clients-table-container">
            <table className="clients-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Dirección</th>
                  <th>Mascotas</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div className="client-name-cell">
                        <div className="client-avatar">
                          {client.name.charAt(0)}
                        </div>
                        <strong>{client.name}</strong>
                      </div>
                    </td>

                    <td>
                      <div className="client-contact">
                        <span>
                          <Mail size={14} />
                          {client.email}
                        </span>
                        <span>
                          <Phone size={14} />
                          {client.phone}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="client-address">
                        <MapPin size={14} />
                        {client.address}
                      </span>
                    </td>

                    <td>
                      <span className="client-pets">
                        <PawPrint size={15} />
                        {client.pets}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`client-status ${
                          client.status === "Activo"
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {client.status}
                      </span>
                    </td>

                    <td>
                      <div className="client-actions">
                        <button title="Ver cliente">
                          <Eye size={17} />
                        </button>
                        <button title="Editar cliente">
                          <Pencil size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan="6" className="clients-empty">
                      No se encontraron clientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Clients;
