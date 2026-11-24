
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pill,
  Activity,
  Clock,
  CheckCircle,
  PawPrint,
  CalendarDays,
  Eye,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import "./Treatments.css";

const demoTreatments = [
  {
    id: 1,
    pet: "Max",
    owner: "María González",
    treatment: "Tratamiento dermatológico",
    medication: "Antibiótico tópico",
    veterinarian: "Dr. Alejandro Ruiz",
    startDate: "18/11/2026",
    endDate: "28/11/2026",
    status: "En curso",
  },
  {
    id: 2,
    pet: "Luna",
    owner: "Carlos Ramírez",
    treatment: "Control de vacunación",
    medication: "Vacuna triple felina",
    veterinarian: "Dra. Laura Méndez",
    startDate: "15/11/2026",
    endDate: "15/11/2026",
    status: "Completado",
  },
  {
    id: 3,
    pet: "Rocky",
    owner: "Ana Martínez",
    treatment: "Tratamiento digestivo",
    medication: "Protector gástrico",
    veterinarian: "Dr. Alejandro Ruiz",
    startDate: "20/11/2026",
    endDate: "30/11/2026",
    status: "En curso",
  },
  {
    id: 4,
    pet: "Michi",
    owner: "Luis Hernández",
    treatment: "Control preventivo",
    medication: "Antiparasitario",
    veterinarian: "Dra. Laura Méndez",
    startDate: "22/11/2026",
    endDate: "22/11/2026",
    status: "Pendiente",
  },
  {
    id: 5,
    pet: "Coco",
    owner: "Sofía Torres",
    treatment: "Suplementación",
    medication: "Suplemento vitamínico",
    veterinarian: "Dr. Alejandro Ruiz",
    startDate: "10/11/2026",
    endDate: "20/11/2026",
    status: "Completado",
  },
];

function Treatments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const filteredTreatments = useMemo(() => {
    return demoTreatments.filter((treatment) => {
      const searchText = search.toLowerCase();

      const matchesSearch = [
        treatment.pet,
        treatment.owner,
        treatment.treatment,
        treatment.medication,
        treatment.veterinarian,
      ].some((value) => value.toLowerCase().includes(searchText));

      const matchesStatus =
        statusFilter === "Todos" ||
        treatment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const activeTreatments = demoTreatments.filter(
    (item) => item.status === "En curso"
  ).length;

  const completedTreatments = demoTreatments.filter(
    (item) => item.status === "Completado"
  ).length;

  const pendingTreatments = demoTreatments.filter(
    (item) => item.status === "Pendiente"
  ).length;

  return (
    <div className="treatments-layout">
      <Sidebar role="VETERINARIAN" />

      <main className="treatments-main">
        <header className="treatments-header">
          <div>
            <span className="treatments-breadcrumb">
              Gestión / Tratamientos
            </span>
            <h1>Tratamientos</h1>
            <p>
              Administra y supervisa los tratamientos de las mascotas.
            </p>
          </div>

          <button className="treatments-primary-btn">
            <Plus size={18} />
            Nuevo tratamiento
          </button>
        </header>

        <section className="treatments-stats">
          <div className="treatment-stat-card">
            <div className="treatment-stat-icon blue">
              <Pill size={22} />
            </div>
            <div>
              <span>Total de tratamientos</span>
              <h2>{demoTreatments.length}</h2>
            </div>
          </div>

          <div className="treatment-stat-card">
            <div className="treatment-stat-icon green">
              <Activity size={22} />
            </div>
            <div>
              <span>En curso</span>
              <h2>{activeTreatments}</h2>
            </div>
          </div>

          <div className="treatment-stat-card">
            <div className="treatment-stat-icon purple">
              <CheckCircle size={22} />
            </div>
            <div>
              <span>Completados</span>
              <h2>{completedTreatments}</h2>
            </div>
          </div>

          <div className="treatment-stat-card">
            <div className="treatment-stat-icon orange">
              <Clock size={22} />
            </div>
            <div>
              <span>Pendientes</span>
              <h2>{pendingTreatments}</h2>
            </div>
          </div>
        </section>

        <section className="treatments-content">
          <div className="treatments-toolbar">
            <div className="treatments-search">
              <Search size={19} />
              <input
                type="text"
                placeholder="Buscar mascota, tratamiento o medicamento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Todos">Todos los estados</option>
              <option value="En curso">En curso</option>
              <option value="Completado">Completados</option>
              <option value="Pendiente">Pendientes</option>
            </select>
          </div>

          <div className="treatments-table-header">
            <div>
              <h2>Registro de tratamientos</h2>
              <p>
                {filteredTreatments.length} tratamientos encontrados
              </p>
            </div>
          </div>

          <div className="treatments-table-container">
            <table className="treatments-table">
              <thead>
                <tr>
                  <th>Mascota</th>
                  <th>Tratamiento</th>
                  <th>Medicamento</th>
                  <th>Veterinario</th>
                  <th>Inicio</th>
                  <th>Finalización</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredTreatments.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="treatment-pet-cell">
                        <div className="treatment-pet-avatar">
                          <PawPrint size={18} />
                        </div>
                        <div>
                          <strong>{item.pet}</strong>
                          <span>{item.owner}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="treatment-name">
                        {item.treatment}
                      </span>
                    </td>

                    <td>{item.medication}</td>

                    <td>{item.veterinarian}</td>

                    <td>
                      <span className="treatment-date">
                        <CalendarDays size={14} />
                        {item.startDate}
                      </span>
                    </td>

                    <td>
                      <span className="treatment-date">
                        <CalendarDays size={14} />
                        {item.endDate}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`treatment-status ${
                          item.status === "En curso"
                            ? "ongoing"
                            : item.status === "Completado"
                              ? "completed"
                              : "pending"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <div className="treatment-actions">
                        <button title="Consultar tratamiento">
                          <Eye size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredTreatments.length === 0 && (
                  <tr>
                    <td colSpan="8" className="treatments-empty">
                      No se encontraron tratamientos.
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

export default Treatments;
