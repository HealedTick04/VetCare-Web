import { useEffect, useMemo, useState } from "react";
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
  Check,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Modal from "../../components/common/Modal";
import { treatmentService } from "../../services/api/treatmentService";
import { petService } from "../../services/api/petService";
import { authService } from "../../services/api/authService";
import "./Treatments.css";

const emptyForm = {
  petId: "",
  pet: "",
  owner: "",
  treatmentId: "",
  treatmentName: "",
  medication: "",
  frequency: "",
  duration: "",
  veterinarian: "",
  startDate: new Date().toLocaleDateString("en-CA"),
  description: "",
  instructions: "",
  status: "En curso",
};

function Treatments() {
  const currentUser = authService.getCurrentUser();
  const role = currentUser?.role || "VETERINARIAN";
  const canCreate = role === "ADMIN" || role === "VETERINARIAN";

  const [treatments, setTreatments] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [petsList, setPetsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appliedData, catalogData, petsData] = await Promise.all([
        treatmentService.getAllApplied(),
        treatmentService.getCatalog(),
        petService.getAll(),
      ]);
      setTreatments(appliedData);
      setCatalog(catalogData);
      setPetsList(petsData);
    } catch (error) {
      console.error("Error al cargar tratamientos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTreatments = useMemo(() => {
    return treatments.filter((treatment) => {
      const searchText = search.toLowerCase();

      const matchesSearch = [
        treatment.pet,
        treatment.owner,
        treatment.treatment,
        treatment.medication,
        treatment.veterinarian,
      ].some((value) => (value || "").toLowerCase().includes(searchText));

      const matchesStatus =
        statusFilter === "Todos" || treatment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [treatments, search, statusFilter]);

  const activeTreatments = treatments.filter(
    (item) => item.status === "En curso"
  ).length;

  const completedTreatments = treatments.filter(
    (item) => item.status === "Completado"
  ).length;

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      ...emptyForm,
      veterinarian: currentUser
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openViewModal = (treatment) => {
    setModalMode("view");
    setFormData({
      ...emptyForm,
      ...treatment,
      treatmentName: treatment.treatment,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "petId") {
      const petObj = petsList.find((p) => String(p.id) === String(value));
      setFormData((prev) => ({
        ...prev,
        petId: value,
        pet: petObj ? petObj.name : "",
        owner: petObj ? petObj.owner : "",
      }));
      return;
    }

    if (name === "treatmentId") {
      const catObj = catalog.find((c) => String(c.id) === String(value));
      setFormData((prev) => ({
        ...prev,
        treatmentId: value,
        treatmentName: catObj ? catObj.name : "",
        description: catObj?.description || prev.description,
      }));
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.petId || !formData.treatmentId) {
      setFormError("Selecciona la mascota y el tratamiento del catálogo.");
      return;
    }

    try {
      setSaving(true);
      await treatmentService.assignTreatment(formData);
      await loadData();
      closeModal();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          "Error al asignar tratamiento (requiere rol VETERINARIAN o ADMIN)."
      );
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="treatments-layout">
      <Sidebar role={role} />

      <main className="treatments-main">
        <header className="treatments-header">
          <div>
            <span className="treatments-breadcrumb">
              Gestión / Tratamientos
            </span>
            <h1>Tratamientos</h1>
            <p>Administra y supervisa los tratamientos de las mascotas.</p>
          </div>

          {canCreate && (
            <button
              className="treatments-primary-btn"
              onClick={openCreateModal}
            >
              <Plus size={18} />
              Asignar tratamiento
            </button>
          )}
        </header>

        <section className="treatments-stats">
          <div className="treatment-stat-card">
            <div className="treatment-stat-icon blue">
              <Pill size={22} />
            </div>
            <div>
              <span>Tratamientos aplicados</span>
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
              <span>Catálogo disponible</span>
              <h2>{catalog.length}</h2>
            </div>
          </div>
        </section>

        <section className="treatments-content">
          <div className="treatments-toolbar">
            <div className="treatments-search">
              <Search size={19} />
              <input
                type="text"
                placeholder="Buscar mascota, tratamiento o dosis..."
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
            </select>
          </div>

          <div className="treatments-table-header">
            <div>
              <h2>Registro de tratamientos</h2>
              <p>
                {loading
                  ? "Cargando tratamientos..."
                  : `${filteredTreatments.length} tratamientos encontrados`}
              </p>
            </div>
          </div>

          <div className="treatments-table-container">
            <table className="treatments-table">
              <thead>
                <tr>
                  <th>Mascota</th>
                  <th>Tratamiento</th>
                  <th>Dosis / Indicaciones</th>
                  <th>Veterinario</th>
                  <th>Fecha</th>
                  <th>Duración</th>
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
                      <span className="treatment-name">{item.treatment}</span>
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
                            : "completed"
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

                {!loading && filteredTreatments.length === 0 && (
                  <tr>
                    <td colSpan="8" className="treatments-empty">
                      No se encontraron tratamientos aplicados.
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
            ? "Asignar tratamiento"
            : "Detalles del tratamiento"
        }
        description={
          modalMode === "view"
            ? "Consulta la información del tratamiento seleccionado."
            : "Asigna un tratamiento del catálogo a una mascota."
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
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar tratamiento"}
              </button>
            )}
          </>
        }
      >
        <form id="treatment-form" onSubmit={handleSubmit}>
          <div className="treatment-form-grid">
            <div className="treatment-form-field">
              <label>Mascota *</label>
              {modalMode === "create" ? (
                <select
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
                <input type="text" value={formData.pet} disabled />
              )}
            </div>

            <div className="treatment-form-field">
              <label>Propietario</label>
              <input
                type="text"
                value={formData.owner}
                placeholder="Se completa al elegir mascota"
                disabled
              />
            </div>

            <div className="treatment-form-field">
              <label>Tratamiento del catálogo *</label>
              {modalMode === "create" ? (
                <select
                  name="treatmentId"
                  value={formData.treatmentId}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar tratamiento</option>
                  {catalog.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input type="text" value={formData.treatmentName} disabled />
              )}
            </div>

            <div className="treatment-form-field">
              <label>Dosis / Medicamento</label>
              <input
                type="text"
                name="medication"
                value={formData.medication}
                onChange={handleInputChange}
                placeholder="Ej. 1 tableta / 5 ml"
                disabled={modalMode === "view"}
              />
            </div>

            <div className="treatment-form-field">
              <label>Frecuencia</label>
              <input
                type="text"
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                placeholder="Ej. Cada 12 horas"
                disabled={modalMode === "view"}
              />
            </div>

            <div className="treatment-form-field">
              <label>Duración</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="Ej. 7 días"
                disabled={modalMode === "view"}
              />
            </div>

            <div className="treatment-form-field treatment-form-full">
              <label>Diagnóstico / Motivo</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Motivo clínico del tratamiento..."
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

          {formError && <p className="treatment-form-error">{formError}</p>}
        </form>
      </Modal>
    </div>
  );
}

export default Treatments;