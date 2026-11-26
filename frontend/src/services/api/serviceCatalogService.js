import api from "./axiosConfig";

export const serviceCatalogService = {
  getAll: async () => {
    const { data } = await api.get("/services", { params: { size: 100 } });
    const list = data.content || data;

    return list.map((s) => ({
      id: s.id,
      name: s.name,
      category: "Clínica",
      description: s.description || "Sin descripción",
      duration: s.durationMinutes || 30,
      price: Number(s.price) || 0,
      status: s.active !== false ? "Activo" : "Inactivo",
      icon: "stethoscope",
    }));
  },

  create: async (formData) => {
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      durationMinutes: Number(formData.duration),
      active: formData.status === "Activo",
    };

    const { data } = await api.post("/services", payload);
    return data;
  },
};