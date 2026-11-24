
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Stethoscope,
  Syringe,
  Scissors,
  HeartPulse,
  Clock,
  Eye,
  Pencil,
  Activity,
  Power,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Modal from "../../components/common/Modal";
import "./Services.css";

const demoServices = [
  {
    id: 1,
    name: "Consulta general",
    category: "Consulta",
    description: "Evaluación general del estado de salud de la mascota.",
    duration: 30,
    price: 350,
    status: "Activo",
    icon: "stethoscope",
  },
  {
    id: 2,
    name: "Vacunación",
    category: "Prevención",
    description: "Aplicación de vacunas según el esquema correspondiente.",
    duration: 20,
    price: 250,
    status: "Activo",
    icon: "syringe",
  },
  {
    id: 3,
    name: "Desparasitación",
    category: "Prevención",
    description: "Tratamiento preventivo contra parásitos internos y externos.",
    duration: 20,
    price: 180,
    status: "Activo",
    icon: "heart",
  },
  {
    id: 4,
    name: "Estética canina",
    category: "Estética",
    description: "Baño, cepillado y arreglo general de la mascota.",
    duration: 60,
    price: 450,
    status: "Activo",
    icon: "scissors",
  },
  {
    id: 5,
    name: "Curaciones",
    category: "Tratamiento",
    description: "Limpieza y atención de heridas superficiales.",
    duration: 30,
    price: 280,
    status: "Activo",
    icon: "activity",
  },
  {
    id: 6,
    name: "Cirugía general",
    category: "Cirugía",
    description: "Procedimientos quirúrgicos programados.",
    duration: 120,
    price: 2500,
    status: "Inactivo",
    icon: "stethoscope",
  },
];

const emptyForm = {
  name: "",
  category: "Consulta",
  description: "",
  duration: "",
  price: "",
  status: "Activo",
  icon: "stethoscope",
};

function ServiceIcon({ type }) {
  const icons = {
    stethoscope: <Stethoscope size={22} />,
    syringe: <Syringe size={22} />,
    scissors: <Scissors size={22} />,
    heart: <HeartPulse size={22} />,
    activity: <Activity size={22} />,
  };

  return icons[type] || <Stethoscope size={22} />;
}

function Services() {
  const [services, setServices] = useState(demoServices);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const searchText = search.toLowerCase();

      const matchesSearch = [
        service.name,
        service.category,
        service.description,
      ].some((value) =>
        value.toLowerCase().includes(searchText)
      );

      const matchesCategory =
        categoryFilter === "Todas" ||
        service.category === categoryFilter;

      const matchesStatus =
        statusFilter === "Todos" ||
        service.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, search, categoryFilter, statusFilter]);

  const activeServices = services.filter(
    (service) => service.status === "Activo"
  ).length;

  const inactiveServices = services.filter(
    (service) => service.status === "Inactivo"
  ).length;

  const categories = new Set(
    services.map((service) => service.category)
  ).size;

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedService(null);
    setFormData(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openViewModal = (service) => {
    setModalMode("view");
    setSelectedService(service);
    setFormData({
      ...service,
      duration: String(service.duration),
      price: String(service.price),
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setModalMode("edit");
    setSelectedService(service);
    setFormData({
      ...service,
      duration: String(service.duration),
      price: String(service.price),
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    setFormError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.category ||
      !formData.description.trim() ||
      !formData.duration ||
      !formData.price
    ) {
      setFormError("Completa todos los campos obligatorios.");
      return;
    }

    const duration = Number(formData.duration);
    const price = Number(formData.price);

    if (
      !Number.isFinite(duration) ||
      !Number.isInteger(duration) ||
      duration <= 0 ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setFormError(
        "La duración y el precio deben ser números mayores que cero."
      );
      return;
    }

    const serviceData = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      duration,
      price,
    };

    if (modalMode === "create") {
      const newService = {
        id: Date.now(),
        ...serviceData,
      };

      setServices((previous) => [
        newService,
        ...previous,
      ]);
    }

    if (modalMode === "edit" && selectedService) {
      setServices((previous) =>
        previous.map((service) =>
          service.id === selectedService.id
            ? { ...service, ...serviceData }
            : service
        )
      );
    }

    closeModal();
  };

  const toggleServiceStatus = (service) => {
    const newStatus =
      service.status === "Activo" ? "Inactivo" : "Activo";

    const confirmed = window.confirm(
      `¿Deseas ${newStatus === "Activo" ? "activar" : "desactivar"} el servicio "${service.name}"?`
    );

    if (!confirmed) return;

    setServices((previous) =>
      previous.map((item) =>
        item.id === service.id
          ? { ...item, status: newStatus }
          : item
      )
    );
  };

  const modalTitle =
    modalMode === "create"
      ? "Nuevo servicio"
      : modalMode === "edit"
        ? "Editar servicio"
        : "Detalles del servicio";

  return (
    <div className="services-layout">
      <Sidebar role="VETERINARIAN" />

      <main className="services-main">
        <header className="services-header">
          <div>
            <span className="services-breadcrumb">
              Gestión / Servicios
            </span>
            <h1>Servicios</h1>
            <p>
              Administra los servicios y tarifas de la clínica veterinaria.
            </p>
          </div>

          <button
            className="services-primary-btn"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Nuevo servicio
          </button>
        </header>

        <section className="services-stats">
          <div className="service-stat-card">
            <div className="service-stat-icon blue">
              <Stethoscope size={22} />
            </div>
            <div>
              <span>Total de servicios</span>
              <h2>{services.length}</h2>
            </div>
          </div>

          <div className="service-stat-card">
            <div className="service-stat-icon green">
              <Activity size={22} />
            </div>
            <div>
              <span>Servicios activos</span>
              <h2>{activeServices}</h2>
            </div>
          </div>

          <div className="service-stat-card">
            <div className="service-stat-icon orange">
              <Clock size={22} />
            </div>
            <div>
              <span>Servicios inactivos</span>
              <h2>{inactiveServices}</h2>
            </div>
          </div>

          <div className="service-stat-card">
            <div className="service-stat-icon purple">
              <HeartPulse size={22} />
            </div>
            <div>
              <span>Categorías</span>
              <h2>{categories}</h2>
            </div>
          </div>
        </section>

        <section className="services-content">
          <div className="services-toolbar">
            <div className="services-search">
              <Search size={19} />
              <input
                type="text"
                placeholder="Buscar servicio o descripción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="Todas">Todas las categorías</option>
              <option value="Consulta">Consulta</option>
              <option value="Prevención">Prevención</option>
              <option value="Estética">Estética</option>
              <option value="Tratamiento">Tratamiento</option>
              <option value="Cirugía">Cirugía</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Activo">Activos</option>
              <option value="Inactivo">Inactivos</option>
            </select>
          </div>

          <div className="services-table-header">
            <div>
              <h2>Catálogo de servicios</h2>
              <p>
                {filteredServices.length} servicios encontrados
              </p>
            </div>
          </div>

          <div className="services-table-container">
            <table className="services-table">
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th>Duración</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="service-name-cell">
                        <div className="service-avatar">
                          <ServiceIcon type={service.icon} />
                        </div>
                        <strong>{service.name}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="service-category">
                        {service.category}
                      </span>
                    </td>

                    <td className="service-description">
                      {service.description}
                    </td>

                    <td>
                      <span className="service-duration">
                        <Clock size={14} />
                        {service.duration} min
                      </span>
                    </td>

                    <td>
                      <strong className="service-price">
                        ${service.price.toLocaleString("es-MX")} MXN
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`service-status ${
                          service.status === "Activo"
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {service.status}
                      </span>
                    </td>

                    <td>
                      <div className="service-actions">
                        <button
                          title="Ver servicio"
                          onClick={() => openViewModal(service)}
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          title="Editar servicio"
                          onClick={() => openEditModal(service)}
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          className="service-toggle-btn"
                          title={
                            service.status === "Activo"
                              ? "Desactivar servicio"
                              : "Activar servicio"
                          }
                          onClick={() => toggleServiceStatus(service)}
                        >
                          <Power size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredServices.length === 0 && (
                  <tr>
                    <td colSpan="7" className="services-empty">
                      No se encontraron servicios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        description={
          modalMode === "view"
            ? "Consulta la información del servicio seleccionado."
            : "Completa la información del servicio de la clínica."
        }
        size="large"
        footer={
          <>
            <button
              type="button"
              className="services-secondary-btn"
              onClick={closeModal}
            >
              {modalMode === "view" ? "Cerrar" : "Cancelar"}
            </button>

            {modalMode !== "view" && (
              <button
                type="submit"
                form="service-form"
                className="services-primary-btn"
              >
                {modalMode === "create"
                  ? "Guardar servicio"
                  : "Guardar cambios"}
              </button>
            )}
          </>
        }
      >
        <form
          id="service-form"
          onSubmit={handleSubmit}
        >
          <div className="service-form-grid">
            <div className="service-form-field">
              <label>Nombre del servicio *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej. Consulta general"
                disabled={modalMode === "view"}
              />
            </div>

            <div className="service-form-field">
              <label>Categoría *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={modalMode === "view"}
              >
                <option value="Consulta">Consulta</option>
                <option value="Prevención">Prevención</option>
                <option value="Estética">Estética</option>
                <option value="Tratamiento">Tratamiento</option>
                <option value="Cirugía">Cirugía</option>
              </select>
            </div>

            <div className="service-form-field">
              <label>Duración (minutos) *</label>
              <input
                type="number"
                name="duration"
                min="1"
                step="1"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="Ej. 30"
                disabled={modalMode === "view"}
              />
            </div>

            <div className="service-form-field">
              <label>Precio (MXN) *</label>
              <input
                type="number"
                name="price"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Ej. 350"
                disabled={modalMode === "view"}
              />
            </div>

            <div className="service-form-field">
              <label>Icono del servicio</label>
              <select
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                disabled={modalMode === "view"}
              >
                <option value="stethoscope">Estetoscopio</option>
                <option value="syringe">Jeringa</option>
                <option value="scissors">Tijeras</option>
                <option value="heart">Corazón</option>
                <option value="activity">Actividad</option>
              </select>
            </div>

            <div className="service-form-field">
              <label>Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={modalMode === "view"}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div className="service-form-field service-form-full">
              <label>Descripción *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe en qué consiste el servicio..."
                disabled={modalMode === "view"}
              />
            </div>
          </div>

          {formError && (
            <p className="service-form-error">
              {formError}
            </p>
          )}
        </form>
      </Modal>
    </div>
  );
}

export default Services;
