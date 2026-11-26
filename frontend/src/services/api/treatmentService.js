import api from "./axiosConfig";

export const treatmentService = {
  // Obtiene todos los tratamientos aplicados a mascotas a partir de los expedientes médicos
  getAllApplied: async () => {
    const { data } = await api.get("/medical-records", { params: { size: 100 } });
    const records = data.content || data;

    const appliedList = [];

    records.forEach((record) => {
      const dateStr = record.recordDate
        ? record.recordDate.split("T")[0].split("-").reverse().join("/")
        : "Sin fecha";

      if (record.treatments && record.treatments.length > 0) {
        record.treatments.forEach((t, idx) => {
          appliedList.push({
            id: `${record.id}-${t.treatmentId}-${idx}`,
            recordId: record.id,
            petId: record.petId,
            pet: record.petName || "Mascota",
            owner: record.ownerName || "Propietario",
            treatment: t.treatmentName || "Tratamiento",
            medication: t.dosage || "Según receta",
            frequency: t.frequency || "",
            duration: t.duration || "",
            veterinarian: record.veterinarianName || "Veterinario",
            startDate: dateStr,
            endDate: t.duration || "Según evolución",
            description: record.diagnosis || "",
            instructions: t.instructions || record.recommendations || "",
            status: "En curso",
          });
        });
      }
    });

    return appliedList;
  },

  // Obtiene el catálogo maestro de tratamientos (tabla treatments)
  getCatalog: async () => {
    const { data } = await api.get("/treatments", { params: { size: 100 } });
    return data.content || data;
  },

  // Asigna un tratamiento del catálogo creando un registro médico asociado a la mascota
  assignTreatment: async (formData) => {
    const payload = {
      petId: Number(formData.petId),
      diagnosis: formData.description?.trim() || `Asignación de ${formData.treatmentName}`,
      symptoms: "",
      observations: "",
      recommendations: formData.instructions?.trim() || "",
      treatments: [
        {
          treatmentId: Number(formData.treatmentId),
          dosage: formData.medication || "",
          frequency: formData.frequency || "",
          duration: formData.duration || "",
          instructions: formData.instructions || "",
        },
      ],
    };

    const { data } = await api.post("/medical-records", payload);
    return data;
  },
};