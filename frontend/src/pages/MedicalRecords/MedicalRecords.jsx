
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ClipboardList,
  PawPrint,
  CalendarDays,
  Eye,
  Pencil,
  Stethoscope,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Modal from "../../components/common/Modal";
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
    symptoms: "Enrojecimiento en la piel.",
    diagnosis: "Dermatitis leve",
    treatment: "Aplicación de tratamiento tópico.",
    weight: "28",
    temperature: "38.5",
    observations: "Se recomienda revisión en una semana.",
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
    symptoms: "Sin síntomas reportados.",
    diagnosis: "Vacunación aplicada",
    treatment: "Aplicación de vacuna correspondiente.",
    weight: "4.5",
    temperature: "38.2",
    observations: "",
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
    symptoms: "Vómitos y pérdida de apetito.",
    diagnosis: "Gastritis",
    treatment: "Tratamiento médico y dieta especial.",
    weight: "18",
    temperature: "39",
    observations: "Requiere seguimiento.",
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
    symptoms: "Pendiente de evaluación.",
    diagnosis: "Pendiente de evaluación",
    treatment: "",
    weight: "",
    temperature: "",
    observations: "",
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
    symptoms: "Sin síntomas reportados.",
    diagnosis: "Sin alteraciones",
    treatment: "Revisión preventiva.",
    weight: "0.1",
    temperature: "",
    observations: "",
    status: "Finalizado",
  },
];

const emptyForm = {
  pet: "",
  species: "",
  owner: "",
  veterinarian: "",
  date: new Date().toLocaleDateString("en-CA"),
  reason: "",
  symptoms: "",
  diagnosis: "",
  treatment: "",
  weight: "",
  temperature: "",
  observations: "",
  status: "Pendiente",
};

const veterinarians = [
  "Dr. Alejandro Ruiz",
  "Dra. Laura Méndez",
];

function formatDateForInput(date) {
  if (!date) return "";

  const parts = date.split("/");

  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
  }

  return date;
}

function formatDateForDisplay(date) {
  if (!date) return "";

  const parts = date.split("-");

  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  return date;
}

function MedicalRecords() {
  const [records, setRecords] = useState(demoRecords);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const searchText = search.toLowerCase();

      const matchesSearch = [
        record.pet,
        record.species,
        record.owner,
        record.veterinarian,
        record.reason,
        record.diagnosis,
      ].some((value) =>
        (value || "").toLowerCase().includes(searchText)
      );

      const matchesStatus =
        statusFilter === "Todos" ||
        record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const completedRecords = records.filter(
    (record) => record.status === "Finalizado"
  ).length;

  const followUpRecords = records.filter(
    (record) => record.status === "En seguimiento"
  ).length;

  const pendingRecords = records.filter(
    (record) => record.status === "Pendiente"
  ).length;

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedRecord(null);
    setFormData(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openViewModal = (record) => {
    setModalMode("view");
    setSelectedRecord(record);
    setFormData({
      ...emptyForm,
      ...record,
      date: formatDateForInput(record.date),
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setModalMode("edit");
    setSelectedRecord(record);
    setFormData({
      ...emptyForm,
      ...record,
      date: formatDateForInput(record.date),
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setFormError("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.pet.trim() ||
      !formData.species ||
      !formData.owner.trim() ||
      !formData.veterinarian ||
      !formData.date ||
      !formData.reason.trim() ||
      !formData.diagnosis.trim()
    ) {
      setFormError(
        "Completa todos los campos obligatorios."
      );
      return;
    }

    const recordData = {
      ...formData,
      date: formatDateForDisplay(formData.date),
    };

    if (modalMode === "create") {
      const newRecord = {
        ...recordData,
        id: Date.now(),
      };

      setRecords((previous) => [
        ...previous,
        newRecord,
      ]);
    }

    if (modalMode === "edit" && selectedRecord) {
      setRecords((previous) =>
        previous.map((record) =>
          record.id === selectedRecord.id
            ? { ...record, ...recordData }
            : record
        )
      );
    }

    closeModal();
  };

  const isReadOnly = modalMode === "view";

  const modalTitle = {
    create: "Nuevo expediente médico",
    view: "Consultar expediente médico",
    edit: "Editar expediente médico",
  }[modalMode];

  const modalDescription = {
    create: "Registra la información de la consulta médica.",
    view: "Consulta los detalles del historial clínico.",
    edit: "Actualiza la información médica de esta consulta.",
  }[modalMode];

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

          <button
            className="records-primary-btn"
            onClick={openCreateModal}
          >
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
              <h2>{records.length}</h2>
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
                        <button
                          title="Consultar expediente"
                          onClick={() => openViewModal(record)}
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          title="Editar expediente"
                          onClick={() => openEditModal(record)}
                        >
                          <Pencil size={17} />
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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        description={modalDescription}
        size="large"
        footer={
          <>
            <button
              type="button"
              className="records-secondary-btn"
              onClick={closeModal}
            >
              {isReadOnly ? "Cerrar" : "Cancelar"}
            </button>

            {!isReadOnly && (
              <button
                type="submit"
                form="medical-record-form"
                className="records-primary-btn"
              >
                {modalMode === "create"
                  ? "Registrar expediente"
                  : "Guardar cambios"}
              </button>
            )}
          </>
        }
      >
        <form
          id="medical-record-form"
          onSubmit={handleSubmit}
        >
          <div className="record-form-grid">
            <div className="record-form-field">
              <label htmlFor="record-pet">Nombre de la mascota *</label>
              <input
                id="record-pet"
                name="pet"
                value={formData.pet}
                onChange={handleInputChange}
                placeholder="Ej. Max"
                disabled={isReadOnly}
              />
            </div>

            <div className="record-form-field">
              <label htmlFor="record-species">Especie *</label>
              <select
                id="record-species"
                name="species"
                value={formData.species}
                onChange={handleInputChange}
                disabled={isReadOnly}
              >
                <option value="">Selecciona una especie</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Pez">Pez</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="record-form-field">
              <label htmlFor="record-owner">Propietario *</label>
              <input
                id="record-owner"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                placeholder="Nombre del propietario"
                disabled={isReadOnly}
              />
            </div>

            <div className="record-form-field">
              <label htmlFor="record-veterinarian">Veterinario *</label>
              <select
                id="record-veterinarian"
                name="veterinarian"
                value={formData.veterinarian}
                onChange={handleInputChange}
                disabled={isReadOnly}
              >
                <option value="">Selecciona un veterinario</option>
                {veterinarians.map((veterinarian) => (
                  <option
                    key={veterinarian}
                    value={veterinarian}
                  >
                    {veterinarian}
                  </option>
                ))}
              </select>
            </div>

            <div className="record-form-field">
              <label htmlFor="record-date">Fecha de consulta *</label>
              <input
                id="record-date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                disabled={isReadOnly}
              />
            </div>

            <div className="record-form-field">
              <label htmlFor="record-reason">Motivo de consulta *</label>
              <input
                id="record-reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Ej. Consulta general"
                disabled={isReadOnly}
              />
            </div>

            <div className="record-form-field">
              <label htmlFor="record-weight">Peso (kg)</label>
              <input
                id="record-weight"
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="Ej. 12.5"
                min="0"
                step="0.01"
                disabled={isReadOnly}
              />
            </div>

            <div className="record-form-field">
              <label htmlFor="record-temperature">
                Temperatura (°C)
              </label>
              <input
                id="record-temperature"
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleInputChange}
                placeholder="Ej. 38.5"
                min="0"
                step="0.1"
                disabled={isReadOnly}
              />
            </div>

            <div className="record-form-field record-form-full">
              <label htmlFor="record-symptoms">Síntomas</label>
              <textarea
                id="record-symptoms"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                placeholder="Describe los síntomas observados..."
                rows="2"
                disabled={isReadOnly}
              />
            </div>

            <div className="record-form-field record-form-full">
              <label htmlFor="record-diagnosis">Diagnóstico *</label>
              <textarea
                id="record-diagnosis"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                placeholder="Diagnóstico médico..."
                rows="2"
                disabled={isReadOnly}
              />
            </div>

            <div className="record-form-field record-form-full">
              <label htmlFor="record-treatment">Tratamiento</label>
              <textarea
                id="record-treatment"
                name="treatment"
                value={formData.treatment}
                onChange={handleInputChange}
                placeholder="Tratamiento indicado..."
                rows="2"
                disabled={isReadOnly}
              />
            </div>

            <div className="record-form-field record-form-full">
              <label htmlFor="record-observations">Observaciones</label>
              <textarea
                id="record-observations"
                name="observations"
                value={formData.observations}
                onChange={handleInputChange}
                placeholder="Notas adicionales..."
                rows="2"
                disabled={isReadOnly}
              />
            </div>

            <div className="record-form-field record-form-full">
              <label htmlFor="record-status">Estado del expediente</label>
              <select
                id="record-status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={isReadOnly}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En seguimiento">En seguimiento</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>
          </div>

          {formError && (
            <p className="record-form-error">{formError}</p>
          )}
        </form>
      </Modal>
    </div>
  );
}

export default MedicalRecords;