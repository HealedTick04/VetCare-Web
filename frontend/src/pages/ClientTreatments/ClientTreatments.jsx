
import { useMemo, useState } from "react";
import {
  Search,
  Pill,
  PawPrint,
  CalendarDays,
  Clock,
  CheckCircle,
  AlertCircle,
  ClipboardList,
  Eye,
  Stethoscope,
  FileText,
  XCircle,
} from "lucide-react";

import ClientSidebar from "../../components/layout/ClientSidebar";
import Modal from "../../components/common/Modal";
import "./ClientTreatments.css";

const demoTreatments = [
  {
    id: 1,
    petName: "Max",
    species: "Perro",
    treatmentName: "Tratamiento dermatológico",
    medication: "Cefalexina",
    dosage: "250 mg",
    frequency: "Cada 12 horas",
    duration: "14 días",
    instructions:
      "Administrar después de los alimentos. Mantener limpia y seca la zona afectada.",
    veterinarian: "Dra. Ana Martínez",
    startDate: "2026-11-20",
    endDate: "2026-12-04",
    status: "ACTIVE",
    observations:
      "Revisar la evolución de la irritación en la siguiente consulta.",
  },
  {
    id: 2,
    petName: "Luna",
    species: "Gato",
    treatmentName: "Desparasitación interna",
    medication: "Prazicuantel",
    dosage: "50 mg",
    frequency: "Dosis única",
    duration: "1 día",
    instructions:
      "Administrar la dosis indicada por el veterinario. Vigilar posibles reacciones.",
    veterinarian: "Dr. Carlos Hernández",
    startDate: "2026-11-15",
    endDate: "2026-11-15",
    status: "COMPLETED",
    observations: "Tratamiento finalizado sin incidencias reportadas.",
  },
  {
    id: 3,
    petName: "Max",
    species: "Perro",
    treatmentName: "Suplementación articular",
    medication: "Glucosamina",
    dosage: "500 mg",
    frequency: "Una vez al día",
    duration: "30 días",
    instructions:
      "Administrar junto con el alimento y seguir la duración indicada.",
    veterinarian: "Dra. Ana Martínez",
    startDate: "2026-11-27",
    endDate: "2026-12-27",
    status: "PENDING",
    observations: "Tratamiento indicado para iniciar en la fecha señalada.",
  },
  {
    id: 4,
    petName: "Luna",
    species: "Gato",
    treatmentName: "Tratamiento oftálmico",
    medication: "Gotas oftálmicas",
    dosage: "1 gota",
    frequency: "Cada 8 horas",
    duration: "7 días",
    instructions:
      "Aplicar cuidadosamente en el ojo indicado, evitando tocarlo con el aplicador.",
    veterinarian: "Dr. Carlos Hernández",
    startDate: "2026-10-03",
    endDate: "2026-10-10",
    status: "COMPLETED",
    observations: "Se completó el tratamiento según las indicaciones.",
  },
];

const statusConfig = {
  PENDING: {
    label: "Pendiente",
    className: "pending",
    icon: AlertCircle,
  },
  ACTIVE: {
    label: "En curso",
    className: "active",
    icon: Clock,
  },
  COMPLETED: {
    label: "Completado",
    className: "completed",
    icon: CheckCircle,
  },
};

const formatDate = (date) => {
  if (!date) return "No especificada";

  return new Date(`${date}T12:00:00`).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

function ClientTreatments() {
  const [treatments] = useState(demoTreatments);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  const filteredTreatments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return treatments.filter((treatment) => {
      const matchesSearch =
        !normalizedSearch ||
        treatment.petName.toLowerCase().includes(normalizedSearch) ||
        treatment.treatmentName.toLowerCase().includes(normalizedSearch) ||
        treatment.medication.toLowerCase().includes(normalizedSearch) ||
        treatment.veterinarian.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        selectedStatus === "ALL" ||
        treatment.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [treatments, searchTerm, selectedStatus]);

  const pendingCount = treatments.filter(
    (treatment) => treatment.status === "PENDING"
  ).length;

  const activeCount = treatments.filter(
    (treatment) => treatment.status === "ACTIVE"
  ).length;

  const completedCount = treatments.filter(
    (treatment) => treatment.status === "COMPLETED"
  ).length;

  const getStatus = (status) => {
    return statusConfig[status] || statusConfig.PENDING;
  };

  return (
    <div className="client-treatments-layout">
      <ClientSidebar />

      <main className="client-treatments-main">
        <header className="client-treatments-header">
          <div>
            <span className="client-treatments-eyebrow">
              CUIDADO DE TUS MASCOTAS
            </span>

            <h1>Tratamientos</h1>

            <p>
              Consulta los tratamientos, medicamentos e indicaciones
              veterinarias de tus mascotas.
            </p>
          </div>
        </header>

        <section className="client-treatments-stats">
          <article className="client-treatment-stat-card">
            <div className="client-treatment-stat-icon blue">
              <ClipboardList size={22} />
            </div>

            <div>
              <span>Total de tratamientos</span>
              <strong>{treatments.length}</strong>
            </div>
          </article>

          <article className="client-treatment-stat-card">
            <div className="client-treatment-stat-icon orange">
              <Clock size={22} />
            </div>

            <div>
              <span>En curso</span>
              <strong>{activeCount}</strong>
            </div>
          </article>

          <article className="client-treatment-stat-card">
            <div className="client-treatment-stat-icon green">
              <CheckCircle size={22} />
            </div>

            <div>
              <span>Completados</span>
              <strong>{completedCount}</strong>
            </div>
          </article>

          <article className="client-treatment-stat-card">
            <div className="client-treatment-stat-icon purple">
              <AlertCircle size={22} />
            </div>

            <div>
              <span>Pendientes</span>
              <strong>{pendingCount}</strong>
            </div>
          </article>
        </section>

        <section className="client-treatments-panel">
          <div className="client-treatments-panel-header">
            <div>
              <h2>Tratamientos de mis mascotas</h2>
              <p>
                Revisa el seguimiento y las indicaciones de cada tratamiento.
              </p>
            </div>
          </div>

          <div className="client-treatments-toolbar">
            <div className="client-treatments-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Buscar mascota, tratamiento, medicamento..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <select
              className="client-treatments-filter"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              aria-label="Filtrar tratamientos por estado"
            >
              <option value="ALL">Todos los estados</option>
              <option value="PENDING">Pendientes</option>
              <option value="ACTIVE">En curso</option>
              <option value="COMPLETED">Completados</option>
            </select>
          </div>

          {filteredTreatments.length === 0 ? (
            <div className="client-treatments-empty">
              <ClipboardList size={38} />
              <h3>No se encontraron tratamientos</h3>
              <p>
                Prueba con otro término de búsqueda o cambia el filtro
                seleccionado.
              </p>
            </div>
          ) : (
            <div className="client-treatments-table-wrapper">
              <table className="client-treatments-table">
                <thead>
                  <tr>
                    <th>Mascota</th>
                    <th>Tratamiento</th>
                    <th>Medicamento</th>
                    <th>Veterinario</th>
                    <th>Periodo</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTreatments.map((treatment) => {
                    const status = getStatus(treatment.status);
                    const StatusIcon = status.icon;

                    return (
                      <tr key={treatment.id}>
                        <td>
                          <div className="client-treatment-pet-cell">
                            <div className="client-treatment-pet-icon">
                              <PawPrint size={18} />
                            </div>

                            <div>
                              <strong>{treatment.petName}</strong>
                              <span>{treatment.species}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <strong className="client-treatment-name">
                            {treatment.treatmentName}
                          </strong>
                        </td>

                        <td>
                          <span className="client-treatment-medication">
                            <Pill size={15} />
                            {treatment.medication}
                          </span>
                        </td>

                        <td>
                          <span className="client-treatment-veterinarian">
                            {treatment.veterinarian}
                          </span>
                        </td>

                        <td>
                          <div className="client-treatment-period">
                            <span>{formatDate(treatment.startDate)}</span>
                            <small>
                              Hasta {formatDate(treatment.endDate)}
                            </small>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`client-treatment-status ${status.className}`}
                          >
                            <StatusIcon size={14} />
                            {status.label}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="client-treatment-view-button"
                            onClick={() => setSelectedTreatment(treatment)}
                            aria-label={`Consultar ${treatment.treatmentName}`}
                          >
                            <Eye size={16} />
                            Consultar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="client-treatments-results">
            Mostrando {filteredTreatments.length} de {treatments.length} tratamientos
          </div>
        </section>

        <section className="client-treatments-reminder">
          <div className="client-treatments-reminder-icon">
            <AlertCircle size={21} />
          </div>

          <div>
            <h3>Recuerda seguir las indicaciones veterinarias</h3>
            <p>
              Administra los medicamentos conforme a las dosis y horarios
              indicados por el veterinario. Si tienes dudas sobre un
              tratamiento, contacta a la clínica.
            </p>
          </div>
        </section>
      </main>

      <Modal
        isOpen={Boolean(selectedTreatment)}
        onClose={() => setSelectedTreatment(null)}
        title="Detalle del tratamiento"
        description={
          selectedTreatment
            ? `${selectedTreatment.treatmentName} · ${selectedTreatment.petName}`
            : ""
        }
        size="large"
        footer={
          <button
            type="button"
            className="client-treatment-modal-close"
            onClick={() => setSelectedTreatment(null)}
          >
            Cerrar
          </button>
        }
      >
        {selectedTreatment && (
          <div className="client-treatment-detail">
            <div className="client-treatment-detail-status">
              {(() => {
                const status = getStatus(selectedTreatment.status);
                const StatusIcon = status.icon;

                return (
                  <span className={`client-treatment-status ${status.className}`}>
                    <StatusIcon size={14} />
                    {status.label}
                  </span>
                );
              })()}
            </div>

            <div className="client-treatment-detail-grid">
              <div className="client-treatment-detail-item">
                <span>Mascota</span>
                <strong>{selectedTreatment.petName}</strong>
              </div>

              <div className="client-treatment-detail-item">
                <span>Especie</span>
                <strong>{selectedTreatment.species}</strong>
              </div>

              <div className="client-treatment-detail-item">
                <span>Veterinario responsable</span>
                <strong>{selectedTreatment.veterinarian}</strong>
              </div>

              <div className="client-treatment-detail-item">
                <span>Duración</span>
                <strong>{selectedTreatment.duration}</strong>
              </div>
            </div>

            <div className="client-treatment-detail-section">
              <h3>
                <Pill size={17} />
                Medicación
              </h3>

              <div className="client-treatment-medication-card">
                <strong>{selectedTreatment.medication}</strong>

                <div>
                  <span>Dosis: {selectedTreatment.dosage}</span>
                  <span>Frecuencia: {selectedTreatment.frequency}</span>
                </div>
              </div>
            </div>

            <div className="client-treatment-detail-section">
              <h3>
                <CalendarDays size={17} />
                Periodo del tratamiento
              </h3>

              <div className="client-treatment-date-range">
                <div>
                  <span>Fecha de inicio</span>
                  <strong>{formatDate(selectedTreatment.startDate)}</strong>
                </div>

                <div>
                  <span>Fecha de finalización</span>
                  <strong>{formatDate(selectedTreatment.endDate)}</strong>
                </div>
              </div>
            </div>

            <div className="client-treatment-detail-section">
              <h3>
                <FileText size={17} />
                Indicaciones
              </h3>

              <p>{selectedTreatment.instructions}</p>
            </div>

            <div className="client-treatment-detail-section">
              <h3>
                <Stethoscope size={17} />
                Observaciones veterinarias
              </h3>

              <p>{selectedTreatment.observations}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ClientTreatments;
