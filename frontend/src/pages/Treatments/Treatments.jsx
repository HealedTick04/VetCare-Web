
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
  Pencil,
  Check,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Modal from "../../components/common/Modal";
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
    description: "Tratamiento para controlar una infección en la piel.",
    instructions: "Aplicar dos veces al día.",
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
    description: "Aplicación de vacuna preventiva.",
    instructions: "Mantener observación después de la aplicación.",
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
    description: "Tratamiento para molestias digestivas.",
    instructions: "Administrar según indicaciones veterinarias.",
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
    description: "Aplicación de antiparasitario.",
    instructions: "Revisar nuevamente en la próxima consulta.",
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
    description: "Suplementación para mejorar su estado nutricional.",
    instructions: "Administrar una dosis diaria.",
    status: "Completado",
  },
];

const emptyForm = {
  pet: "",
  owner: "",
  treatment: "",
  medication: "",
  veterinarian: "",
  startDate: new Date().toLocaleDateString("en-CA"),
  endDate: "",
  description: "",
  instructions: "",
  status: "Pendiente",
};

const veterinarians = [
  "Dr. Alejandro Ruiz",
  "Dra. Laura Méndez",
];

function formatDateForInput(date) {
  if (!date) return "";

  if (date.includes("/")) {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  }

  return date;
}

function formatDateForDisplay(date) {
  if (!date) return "Sin fecha";

  if (date.includes("-")) {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  return date;
}

function Treatments() {
  const [treatments, setTreatments] = useState(demoTreatments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const filteredTreatments = useMemo(() => {
    return treatments.filter((treatment) => {
      const searchText = search.toLowerCase();

      const matchesSearch = [
        treatment.pet,
        treatment.owner,
        treatment.treatment,
        treatment.medication,
        treatment.veterinarian,
      ].some((value) =>
        value.toLowerCase().includes(searchText)
      );

      const matchesStatus =
        statusFilter === "Todos" ||
        treatment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [treatments, search, statusFilter]);

  const activeTreatments = treatments.filter(
    (item) => item.status === "En curso"
  ).length;

  const completedTreatments = treatments.filter(
    (item) => item.status === "Completado"
  ).length;

  const pendingTreatments = treatments.filter(
    (item) => item.status === "Pendiente"
  ).length;

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedTreatment(null);
    setFormData({
      ...emptyForm,
      startDate: new Date().toLocaleDateString("en-CA"),
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openViewModal = (treatment) => {
    setModalMode("view");
    setSelectedTreatment(treatment);
    setFormData({
      ...treatment,
      startDate: formatDateForInput(treatment.startDate),
      endDate: formatDateForInput(treatment.endDate),
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (treatment) => {
    setModalMode("edit");
    setSelectedTreatment(treatment);
    setFormData({
      ...treatment,
      startDate: formatDateForInput(treatment.startDate),
      endDate: formatDateForInput(treatment.endDate),
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTreatment(null);
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
      !formData.pet.trim() ||
      !formData.owner.trim() ||
      !formData.treatment.trim() ||
      !formData.medication.trim() ||
      !formData.veterinarian ||
      !formData.startDate
    ) {
      setFormError("Completa todos los campos obligatorios.");
      return;
    }

    if (
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      setFormError(
        "La fecha de finalización no puede ser anterior a la fecha de inicio."
      );
      return;
    }

    const treatmentData = {
      ...formData,
      startDate: formatDateForDisplay(formData.startDate),
      endDate: formatDateForDisplay(formData.endDate),
    };

    if (modalMode === "create") {
      const newTreatment = {
        id: Date.now(),
        ...treatmentData,
      };

      setTreatments((previous) => [
        newTreatment,
        ...previous,
      ]);
    }

    if (modalMode === "edit" && selectedTreatment) {
      setTreatments((previous) =>
        previous.map((item) =>
          item.id === selectedTreatment.id
            ? { ...item, ...treatmentData }
            : item
        )
      );
    }

    closeModal();
  };

  const handleComplete = (treatment) => {
    if (treatment.status === "Completado") return;

    const confirmed = window.confirm(
      `¿Deseas marcar el tratamiento de ${treatment.pet} como completado?`
    );

    if (!confirmed) return;

    setTreatments((previous) =>
      previous.map((item) =>
        item.id === treatment.id
          ? { ...item, status: "Completado" }
          : item
      )
    );
  };

  const modalTitle =
    modalMode === "create"
      ? "Nuevo tratamiento"
      : modalMode === "edit"
        ? "Editar tratamiento"
        : "Detalles del tratamiento";

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

          <button
            className="treatments-primary-btn"
            onClick={openCreateModal}
          >
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
              <h2>{treatments.length}</h2>
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
                        {item.endDate || "Sin fecha"}
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
                        <button
                          title="Consultar tratamiento"
                          onClick={() => openViewModal(item)}
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          title="Editar tratamiento"
                          onClick={() => openEditModal(item)}
                        >
                          <Pencil size={17} />
                        </button>

                        {item.status !== "Completado" && (
                          <button
                            className="treatment-complete-btn"
                            title="Finalizar tratamiento"
                            onClick={() => handleComplete(item)}
                          >
                            <Check size={17} />
                          </button>
                        )}
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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        description={
          modalMode === "view"
            ? "Consulta la información del tratamiento seleccionado."
            : "Ingresa la información correspondiente al tratamiento."
        }
        size="large"
        footer={
          <>
            <button
              type="button"
              className="treatments-secondary-btn"
              onClick={closeModal}
            >
              {modalMode === "view" ? "Cerrar" : "Cancelar"}
            </button>

            {modalMode !== "view" && (
              <button
                type="submit"
                form="treatment-form"
                className="treatments-primary-btn"
              >
                {modalMode === "create"
                  ? "Guardar tratamiento"
                  : "Guardar cambios"}
              </button>
            )}
          </>
        }
      >
        <form
          id="treatment-form"
          onSubmit={handleSubmit}
        >
          <div className="treatment-form-grid">
            <div className="treatment-form-field">
              <label>Mascota *</label>
              <input
                type="text"
                name="pet"
                value={formData.pet}
                onChange={handleInputChange}
                placeholder="Nombre de la mascota"
                disabled={modalMode === "view"}
              />
            </div>

            <div className="treatment-form-field">
              <label>Propietario *</label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                placeholder="Nombre del propietario"
                disabled={modalMode === "view"}
              />
            </div>

            <div className="treatment-form-field">
              <label>Nombre del tratamiento *</label>
              <input
                type="text"
                name="treatment"
                value={formData.treatment}
                onChange={handleInputChange}
                placeholder="Ej. Tratamiento dermatológico"
                disabled={modalMode === "view"}
              />
            </div>

            <div className="treatment-form-field">
              <label>Medicamento *</label>
              <input
                type="text"
                name="medication"
                value={formData.medication}
                onChange={handleInputChange}
                placeholder="Medicamento o producto"
                disabled={modalMode === "view"}
              />
            </div>

            <div className="treatment-form-field">
              <label>Veterinario responsable *</label>
              <select
                name="veterinarian"
                value={formData.veterinarian}
                onChange={handleInputChange}
                disabled={modalMode === "view"}
              >
                <option value="">Seleccionar veterinario</option>
                {veterinarians.map((veterinarian) => (
                  <option key={veterinarian} value={veterinarian}>
                    {veterinarian}
                  </option>
                ))}
              </select>
            </div>

            <div className="treatment-form-field">
              <label>Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={modalMode === "view"}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En curso">En curso</option>
                <option value="Completado">Completado</option>
              </select>
            </div>

            <div className="treatment-form-field">
              <label>Fecha de inicio *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                disabled={modalMode === "view"}
              />
            </div>

            <div className="treatment-form-field">
              <label>Fecha de finalización</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                disabled={modalMode === "view"}
              />
            </div>

            <div className="treatment-form-field treatment-form-full">
              <label>Descripción del tratamiento</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe el objetivo del tratamiento..."
                disabled={modalMode === "view"}
              />
            </div>

            <div className="treatment-form-field treatment-form-full">
              <label>Indicaciones y cuidados</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                placeholder="Indicaciones para el propietario..."
                disabled={modalMode === "view"}
              />
            </div>
          </div>

          {formError && (
            <p className="treatment-form-error">
              {formError}
            </p>
          )}
        </form>
      </Modal>
    </div>
  );
}

export default Treatments;
