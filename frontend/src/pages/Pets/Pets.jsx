import { useMemo, useState } from "react";
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
import "./Pets.css";

const demoPets = [
  {
    id: 1,
    name: "Max",
    species: "Perro",
    breed: "Golden Retriever",
    sex: "Macho",
    age: "3 años",
    birthDate: "",
    owner: "María González",
    registrationDate: "12/08/2026",
    status: "Activo",
    observations: "",
  },
  {
    id: 2,
    name: "Luna",
    species: "Gato",
    breed: "Persa",
    sex: "Hembra",
    age: "2 años",
    birthDate: "",
    owner: "Carlos Ramírez",
    registrationDate: "18/08/2026",
    status: "Activo",
    observations: "",
  },
  {
    id: 3,
    name: "Rocky",
    species: "Perro",
    breed: "Bulldog Francés",
    sex: "Macho",
    age: "4 años",
    birthDate: "",
    owner: "Ana Martínez",
    registrationDate: "20/08/2026",
    status: "Activo",
    observations: "",
  },
  {
    id: 4,
    name: "Michi",
    species: "Gato",
    breed: "Mestizo",
    sex: "Macho",
    age: "1 año",
    birthDate: "",
    owner: "Luis Hernández",
    registrationDate: "02/09/2026",
    status: "Activo",
    observations: "",
  },
  {
    id: 5,
    name: "Coco",
    species: "Ave",
    breed: "Periquito",
    sex: "Hembra",
    age: "8 meses",
    birthDate: "",
    owner: "Sofía Torres",
    registrationDate: "10/09/2026",
    status: "Activo",
    observations: "",
  },
  {
    id: 6,
    name: "Nala",
    species: "Perro",
    breed: "Labrador",
    sex: "Hembra",
    age: "5 años",
    birthDate: "",
    owner: "María González",
    registrationDate: "15/09/2026",
    status: "Inactivo",
    observations: "",
  },
];

const demoOwners = [
  "María González",
  "Carlos Ramírez",
  "Ana Martínez",
  "Luis Hernández",
  "Sofía Torres",
];

const emptyForm = {
  name: "",
  species: "",
  breed: "",
  sex: "",
  age: "",
  birthDate: "",
  owner: "",
  observations: "",
  status: "Activo",
};

function getSpeciesIcon(species) {
  switch (species) {
    case "Perro":
      return <Dog size={19} />;
    case "Gato":
      return <Cat size={19} />;
    case "Ave":
      return <Bird size={19} />;
    case "Pez":
      return <Fish size={19} />;
    default:
      return <PawPrint size={19} />;
  }
}

function Pets() {
  const [pets, setPets] = useState(demoPets);

  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedPet, setSelectedPet] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const searchText = search.toLowerCase();

      const matchesSearch = [
        pet.name,
        pet.species,
        pet.breed,
        pet.owner,
      ].some((value) =>
        (value || "").toLowerCase().includes(searchText)
      );

      const matchesSpecies =
        speciesFilter === "Todas" ||
        pet.species === speciesFilter;

      const matchesStatus =
        statusFilter === "Todos" ||
        pet.status === statusFilter;

      return matchesSearch && matchesSpecies && matchesStatus;
    });
  }, [pets, search, speciesFilter, statusFilter]);

  const dogs = pets.filter(
    (pet) => pet.species === "Perro"
  ).length;

  const cats = pets.filter(
    (pet) => pet.species === "Gato"
  ).length;

  const otherPets = pets.filter(
    (pet) => !["Perro", "Gato"].includes(pet.species)
  ).length;

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedPet(null);
    setFormData(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openViewModal = (pet) => {
    setModalMode("view");
    setSelectedPet(pet);
    setFormData({ ...emptyForm, ...pet });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (pet) => {
    setModalMode("edit");
    setSelectedPet(pet);
    setFormData({ ...emptyForm, ...pet });
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
    }));

    setFormError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.species ||
      !formData.breed.trim() ||
      !formData.sex ||
      !formData.age.trim() ||
      !formData.owner
    ) {
      setFormError(
        "Completa todos los campos obligatorios."
      );
      return;
    }

    if (modalMode === "create") {
      const newPet = {
        ...formData,
        id: Date.now(),
        registrationDate: new Date().toLocaleDateString("es-MX"),
        status: "Activo",
      };

      setPets((previous) => [...previous, newPet]);
    }

    if (modalMode === "edit" && selectedPet) {
      setPets((previous) =>
        previous.map((pet) =>
          pet.id === selectedPet.id
            ? { ...pet, ...formData }
            : pet
        )
      );
    }

    closeModal();
  };

  const handleDelete = (pet) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar a ${pet.name}? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    setPets((previous) =>
      previous.filter((item) => item.id !== pet.id)
    );
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
      <Sidebar role="VETERINARIAN" />

      <main className="pets-main">
        <header className="pets-header">
          <div>
            <span className="pets-breadcrumb">
              Gestión / Mascotas
            </span>
            <h1>Mascotas</h1>
            <p>
              Consulta y administra la información de las
              mascotas registradas en VetCare.
            </p>
          </div>

          <button
            className="pets-primary-btn"
            onClick={openCreateModal}
          >
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
              <option value="Perro">Perros</option>
              <option value="Gato">Gatos</option>
              <option value="Ave">Aves</option>
              <option value="Pez">Peces</option>
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
                {filteredPets.length} mascotas encontradas
              </p>
            </div>
          </div>

          <div className="pets-table-container">
            <table className="pets-table">
              <thead>
                <tr>
                  <th>Mascota</th>
                  <th>Especie / Raza</th>
                  <th>Sexo / Edad</th>
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
                        <span>{pet.age}</span>
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
                        {pet.registrationDate}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`pet-status ${
                          pet.status === "Activo"
                            ? "active"
                            : "inactive"
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

                {filteredPets.length === 0 && (
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
              >
                {modalMode === "create"
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

            <div className="pet-form-field">
              <label htmlFor="pet-breed">Raza *</label>
              <input
                id="pet-breed"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                placeholder="Ej. Labrador"
                disabled={isReadOnly}
              />
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
              </select>
            </div>

            <div className="pet-form-field">
              <label htmlFor="pet-age">Edad *</label>
              <input
                id="pet-age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Ej. 2 años"
                disabled={isReadOnly}
              />
            </div>

            <div className="pet-form-field">
              <label htmlFor="pet-birthdate">
                Fecha de nacimiento
              </label>
              <input
                id="pet-birthdate"
                type="date"
                name="birthDate"
                value={formData.birthDate || ""}
                onChange={handleInputChange}
                disabled={isReadOnly}
              />
            </div>

            <div className="pet-form-field pet-form-full">
              <label htmlFor="pet-owner">Propietario *</label>
              <select
                id="pet-owner"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                disabled={isReadOnly}
              >
                <option value="">Selecciona un propietario</option>
                {demoOwners.map((owner) => (
                  <option key={owner} value={owner}>
                    {owner}
                  </option>
                ))}
              </select>
            </div>

            <div className="pet-form-field pet-form-full">
              <label htmlFor="pet-observations">
                Observaciones
              </label>
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

          {formError && (
            <p className="pet-form-error">{formError}</p>
          )}
        </form>
      </Modal>
    </div>
  );
}

export default Pets;