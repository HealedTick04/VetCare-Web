import api from "./axiosConfig";

export const medicalRecordService = {
  getAll: async () => {
    const { data } = await api.get("/medical-records", { params: { size: 100 } });
    const list = data.content || data;

    return list.map((r) => {
      const dateOnly = r.recordDate ? r.recordDate.split("T")[0] : "";
      const treatmentsSummary =
        r.treatments && r.treatments.length > 0
          ? r.treatments
              .map(
                (t) =>
                  `${t.treatmentName}${t.dosage ? ` (${t.dosage})` : ""}`
              )
              .join(", ")
          : r.recommendations || "Sin tratamiento registrado";

      return {
        id: r.id,
        petId: r.petId,
        pet: r.petName || "Mascota",
        species: r.speciesName || "Mascota",
        owner: r.ownerName || "Propietario",
        veterinarianId: r.veterinarianId,
        veterinarian: r.veterinarianName || "Veterinario",
        date: dateOnly,
        reason: r.symptoms ? r.symptoms.slice(0, 40) : "Consulta médica",
        symptoms: r.symptoms || "",
        diagnosis: r.diagnosis || "",
        treatment: treatmentsSummary,
        recommendations: r.recommendations || "",
        observations: r.observations || "",
        treatmentsList: r.treatments || [],
        status: "Finalizado",
      };
    });
  },

  getTreatmentsCatalog: async () => {
    const { data } = await api.get("/treatments", { params: { size: 100 } });
    return data.content || data;
  },

  create: async (formData) => {
    const payload = {
      petId: Number(formData.petId),
      diagnosis: formData.diagnosis.trim(),
      symptoms: formData.symptoms?.trim() || "",
      observations: formData.observations?.trim() || "",
      recommendations: formData.recommendations?.trim() || "",
      treatments: formData.selectedTreatmentId
        ? [
            {
              treatmentId: Number(formData.selectedTreatmentId),
              dosage: formData.dosage || "",
              frequency: formData.frequency || "",
              duration: formData.duration || "",
              instructions: formData.recommendations || "",
            },
          ]
        : [],
    };

    const { data } = await api.post("/medical-records", payload);
    return data;
  },
};