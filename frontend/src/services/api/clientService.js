import api from "./axiosConfig";

export const clientService = {
  getAll: async () => {
    const { data } = await api.get("/users", {
      params: { role: "CLIENT", size: 100 },
    });
    const list = data.content || data;
    return list.map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`.trim(),
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: u.phone || "Sin teléfono",
      address: "Oaxaca", // Tu UserProfileResponse aún no tiene address
      pets: u.petsCount || 0,
      status: u.active ? "Activo" : "Inactivo",
    }));
  },

  create: async (formData) => {
    const parts = formData.name.trim().split(" ");
    const firstName = parts[0] || "Cliente";
    const lastName = parts.slice(1).join(" ") || "VetCare";

    const payload = {
      firstName,
      lastName,
      email: formData.email,
      phone: formData.phone,
      password: "VetCare2026!", // Cumple tu PASSWORD_REGEX (8+ chars, Mayús, Núm, Especial)
      role: "CLIENT",
    };

    const { data } = await api.post("/users", payload);
    return data;
  },

  toggleActive: async (id) => {
    const { data } = await api.patch(`/users/${id}/toggle-active`);
    return data;
  },
};