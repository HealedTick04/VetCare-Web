import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  PawPrint,
  Dog,
  Cat,
  Bird,
  Fish,
  Eye,
  Pencil,
  Calendar,
  User,
  Trash2,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Modal from "../../components/common/Modal";
import { petService } from "../../services/api/petService";
import { clientService } from "../../services/api/clientService";
import { authService } from "../../services/api/authService";
import "./Pets.css";

const emptyForm = {
  name: "",
  speciesId: "",
  species: "",
  breedId: "",
  breed: "",
  sex: "",
  weight: "",
  birthDate: "",
  ownerId: "",
  owner: "",
  observations: "",
  status: "Activo",
};

function getSpeciesIcon(species) {
  const normalized = (species || "").toLowerCase();
  if (normalized.includes("perro")) return <Dog size={19} />;
  if (normalized.includes("gato")) return <Cat size={19} />;
  if (normalized.includes("ave")) return <Bird size={19} />;
  if (normalized.includes("pez")) return <Fish size={19} />;
  return <PawPrint size={19} />;
}

function Pets() {
  const [pets, setPets] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);
  const [breedsList, setBreedsList] = useState([]);
  const [ownersList, setOwnersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedPet, setSelectedPet] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const currentUser = authService.getCurrentUser();
  const isClientRole = currentUser?.role === "CLIENT";

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [petsData, speciesData] = await Promise.all([
        petService.getAll(),
        petService.getSpecies(),
      ]);
      setPets(petsData);
      setSpeciesList(speciesData);

      // Solo staff (ADMIN/VETERINARIAN) puede listar todos los usuarios CLIENT
      if (!isClientRole) {
        const clientsData = await clientService.getAll();
        setOwnersList(clientsData);
      }
    } catch (error) {
      console.error("Error al cargar mascotas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Cargar razas cuando cambia la especie seleccionada en el modal
  useEffect(() => {
    if (!formData.speciesId) {
      setBreedsList([]);
      return;
    }

    const fetchBreeds = async () => {
      try {
        const breeds = await petService.getBreedsBySpecies(formData.speciesId);
        setBreedsList(breeds);
      } catch (error) {
        console.error("Error al cargar razas:", error);
        setBreedsList([]);
      }
    };

    fetchBreeds();
  }, [formData.speciesId]);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const searchText = search.toLowerCase();

      const matchesSearch = [
        pet.name,
        pet.species,
        pet.breed,
        pet.owner,
      ].some((value) => (value || "").toLowerCase().includes(searchText));

      const matchesSpecies =
        speciesFilter === "Todas" ||
        (pet.species || "").toLowerCase() === speciesFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "Todos" || pet.status === statusFilter;

      return matchesSearch && matchesSpecies && matchesStatus;
    });
  }, [pets, search, speciesFilter, statusFilter]);

  const dogs = pets.filter((pet) =>
    (pet.species || "").toLowerCase().includes("perro")
  ).length;

  const cats = pets.filter((pet) =>
    (pet.species || "").toLowerCase().includes("gato")
  ).length;

  const otherPets = pets.length - dogs - cats;

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedPet(null);
    setFormData({
      ...emptyForm,
      ownerId: isClientRole ? currentUser?.id : "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openViewModal = (pet) => {
    setModalMode("view");
    setSelectedPet(pet);
    setFormData({
      ...emptyForm,
      ...pet,
      speciesId: pet.speciesId || "",
      breedId: pet.breedId || "",
      ownerId: pet.ownerId || "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (pet) => {
    setModalMode("edit");
    setSelectedPet(pet);
    setFormData({
      ...emptyForm,
      ...pet,
      speciesId: pet.speciesId || "",
      breedId: pet.breedId || "",
      ownerId: pet.ownerId || "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPet(null);
    setFormError("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
      // Si cambia la especie, reiniciamos la raza seleccionada
      ...(name === "speciesId" ? { breedId: "" } : {}),
    }));

    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!formData.name.trim() || !formData.speciesId || !formData.sex) {
      setFormError("Nombre, especie y sexo son obligatorios.");
      return;
    }

    if (!isClientRole && !formData.ownerId) {
      setFormError("Selecciona un propietario para la mascota.");
      return;
    }

    try {
      setSaving(true);
      if (modalMode === "create") {
        await petService.create(formData);
      } else if (modalMode === "edit" && selectedPet) {
        await petService.update(selectedPet.id, formData);
      }
      await loadInitialData();
      closeModal();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          "Error al guardar la mascota. Verifica los datos."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (pet) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar a ${pet.name}? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      await petService.remove(pet.id);
      await loadInitialData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "No se pudo eliminar la mascota (puede tener citas o historial asociado)."
      );
    }
  };

  const isReadOnly = modalMode === "view";

  const modalTitle = {
    create: "Registrar mascota",
    view: "Información de la mascota",
    edit: "Editar mascota",
  }[modalMode];

  const modalDescription = {
    create: "Completa los datos para registrar una nueva mascota.",
    view: "Consulta la información registrada de esta mascota.",
    edit: "Modifica la información de la mascota.",
  }[modalMode];

  return (
    <div className="pets-layout">
      <Sidebar role={currentUser?.role || "VETERINARIAN"} />

      <main className="pets-main">
        <header className="pets-header">
          <div>
            <span className="pets-breadcrumb">Gestión / Mascotas</span>
            <h1>Mascotas</h1>
            <p>
              Consulta y administra la información de las mascotas registradas en
              VetCare.
            </p>
          </div>

          <button className="pets-primary-btn" onClick={openCreateModal}>
            <Plus size={18} />
            Nueva mascota
          </button>
        </header>

        <section className="pets-stats">
          <div className="pet-stat-card">
            <div className="pet-stat-icon blue">
              <PawPrint size={22} />
            </div>
            <div>
              <span>Total de mascotas</span>
              <h2>{pets.length}</h2>
            </div>
          </div>

          <div className="pet-stat-card">
            <div className="pet-stat-icon green">
              <Dog size={22} />
            </div>
            <div>
              <span>Perros</span>
              <h2>{dogs}</h2>
            </div>
          </div>

          <div className="pet-stat-card">
            <div className="pet-stat-icon purple">
              <Cat size={22} />
            </div>
            <div>
              <span>Gatos</span>
              <h2>{cats}</h2>
            </div>
          </div>

          <div className="pet-stat-card">
            <div className="pet-stat-icon orange">
              <Bird size={22} />
            </div>
            <div>
              <span>Otras especies</span>
              <h2>{otherPets}</h2>
            </div>
          </div>
        </section>

        <section className="pets-content">
          <div className="pets-toolbar">
            <div className="pets-search">
              <Search size={19} />
              <input
                type="text"
                placeholder="Buscar mascota, raza o propietario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
            >
              <option value="Todas">Todas las especies</option>
              {speciesList.map((sp) => (
                <option key={sp.id} value={sp.name}>
                  {sp.name}
                </option>
              ))}
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

          <div className="pets-table-header">
            <div>
              <h2>Directorio de mascotas</h2>
              <p>
                {loading
                  ? "Cargando mascotas..."
                  : `${filteredPets.length} mascotas encontradas`}
              </p>
            </div>
          </div>

          <div className="pets-table-container">
            <table className="pets-table">
              <thead>
                <tr>
                  <th>Mascota</th>
                  <th>Especie / Raza</th>
                  <th>Sexo / Nacimiento</th>
                  <th>Propietario</th>
                  <th>Registro</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredPets.map((pet) => (
                  <tr key={pet.id}>
                    <td>
                      <div className="pet-name-cell">
                        <div className="pet-avatar">
                          {getSpeciesIcon(pet.species)}
                        </div>
                        <strong>{pet.name}</strong>
                      </div>
                    </td>

                    <td>
                      <div className="pet-species-cell">
                        <strong>{pet.species}</strong>
                        <span>{pet.breed}</span>
                      </div>
                    </td>

                    <td>
                      <div className="pet-age-cell">
                        <span>{pet.sex}</span>
                        <span>{pet.birthDate || "Sin fecha"}</span>
                      </div>
                    </td>

                    <td>
                      <span className="pet-owner">
                        <User size={15} />
                        {pet.owner}
                      </span>
                    </td>

                    <td>
                      <span className="pet-registration">
                        <Calendar size={15} />
                        {pet.registrationDate || "N/A"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`pet-status ${
                          pet.status === "Activo" ? "active" : "inactive"
                        }`}
                      >
                        {pet.status}
                      </span>
                    </td>

                    <td>
                      <div className="pet-actions">
                        <button
                          title="Ver mascota"
                          onClick={() => openViewModal(pet)}
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          title="Editar mascota"
                          onClick={() => openEditModal(pet)}
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          title="Eliminar mascota"
                          onClick={() => handleDelete(pet)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!loading && filteredPets.length === 0 && (
                  <tr>
                    <td colSpan="7" className="pets-empty">
                      No se encontraron mascotas.
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
              className="pets-secondary-btn"
              onClick={closeModal}
            >
              {isReadOnly ? "Cerrar" : "Cancelar"}
            </button>

            {!isReadOnly && (
              <button
                type="submit"
                form="pet-form"
                className="pets-primary-btn"
                disabled={saving}
              >
                {saving
                  ? "Guardando..."
                  : modalMode === "create"
                  ? "Registrar mascota"
                  : "Guardar cambios"}
              </button>
            )}
          </>
        }
      >
        <form id="pet-form" onSubmit={handleSubmit}>
          <div className="pet-form-grid">
            <div className="pet-form-field">
              <label htmlFor="pet-name">Nombre *</label>
              <input
                id="pet-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej. Max"
                disabled={isReadOnly}
              />
            </div>

            <div className="pet-form-field">
              <label htmlFor="pet-species">Especie *</label>
              <select
                id="pet-species"
                name="speciesId"
                value={formData.speciesId}
                onChange={handleInputChange}
                disabled={isReadOnly}
              >
                <option value="">Selecciona una especie</option>
                {speciesList.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pet-form-field">
              <label htmlFor="pet-breed">Raza</label>
              <select
                id="pet-breed"
                name="breedId"
                value={formData.breedId}
                onChange={handleInputChange}
                disabled={isReadOnly || !formData.speciesId}
              >
                <option value="">Selecciona una raza (opcional)</option>
                {breedsList.map((br) => (
                  <option key={br.id} value={br.id}>
                    {br.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pet-form-field">
              <label htmlFor="pet-sex">Sexo *</label>
              <select
                id="pet-sex"
                name="sex"
                value={formData.sex}
                onChange={handleInputChange}
                disabled={isReadOnly}
              >
                <option value="">Selecciona el sexo</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
                <option value="Desconocido">Desconocido</option>
              </select>
            </div>

            <div className="pet-form-field">
              <label htmlFor="pet-weight">Peso (kg)</label>
              <input
                id="pet-weight"
                type="number"
                step="0.01"
                min="0.01"
                name="weight"
                value={formData.weight || ""}
                onChange={handleInputChange}
                placeholder="Ej. 12.5"
                disabled={isReadOnly}
              />
            </div>

            <div className="pet-form-field">
              <label htmlFor="pet-birthdate">Fecha de nacimiento</label>
              <input
                id="pet-birthdate"
                type="date"
                name="birthDate"
                value={formData.birthDate || ""}
                onChange={handleInputChange}
                disabled={isReadOnly}
              />
            </div>

            {!isClientRole && (
              <div className="pet-form-field pet-form-full">
                <label htmlFor="pet-owner">Propietario *</label>
                <select
                  id="pet-owner"
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={handleInputChange}
                  disabled={isReadOnly}
                >
                  <option value="">Selecciona un propietario</option>
                  {ownersList.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="pet-form-field pet-form-full">
              <label htmlFor="pet-observations">Observaciones</label>
              <textarea
                id="pet-observations"
                name="observations"
                value={formData.observations || ""}
                onChange={handleInputChange}
                placeholder="Información adicional sobre la mascota..."
                rows="3"
                disabled={isReadOnly}
              />
            </div>
          </div>

          {formError && <p className="pet-form-error">{formError}</p>}
        </form>
      </Modal>
    </div>
  );
}

export default Pets;