import api from "./axiosConfig";

export const appointmentService = {
  getAll: async () => {
    const { data } = await api.get("/appointments", { params: { size: 100 } });
    const list = data.content || data;

    return list.map((a) => {
      // a.appointmentDate viene como "2026-11-25T10:00:00"
      const [datePart, timePart] = (a.appointmentDate || "").split("T");
      return {
        id: a.id,
        date: datePart || "",
        time: timePart ? timePart.slice(0, 5) : "09:00",
        petId: a.petId,
        pet: a.petName || "Mascota",
        ownerId: a.ownerId,
        owner: a.ownerName || "Propietario",
        service: a.reason || "Consulta general",
        veterinarianId: a.veterinarianId,
        veterinarian: a.veterinarianName || "Veterinario",
        status: a.status || "PENDING",
        notes: a.clientNotes || "",
      };
    });
  },

  getVeterinarians: async () => {
    const { data } = await api.get("/users", {
      params: { role: "VETERINARIAN", size: 100 },
    });
    const list = data.content || data;
    return list.map((v) => ({
      id: v.id,
      name: `${v.firstName} ${v.lastName}`.trim(),
    }));
  },

  create: async (formData) => {
    const payload = {
      petId: Number(formData.petId),
      veterinarianId: Number(formData.veterinarianId),
      appointmentDate: `${formData.date}T${formData.time}:00`,
      durationMinutes: 30,
      reason: formData.service,
      clientNotes: formData.notes || "",
    };
    const { data } = await api.post("/appointments", payload);
    return data;
  },

  updateStatus: async (id, status) => {
    const { data } = await api.patch(`/appointments/${id}/status`, { status });
    return data;
  },
};