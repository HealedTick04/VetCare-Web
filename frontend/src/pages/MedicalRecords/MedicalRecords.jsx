import { useEffect, useMemo, useState } from "react";
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
import Modal from "../../components/common/Modal";
import { medicalRecordService } from "../../services/api/medicalRecordService";
import { petService } from "../../services/api/petService";
import { authService } from "../../services/api/authService";
import "./MedicalRecords.css";

const emptyForm = {
  petId: "",
  pet: "",
  species: "",
  owner: "",
  veterinarian: "",
  date: new Date().toLocaleDateString("en-CA"),
  symptoms: "",
  diagnosis: "",
  selectedTreatmentId: "",
  dosage: "",
  frequency: "",
  duration: "",
  treatment: "",
  recommendations: "",
  observations: "",
  status: "Finalizado",
};

function formatDateForDisplay(date) {
  if (!date) return "";
  const parts = date.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return date;
}

function MedicalRecords() {
  const currentUser = authService.getCurrentUser();
  const role = currentUser?.role || "VETERINARIAN";
  const canCreate = role === "ADMIN" || role === "VETERINARIAN";

  const [records, setRecords] = useState([]);
  const [petsList, setPetsList] = useState([]);
  const [treatmentsCatalog, setTreatmentsCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [recordsData, petsData, treatmentsData] = await Promise.all([
        medicalRecordService.getAll(),
        petService.getAll(),
        medicalRecordService.getTreatmentsCatalog(),
      ]);
      setRecords(recordsData);
      setPetsList(petsData);
      setTreatmentsCatalog(treatmentsData);
    } catch (error) {
      console.error("Error al cargar expedientes médicos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const searchText = search.toLowerCase();

      const matchesSearch = [
        record.pet,
        record.owner,
        record.veterinarian,
        record.symptoms,
        record.diagnosis,
      ].some((value) => (value || "").toLowerCase().includes(searchText));

      const matchesStatus =
        statusFilter === "Todos" || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const completedRecords = records.filter(
    (record) => record.status === "Finalizado"
  ).length;

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedRecord(null);
    setFormData({
      ...emptyForm,
      veterinarian: currentUser
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openViewModal = (record) => {
    setModalMode("view");
    setSelectedRecord(record);
    setFormData({
      ...emptyForm,
      ...record,
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

    if (name === "petId") {
      const petObj = petsList.find((p) => String(p.id) === String(value));
      setFormData((previous) => ({
        ...previous,
        petId: value,
        pet: petObj ? petObj.name : "",
        species: petObj ? petObj.species : "",
        owner: petObj ? petObj.owner : "",
      }));
      setFormError("");
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!formData.petId || !formData.diagnosis.trim()) {
      setFormError("La mascota y el diagnóstico son obligatorios.");
      return;
    }

    try {
      setSaving(true);
      await medicalRecordService.create(formData);
      await loadData();
      closeModal();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          "Error al registrar el expediente (verifica permisos de veterinario)."
      );
    } finally {
      setSaving(false);
    }
  };

  const isReadOnly = modalMode === "view";

  return (
    <div className="records-layout">
      <Sidebar role={role} />

      <main className="records-main">
        <header className="records-header">
          <div>
            <span className="records-breadcrumb">
              Gestión / Expedientes médicos
            </span>
            <h1>Expedientes médicos</h1>
            <p>Consulta y administra el historial clínico de las mascotas.</p>
          </div>

          {canCreate && (
            <button className="records-primary-btn" onClick={openCreateModal}>
              <Plus size={18} />
              Nuevo expediente
            </button>
          )}
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
              <span>Consultas registradas</span>
              <h2>{completedRecords}</h2>
            </div>
          </div>

          <div className="record-stat-card">
            <div className="record-stat-icon orange">
              <PawPrint size={22} />
            </div>
            <div>
              <span>Pacientes atendidos</span>
              <h2>{new Set(records.map((r) => r.petId)).size}</h2>
            </div>
          </div>

          <div className="record-stat-card">
            <div className="record-stat-icon purple">
              <CalendarDays size={22} />
            </div>
            <div>
              <span>Tratamientos disponibles</span>
              <h2>{treatmentsCatalog.length}</h2>
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
            </select>
          </div>

          <div className="records-table-header">
            <div>
              <h2>Historial clínico</h2>
              <p>
                {loading
                  ? "Cargando expedientes..."
                  : `${filteredRecords.length} expedientes encontrados`}
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
                  <th>Síntomas</th>
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
                          <span>ID #{record.petId}</span>
                        </div>
                      </div>
                    </td>

                    <td>{record.owner}</td>

                    <td>
                      <span className="record-date">
                        <CalendarDays size={14} />
                        {formatDateForDisplay(record.date)}
                      </span>
                    </td>

                    <td>{record.symptoms || "Sin síntomas"}</td>

                    <td>
                      <span className="record-diagnosis">
                        {record.diagnosis}
                      </span>
                    </td>

                    <td>{record.veterinarian}</td>

                    <td>
                      <span className="record-status completed">
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
                      </div>
                    </td>
                  </tr>
                ))}

                {!loading && filteredRecords.length === 0 && (
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
        title={
          modalMode === "create"
            ? "Nuevo expediente médico"
            : "Consultar expediente médico"
        }
        description={
          modalMode === "view"
            ? "Consulta los detalles del historial clínico."
            : "Registra la información de la consulta médica."
        }
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
                disabled={saving}
              >
                {saving ? "Guardando..." : "Registrar expediente"}
              </button>
            )}
          </>
        }
      >
        <form id="medical-record-form" onSubmit={handleSubmit}>
          <div className="record-form-grid">
            <div className="record-form-field">
              <label htmlFor="record-pet">Mascota *</label>
              {modalMode === "create" ? (
                <select
                  id="record-pet"
                  name="petId"
                  value={formData.petId}
                  onChange={handleInputChange}
                >
                  <option value="">Selecciona una mascota</option>
                  {petsList.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species} - {pet.owner})
                    </option>
                  ))}
                </select>
              ) : (
                <input value={formData.pet} disabled />
              )}
            </div>

            <div className="record-form-field">
              <label htmlFor="record-owner">Propietario</label>
              <input
                id="record-owner"
                value={formData.owner}
                placeholder="Se completa al elegir mascota"
                disabled
              />
            </div>

            <div className="record-form-field">
              <label htmlFor="record-veterinarian">Veterinario</label>
              <input
                id="record-veterinarian"
                value={formData.veterinarian}
                disabled
              />
            </div>

            <div className="record-form-field">
              <label htmlFor="record-date">Fecha de consulta</label>
              <input
                id="record-date"
                type="date"
                name="date"
                value={formData.date}
                disabled
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

            {modalMode === "create" ? (
              <>
                <div className="record-form-field">
                  <label htmlFor="record-treatment-select">
                    Tratamiento del catálogo (opcional)
                  </label>
                  <select
                    id="record-treatment-select"
                    name="selectedTreatmentId"
                    value={formData.selectedTreatmentId}
                    onChange={handleInputChange}
                  >
                    <option value="">Ninguno / Solo recomendaciones</option>
                    {treatmentsCatalog.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="record-form-field">
                  <label htmlFor="record-dosage">Dosis</label>
                  <input
                    id="record-dosage"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    placeholder="Ej. 1 tableta / 5 ml"
                    disabled={!formData.selectedTreatmentId}
                  />
                </div>

                <div className="record-form-field">
                  <label htmlFor="record-frequency">Frecuencia</label>
                  <input
                    id="record-frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    placeholder="Ej. Cada 8 horas"
                    disabled={!formData.selectedTreatmentId}
                  />
                </div>

                <div className="record-form-field">
                  <label htmlFor="record-duration">Duración</label>
                  <input
                    id="record-duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="Ej. 7 días"
                    disabled={!formData.selectedTreatmentId}
                  />
                </div>
              </>
            ) : (
              <div className="record-form-field record-form-full">
                <label>Tratamientos aplicados</label>
                <textarea
                  value={formData.treatment}
                  rows="2"
                  disabled
                />
              </div>
            )}

            <div className="record-form-field record-form-full">
              <label htmlFor="record-recommendations">Recomendaciones</label>
              <textarea
                id="record-recommendations"
                name="recommendations"
                value={formData.recommendations}
                onChange={handleInputChange}
                placeholder="Indicaciones generales y cuidados..."
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
          </div>

          {formError && <p className="record-form-error">{formError}</p>}
        </form>
      </Modal>
    </div>
  );
}

export default MedicalRecords;