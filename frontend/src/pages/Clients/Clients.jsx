
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
import Modal from "../../components/common/Modal";
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

const emptyClient = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

function Clients() {
  const [clients, setClients] = useState(demoClients);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState(emptyClient);

  const [formError, setFormError] = useState("");

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedClient(null);
    setFormData(emptyClient);
    setFormError("");
    setIsModalOpen(true);
  };

  const openViewModal = (client) => {
    setModalMode("view");
    setSelectedClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (client) => {
    setModalMode("edit");
    setSelectedClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
    setFormData(emptyClient);
    setFormError("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      setFormError("Todos los campos son obligatorios.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError("Introduce un correo electrónico válido.");
      return;
    }

    if (modalMode === "create") {
      const newClient = {
        id: Date.now(),
        ...formData,
        pets: 0,
        status: "Activo",
      };

      setClients((previous) => [...previous, newClient]);
    }

    if (modalMode === "edit" && selectedClient) {
      setClients((previous) =>
        previous.map((client) =>
          client.id === selectedClient.id
            ? { ...client, ...formData }
            : client
        )
      );
    }

    closeModal();
  };

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
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
  }, [clients, search, statusFilter]);

  const activeClients = clients.filter(
    (client) => client.status === "Activo"
  ).length;

  const inactiveClients = clients.filter(
    (client) => client.status === "Inactivo"
  ).length;

  const totalPets = clients.reduce(
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

          <button
            className="clients-primary-btn"
            onClick={openCreateModal}
          >
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
              <h2>{clients.length}</h2>
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
                        <button
                          title="Ver cliente"
                          onClick={() => openViewModal(client)}
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          title="Editar cliente"
                          onClick={() => openEditModal(client)}
                        >
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

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={
            modalMode === "create"
              ? "Registrar nuevo cliente"
              : modalMode === "edit"
                ? "Editar cliente"
                : "Información del cliente"
          }
          description={
            modalMode === "view"
              ? "Consulta los datos registrados del propietario."
              : "Completa la información del propietario."
          }
          size="medium"
          footer={
            <>
              <button
                type="button"
                className="clients-secondary-btn"
                onClick={closeModal}
              >
                {modalMode === "view" ? "Cerrar" : "Cancelar"}
              </button>

              {modalMode !== "view" && (
                <button
                  type="submit"
                  form="client-form"
                  className="clients-primary-btn"
                >
                  {modalMode === "create"
                    ? "Guardar cliente"
                    : "Guardar cambios"}
                </button>
              )}
            </>
          }
        >
          <form id="client-form" onSubmit={handleSubmit}>
            <div className="client-form-grid">
              <div className="client-form-field">
                <label htmlFor="client-name">Nombre completo *</label>
                <input
                  id="client-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={modalMode === "view"}
                  placeholder="Ej. María González"
                />
              </div>

              <div className="client-form-field">
                <label htmlFor="client-email">Correo electrónico *</label>
                <input
                  id="client-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={modalMode === "view"}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="client-form-field">
                <label htmlFor="client-phone">Teléfono *</label>
                <input
                  id="client-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={modalMode === "view"}
                  placeholder="951 123 4567"
                />
              </div>

              <div className="client-form-field">
                <label htmlFor="client-address">Dirección *</label>
                <input
                  id="client-address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={modalMode === "view"}
                  placeholder="Colonia, ciudad"
                />
              </div>
            </div>

            {formError && (
              <p className="client-form-error">{formError}</p>
            )}
          </form>
        </Modal>
      </main>
    </div>
  );
}

export default Clients;

