
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
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
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
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const filteredServices = useMemo(() => {
    return demoServices.filter((service) => {
      const searchText = search.toLowerCase();

      const matchesSearch = [
        service.name,
        service.category,
        service.description,
      ].some((value) => value.toLowerCase().includes(searchText));

      const matchesCategory =
        categoryFilter === "Todas" ||
        service.category === categoryFilter;

      const matchesStatus =
        statusFilter === "Todos" ||
        service.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, categoryFilter, statusFilter]);

  const activeServices = demoServices.filter(
    (service) => service.status === "Activo"
  ).length;

  const inactiveServices = demoServices.filter(
    (service) => service.status === "Inactivo"
  ).length;

  const categories = new Set(
    demoServices.map((service) => service.category)
  ).size;

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

          <button className="services-primary-btn">
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
              <h2>{demoServices.length}</h2>
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
                        <button title="Ver servicio">
                          <Eye size={17} />
                        </button>
                        <button title="Editar servicio">
                          <Pencil size={17} />
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
    </div>
  );
}

export default Services;
