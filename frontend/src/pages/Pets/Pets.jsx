
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
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import "./Pets.css";

const demoPets = [
  {
    id: 1,
    name: "Max",
    species: "Perro",
    breed: "Golden Retriever",
    sex: "Macho",
    age: "3 años",
    owner: "María González",
    registrationDate: "12/08/2026",
    status: "Activo",
  },
  {
    id: 2,
    name: "Luna",
    species: "Gato",
    breed: "Persa",
    sex: "Hembra",
    age: "2 años",
    owner: "Carlos Ramírez",
    registrationDate: "18/08/2026",
    status: "Activo",
  },
  {
    id: 3,
    name: "Rocky",
    species: "Perro",
    breed: "Bulldog Francés",
    sex: "Macho",
    age: "4 años",
    owner: "Ana Martínez",
    registrationDate: "20/08/2026",
    status: "Activo",
  },
  {
    id: 4,
    name: "Michi",
    species: "Gato",
    breed: "Mestizo",
    sex: "Macho",
    age: "1 año",
    owner: "Luis Hernández",
    registrationDate: "02/09/2026",
    status: "Activo",
  },
  {
    id: 5,
    name: "Coco",
    species: "Ave",
    breed: "Periquito",
    sex: "Hembra",
    age: "8 meses",
    owner: "Sofía Torres",
    registrationDate: "10/09/2026",
    status: "Activo",
  },
  {
    id: 6,
    name: "Nala",
    species: "Perro",
    breed: "Labrador",
    sex: "Hembra",
    age: "5 años",
    owner: "María González",
    registrationDate: "15/09/2026",
    status: "Inactivo",
  },
];

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
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const filteredPets = useMemo(() => {
    return demoPets.filter((pet) => {
      const searchText = search.toLowerCase();

      const matchesSearch = [
        pet.name,
        pet.species,
        pet.breed,
        pet.owner,
      ].some((value) => value.toLowerCase().includes(searchText));

      const matchesSpecies =
        speciesFilter === "Todas" ||
        pet.species === speciesFilter;

      const matchesStatus =
        statusFilter === "Todos" ||
        pet.status === statusFilter;

      return matchesSearch && matchesSpecies && matchesStatus;
    });
  }, [search, speciesFilter, statusFilter]);

  const dogs = demoPets.filter(
    (pet) => pet.species === "Perro"
  ).length;

  const cats = demoPets.filter(
    (pet) => pet.species === "Gato"
  ).length;

  const otherPets = demoPets.filter(
    (pet) => !["Perro", "Gato"].includes(pet.species)
  ).length;

  const activePets = demoPets.filter(
    (pet) => pet.status === "Activo"
  ).length;

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

          <button className="pets-primary-btn">
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
              <h2>{demoPets.length}</h2>
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
                        <button title="Ver mascota">
                          <Eye size={17} />
                        </button>
                        <button title="Editar mascota">
                          <Pencil size={17} />
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
    </div>
  );
}

export default Pets;
