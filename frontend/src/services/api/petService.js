import api from "./axiosConfig";

const sexMapToFront = { MALE: "Macho", FEMALE: "Hembra", UNKNOWN: "Desconocido" };
const sexMapToBack = { Macho: "MALE", Hembra: "FEMALE", Desconocido: "UNKNOWN" };

export const petService = {
  getAll: async () => {
    const { data } = await api.get("/pets", { params: { size: 100 } });
    const list = data.content || data;
    return list.map((p) => ({
      id: p.id,
      name: p.name,
      speciesId: p.speciesId,
      species: p.speciesName || "Otro",
      breedId: p.breedId,
      breed: p.breedName || "Mestizo",
      sex: sexMapToFront[p.sex] || p.sex || "Macho",
      age: p.birthDate ? `Nac: ${p.birthDate}` : "N/A",
      birthDate: p.birthDate || "",
      weight: p.weight || "",
      ownerId: p.ownerId,
      owner: p.ownerName || "Sin propietario",
      registrationDate: p.createdAt ? p.createdAt.split("T")[0] : "",
      status: "Activo",
      observations: p.observations || "",
    }));
  },

  getSpecies: async () => {
    const { data } = await api.get("/species");
    return data;
  },

  getBreedsBySpecies: async (speciesId) => {
    const { data } = await api.get(`/species/${speciesId}/breeds`);
    return data;
  },

  create: async (formData) => {
    const payload = {
      ownerId: Number(formData.ownerId),
      speciesId: Number(formData.speciesId),
      breedId: formData.breedId ? Number(formData.breedId) : null,
      name: formData.name,
      birthDate: formData.birthDate || null,
      weight: formData.weight ? Number(formData.weight) : null,
      sex: sexMapToBack[formData.sex] || "UNKNOWN",
      observations: formData.observations || "",
    };
    const { data } = await api.post("/pets", payload);
    return data;
  },

  update: async (id, formData) => {
    const payload = {
      ownerId: Number(formData.ownerId),
      speciesId: Number(formData.speciesId),
      breedId: formData.breedId ? Number(formData.breedId) : null,
      name: formData.name,
      birthDate: formData.birthDate || null,
      weight: formData.weight ? Number(formData.weight) : null,
      sex: sexMapToBack[formData.sex] || "UNKNOWN",
      observations: formData.observations || "",
    };
    const { data } = await api.put(`/pets/${id}`, payload);
    return data;
  },

  remove: async (id) => {
    await api.delete(`/pets/${id}`);
  },
};