
import { useMemo, useState } from "react";
import {
  PawPrint,
  Search,
  FileText,
  CalendarDays,
  ArrowLeft,
  Eye,
  ClipboardList,
  Stethoscope,
  Paperclip,
  Dog,
  Cat,
  HeartPulse,
  X,
  FileImage,
  File,
} from "lucide-react";

import ClientSidebar from "../../components/layout/ClientSidebar";
import Modal from "../../components/common/Modal";

import "./ClientMedicalRecords.css";

// ==========================================
// DATOS DE DEMOSTRACIÓN
// ==========================================

const demoPets = [
  {
    id: 1,
    name: "Max",
    species: "Perro",
    breed: "Golden Retriever",
    age: "4 años",
    sex: "Macho",
    color: "Dorado",
    weight: "28 kg",
    icon: Dog,
    description: "Mascota activa y sociable.",
  },
  {
    id: 2,
    name: "Luna",
    species: "Gato",
    breed: "Gato doméstico",
    age: "2 años",
    sex: "Hembra",
    color: "Gris",
    weight: "4.5 kg",
    icon: Cat,
    description: "Mascota tranquila y cariñosa.",
  },
];

const demoMedicalRecords = [
  {
    id: 1,
    petId: 1,
    date: "2026-11-20",
    type: "Consulta general",
    veterinarian: "Dra. Ana Martínez",
    reason: "Revisión general de salud.",
    symptoms: "El propietario no reporta síntomas. Se realiza revisión preventiva.",
    diagnosis: "Paciente clínicamente estable, sin alteraciones aparentes.",
    treatment: "Se recomienda mantener una alimentación equilibrada y realizar revisiones periódicas.",
    medications: [
      "No se prescribieron medicamentos.",
    ],
    observations: "Mantener actividad física diaria y vigilar cambios en el apetito.",
    attachments: [
      {
        name: "Revision_general_Max.pdf",
        type: "PDF",
        size: "245 KB",
      },
    ],
  },
  {
    id: 2,
    petId: 1,
    date: "2026-10-15",
    type: "Vacunación",
    veterinarian: "Dr. Carlos Hernández",
    reason: "Aplicación de vacuna correspondiente al calendario anual.",
    symptoms: "No presenta síntomas.",
    diagnosis: "Paciente apto para vacunación.",
    treatment: "Aplicación de vacuna múltiple canina.",
    medications: [
      "Vacuna múltiple canina.",
    ],
    observations: "Se recomienda observar al paciente durante las siguientes 24 horas.",
    attachments: [
      {
        name: "Comprobante_vacunacion.pdf",
        type: "PDF",
        size: "180 KB",
      },
      {
        name: "Registro_vacuna.jpg",
        type: "Imagen",
        size: "320 KB",
      },
    ],
  },
  {
    id: 3,
    petId: 1,
    date: "2026-09-08",
    type: "Consulta dermatológica",
    veterinarian: "Dra. Ana Martínez",
    reason: "Presencia de irritación en la piel.",
    symptoms: "Enrojecimiento y rascado frecuente en la zona abdominal.",
    diagnosis: "Dermatitis leve.",
    treatment: "Tratamiento tópico y seguimiento de la evolución.",
    medications: [
      "Crema dermatológica de uso veterinario.",
    ],
    observations: "Evitar el contacto con productos de limpieza y revisar la evolución.",
    attachments: [],
  },
  {
    id: 4,
    petId: 2,
    date: "2026-11-15",
    type: "Vacunación",
    veterinarian: "Dr. Carlos Hernández",
    reason: "Revisión del calendario de vacunación.",
    symptoms: "No presenta síntomas.",
    diagnosis: "Paciente apto para vacunación.",
    treatment: "Aplicación de vacuna correspondiente a su calendario.",
    medications: [
      "Vacuna triple felina.",
    ],
    observations: "Próxima revisión de acuerdo con el calendario de vacunación.",
    attachments: [
      {
        name: "Vacunacion_Luna.pdf",
        type: "PDF",
        size: "190 KB",
      },
    ],
  },
  {
    id: 5,
    petId: 2,
    date: "2026-10-03",
    type: "Consulta general",
    veterinarian: "Dra. Ana Martínez",
    reason: "Revisión preventiva.",
    symptoms: "El propietario no reporta síntomas.",
    diagnosis: "Estado general de salud adecuado.",
    treatment: "No requiere tratamiento específico.",
    medications: [
      "No se prescribieron medicamentos.",
    ],
    observations: "Continuar con alimentación adecuada y revisiones preventivas.",
    attachments: [],
  },
];

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

const formatDate = (date) => {
  return new Date(`${date}T12:00:00`).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function ClientMedicalRecords() {
  const [pets] = useState(demoPets);
  const [medicalRecords] = useState(demoMedicalRecords);

  const [selectedPetId, setSelectedPetId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Mascota seleccionada
  const selectedPet = useMemo(
    () => pets.find((pet) => pet.id === selectedPetId),
    [pets, selectedPetId]
  );

  // Expedientes de la mascota seleccionada
  const petRecords = useMemo(() => {
    return medicalRecords
      .filter((record) => record.petId === selectedPetId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [medicalRecords, selectedPetId]);

  // Búsqueda de expedientes
  const filteredRecords = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return petRecords;

    return petRecords.filter((record) => {
      return (
        record.type.toLowerCase().includes(search) ||
        record.diagnosis.toLowerCase().includes(search) ||
        record.veterinarian.toLowerCase().includes(search) ||
        record.reason.toLowerCase().includes(search)
      );
    });
  }, [petRecords, searchTerm]);

  // Estadísticas generales
  const totalRecords = medicalRecords.length;

  const totalPetsWithRecords = pets.filter((pet) =>
    medicalRecords.some((record) => record.petId === pet.id)
  ).length;

  const recordsThisMonth = medicalRecords.filter((record) => {
    const recordDate = new Date(`${record.date}T12:00:00`);
    const today = new Date();

    return (
      recordDate.getMonth() === today.getMonth() &&
      recordDate.getFullYear() === today.getFullYear()
    );
  }).length;

  // ==========================================
  // RENDERIZADO
  // ==========================================

  return (
    <div className="client-records-layout">
      <ClientSidebar />

      <main className="client-records-main">
        {!selectedPet ? (
          <>
            {/* ENCABEZADO */}

            <header className="client-records-header">
              <div>
                <span className="client-records-eyebrow">
                  PORTAL DEL CLIENTE
                </span>

                <h1>Mis expedientes médicos</h1>

                <p>
                  Consulta el historial médico y la información
                  veterinaria de tus mascotas.
                </p>
              </div>
            </header>

            {/* ESTADÍSTICAS */}

            <section className="client-records-stats">
              <div className="client-records-stat-card">
                <div className="client-records-stat-icon blue">
                  <PawPrint size={22} />
                </div>

                <div>
                  <span>Mascotas registradas</span>
                  <strong>{pets.length}</strong>
                </div>
              </div>

              <div className="client-records-stat-card">
                <div className="client-records-stat-icon green">
                  <FileText size={22} />
                </div>

                <div>
                  <span>Expedientes registrados</span>
                  <strong>{totalRecords}</strong>
                </div>
              </div>

              <div className="client-records-stat-card">
                <div className="client-records-stat-icon orange">
                  <CalendarDays size={22} />
                </div>

                <div>
                  <span>Consultas este mes</span>
                  <strong>{recordsThisMonth}</strong>
                </div>
              </div>
            </section>

            {/* MASCOTAS */}

            <section className="client-records-pets-section">
              <div className="client-records-section-heading">
                <div>
                  <h2>Mis mascotas</h2>
                  <p>
                    Selecciona una mascota para consultar su historial médico.
                  </p>
                </div>

                <span className="client-records-count">
                  {pets.length} mascotas
                </span>
              </div>

              {pets.length > 0 ? (
                <div className="client-records-pets-grid">
                  {pets.map((pet) => {
                    const PetIcon = pet.icon;

                    const recordCount = medicalRecords.filter(
                      (record) => record.petId === pet.id
                    ).length;

                    const lastRecord = medicalRecords
                      .filter((record) => record.petId === pet.id)
                      .sort(
                        (a, b) =>
                          new Date(b.date) - new Date(a.date)
                      )[0];

                    return (
                      <article
                        className="client-records-pet-card"
                        key={pet.id}
                      >
                        <div className="client-records-pet-top">
                          <div className="client-records-pet-avatar">
                            <PetIcon size={34} />
                          </div>

                          <span className="client-records-pet-status">
                            <span />
                            Registrada
                          </span>
                        </div>

                        <div className="client-records-pet-info">
                          <h3>{pet.name}</h3>

                          <p>
                            {pet.breed}
                          </p>

                          <div className="client-records-pet-details">
                            <span>{pet.species}</span>
                            <span>{pet.age}</span>
                            <span>{pet.sex}</span>
                          </div>
                        </div>

                        <div className="client-records-pet-summary">
                          <div>
                            <FileText size={16} />
                            <span>
                              {recordCount} expedientes
                            </span>
                          </div>

                          {lastRecord && (
                            <small>
                              Última consulta:{" "}
                              {formatDate(lastRecord.date)}
                            </small>
                          )}
                        </div>

                        <button
                          type="button"
                          className="client-records-view-button"
                          onClick={() => {
                            setSelectedPetId(pet.id);
                            setSearchTerm("");
                          }}
                        >
                          Ver historial médico
                          <Eye size={17} />
                        </button>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="client-records-empty">
                  <PawPrint size={42} />

                  <h3>No tienes mascotas registradas</h3>

                  <p>
                    Cuando tengas mascotas asociadas a tu cuenta,
                    aparecerán aquí.
                  </p>
                </div>
              )}
            </section>
          </>
        ) : (
          <>
            {/* ENCABEZADO DEL HISTORIAL */}

            <header className="client-records-header">
              <button
                type="button"
                className="client-records-back-button"
                onClick={() => {
                  setSelectedPetId(null);
                  setSearchTerm("");
                }}
              >
                <ArrowLeft size={18} />
                Volver a mis mascotas
              </button>

              <div className="client-records-history-title">
                <div>
                  <span className="client-records-eyebrow">
                    HISTORIAL MÉDICO
                  </span>

                  <h1>Expediente de {selectedPet.name}</h1>

                  <p>
                    Consulta todas las atenciones veterinarias registradas.
                  </p>
                </div>

                <div className="client-records-history-avatar">
                  {(() => {
                    const PetIcon = selectedPet.icon;
                    return <PetIcon size={34} />;
                  })()}
                </div>
              </div>
            </header>

            {/* INFORMACIÓN DE LA MASCOTA */}

            <section className="client-records-pet-profile">
              <div className="client-records-profile-heading">
                <div className="client-records-pet-avatar">
                  {(() => {
                    const PetIcon = selectedPet.icon;
                    return <PetIcon size={30} />;
                  })()}
                </div>

                <div>
                  <h2>{selectedPet.name}</h2>
                  <p>{selectedPet.breed}</p>
                </div>
              </div>

              <div className="client-records-profile-details">
                <div>
                  <span>Especie</span>
                  <strong>{selectedPet.species}</strong>
                </div>

                <div>
                  <span>Edad</span>
                  <strong>{selectedPet.age}</strong>
                </div>

                <div>
                  <span>Sexo</span>
                  <strong>{selectedPet.sex}</strong>
                </div>

                <div>
                  <span>Peso</span>
                  <strong>{selectedPet.weight}</strong>
                </div>
              </div>
            </section>

            {/* RESUMEN DEL HISTORIAL */}

            <section className="client-records-history-stats">
              <div>
                <FileText size={19} />
                <span>Expedientes</span>
                <strong>{petRecords.length}</strong>
              </div>

              <div>
                <HeartPulse size={19} />
                <span>Consultas registradas</span>
                <strong>{petRecords.length}</strong>
              </div>

              <div>
                <Paperclip size={19} />
                <span>Documentos adjuntos</span>
                <strong>
                  {petRecords.reduce(
                    (total, record) =>
                      total + record.attachments.length,
                    0
                  )}
                </strong>
              </div>
            </section>

            {/* LISTADO DE EXPEDIENTES */}

            <section className="client-records-history-section">
              <div className="client-records-section-heading">
                <div>
                  <h2>Historial de consultas</h2>
                  <p>
                    Expedientes médicos de {selectedPet.name}.
                  </p>
                </div>
              </div>

              <div className="client-records-search">
                <Search size={19} />

                <input
                  type="text"
                  placeholder="Buscar por consulta, diagnóstico o veterinario..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    aria-label="Limpiar búsqueda"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              {filteredRecords.length > 0 ? (
                <div className="client-records-list">
                  {filteredRecords.map((record) => (
                    <article
                      className="client-records-item"
                      key={record.id}
                    >
                      <div className="client-records-item-date">
                        <CalendarDays size={19} />

                        <span>
                          {formatDate(record.date)}
                        </span>
                      </div>

                      <div className="client-records-item-content">
                        <div className="client-records-item-heading">
                          <div>
                            <h3>{record.type}</h3>

                            <span className="client-records-veterinarian">
                              <Stethoscope size={15} />
                              {record.veterinarian}
                            </span>
                          </div>

                          <span className="client-records-record-badge">
                            Expediente médico
                          </span>
                        </div>

                        <p>
                          {record.reason}
                        </p>

                        <div className="client-records-item-footer">
                          <span>
                            <FileText size={15} />
                            {record.attachments.length} documentos
                          </span>

                          <button
                            type="button"
                            onClick={() => setSelectedRecord(record)}
                          >
                            Ver expediente
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="client-records-empty">
                  <Search size={38} />

                  <h3>No se encontraron expedientes</h3>

                  <p>
                    No hay consultas que coincidan con tu búsqueda.
                    Prueba con otro término.
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* MODAL DE DETALLE DEL EXPEDIENTE */}

      <Modal
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        title="Detalle del expediente médico"
        description={
          selectedRecord
            ? `${selectedPet?.name} · ${formatDate(selectedRecord.date)}`
            : ""
        }
      >
        {selectedRecord && (
          <div className="client-records-modal-content">
            <div className="client-records-modal-heading">
              <div className="client-records-modal-icon">
                <ClipboardList size={25} />
              </div>

              <div>
                <h3>{selectedRecord.type}</h3>
                <span>{selectedRecord.veterinarian}</span>
              </div>
            </div>

            <div className="client-records-detail-section">
              <h4>Motivo de consulta</h4>
              <p>{selectedRecord.reason}</p>
            </div>

            <div className="client-records-detail-section">
              <h4>Síntomas</h4>
              <p>{selectedRecord.symptoms}</p>
            </div>

            <div className="client-records-detail-section">
              <h4>Diagnóstico médico</h4>
              <p>{selectedRecord.diagnosis}</p>
            </div>

            <div className="client-records-detail-section">
              <h4>Tratamiento indicado</h4>
              <p>{selectedRecord.treatment}</p>

              {selectedRecord.medications.length > 0 && (
                <ul>
                  {selectedRecord.medications.map((medication, index) => (
                    <li key={index}>{medication}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="client-records-detail-section">
              <h4>Observaciones del veterinario</h4>
              <p>{selectedRecord.observations}</p>
            </div>

            <div className="client-records-detail-section">
              <h4>
                <Paperclip size={17} />
                Documentos adjuntos
              </h4>

              {selectedRecord.attachments.length > 0 ? (
                <div className="client-records-attachments">
                  {selectedRecord.attachments.map((attachment, index) => {
                    const AttachmentIcon =
                      attachment.type === "Imagen" ? FileImage : File;

                    return (
                      <div
                        className="client-records-attachment"
                        key={index}
                      >
                        <AttachmentIcon size={21} />

                        <div>
                          <strong>{attachment.name}</strong>
                          <span>
                            {attachment.type} · {attachment.size}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="client-records-no-attachments">
                  Este expediente no tiene documentos adjuntos.
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ClientMedicalRecords;
