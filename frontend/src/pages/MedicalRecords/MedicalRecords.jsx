
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ClipboardList,
  PawPrint,
  CalendarDays,
  Eye,
  Stethoscope,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import "./MedicalRecords.css";

const demoRecords = [
  {
    id: 1,
    pet: "Max",
    species: "Perro",
    owner: "María González",
    veterinarian: "Dr. Alejandro Ruiz",
    date: "20/11/2026",
    reason: "Consulta general",
    diagnosis: "Dermatitis leve",
    status: "Finalizado",
  },
  {
    id: 2,
    pet: "Luna",
    species: "Gato",
    owner: "Carlos Ramírez",
    veterinarian: "Dra. Laura Méndez",
    date: "21/11/2026",
    reason: "Vacunación",
    diagnosis: "Vacunación aplicada",
    status: "Finalizado",
  },
  {
    id: 3,
    pet: "Rocky",
    species: "Perro",
    owner: "Ana Martínez",
    veterinarian: "Dr. Alejandro Ruiz",
    date: "22/11/2026",
    reason: "Problemas digestivos",
    diagnosis: "Gastritis",
    status: "En seguimiento",
  },
  {
    id: 4,
    pet: "Michi",
    species: "Gato",
    owner: "Luis Hernández",
    veterinarian: "Dra. Laura Méndez",
    date: "22/11/2026",
    reason: "Consulta general",
    diagnosis: "Pendiente de evaluación",
    status: "Pendiente",
  },
  {
    id: 5,
    pet: "Coco",
    species: "Ave",
    owner: "Sofía Torres",
    veterinarian: "Dr. Alejandro Ruiz",
    date: "23/11/2026",
    reason: "Revisión preventiva",
    diagnosis: "Sin alteraciones",
    status: "Finalizado",
  },
];

function MedicalRecords() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const filteredRecords = useMemo(() => {
    return demoRecords.filter((record) => {
      const searchText = search.toLowerCase();

      const matchesSearch = [
        record.pet,
        record.owner,
        record.veterinarian,
        record.reason,
        record.diagnosis,
      ].some((value) => value.toLowerCase().includes(searchText));

      const matchesStatus =
        statusFilter === "Todos" ||
        record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const completedRecords = demoRecords.filter(
    (record) => record.status === "Finalizado"
  ).length;

  const followUpRecords = demoRecords.filter(
    (record) => record.status === "En seguimiento"
  ).length;

  const pendingRecords = demoRecords.filter(
    (record) => record.status === "Pendiente"
  ).length;

  return (
    <div className="records-layout">
      <Sidebar role="VETERINARIAN" />

      <main className="records-main">
        <header className="records-header">
          <div>
            <span className="records-breadcrumb">
              Gestión / Expedientes médicos
            </span>
            <h1>Expedientes médicos</h1>
            <p>
              Consulta y administra el historial clínico de las mascotas.
            </p>
          </div>

          <button className="records-primary-btn">
            <Plus size={18} />
            Nuevo expediente
          </button>
        </header>

        <section className="records-stats">
          <div className="record-stat-card">
            <div className="record-stat-icon blue">
              <ClipboardList size={22} />
            </div>
            <div>
              <span>Total de expedientes</span>
              <h2>{demoRecords.length}</h2>
            </div>
          </div>

          <div className="record-stat-card">
            <div className="record-stat-icon green">
              <Stethoscope size={22} />
            </div>
            <div>
              <span>Finalizados</span>
              <h2>{completedRecords}</h2>
            </div>
          </div>

          <div className="record-stat-card">
            <div className="record-stat-icon orange">
              <CalendarDays size={22} />
            </div>
            <div>
              <span>En seguimiento</span>
              <h2>{followUpRecords}</h2>
            </div>
          </div>

          <div className="record-stat-card">
            <div className="record-stat-icon purple">
              <ClipboardList size={22} />
            </div>
            <div>
              <span>Pendientes</span>
              <h2>{pendingRecords}</h2>
            </div>
          </div>
        </section>

        <section className="records-content">
          <div className="records-toolbar">
            <div className="records-search">
              <Search size={19} />
              <input
                type="text"
                placeholder="Buscar mascota, propietario o diagnóstico..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Finalizado">Finalizados</option>
              <option value="En seguimiento">En seguimiento</option>
              <option value="Pendiente">Pendientes</option>
            </select>
          </div>

          <div className="records-table-header">
            <div>
              <h2>Historial clínico</h2>
              <p>
                {filteredRecords.length} expedientes encontrados
              </p>
            </div>
          </div>

          <div className="records-table-container">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Mascota</th>
                  <th>Propietario</th>
                  <th>Fecha</th>
                  <th>Motivo</th>
                  <th>Diagnóstico</th>
                  <th>Veterinario</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <div className="record-pet-cell">
                        <div className="record-pet-avatar">
                          <PawPrint size={18} />
                        </div>
                        <div>
                          <strong>{record.pet}</strong>
                          <span>{record.species}</span>
                        </div>
                      </div>
                    </td>

                    <td>{record.owner}</td>

                    <td>
                      <span className="record-date">
                        <CalendarDays size={14} />
                        {record.date}
                      </span>
                    </td>

                    <td>{record.reason}</td>

                    <td>
                      <span className="record-diagnosis">
                        {record.diagnosis}
                      </span>
                    </td>

                    <td>{record.veterinarian}</td>

                    <td>
                      <span
                        className={`record-status ${
                          record.status === "Finalizado"
                            ? "completed"
                            : record.status === "En seguimiento"
                              ? "follow-up"
                              : "pending"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>

                    <td>
                      <div className="record-actions">
                        <button title="Consultar expediente">
                          <Eye size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan="8" className="records-empty">
                      No se encontraron expedientes médicos.
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

export default MedicalRecords;
