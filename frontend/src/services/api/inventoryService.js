import api from "./axiosConfig";

export const inventoryService = {
  getAll: async () => {
    const { data } = await api.get("/inventory", { params: { size: 100 } });
    const list = data.content || data;

    return list.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.unit || "General",
      description: item.description || "",
      code: `INV-${String(item.id).padStart(3, "0")}`,
      quantity: item.quantity ?? 0,
      minimumStock: item.minStock ?? 5,
      price: Number(item.unitPrice) || 0,
      unit: item.unit || "pieza",
      expirationDate: item.expirationDate || "",
    }));
  },

  create: async (formData) => {
    const payload = {
      name: formData.name.trim(),
      description: formData.description?.trim() || "",
      quantity: Number(formData.quantity),
      minStock: Number(formData.minimumStock),
      unitPrice: Number(formData.price),
      unit: formData.category || "pieza",
      expirationDate: formData.expirationDate || null,
    };

    const { data } = await api.post("/inventory", payload);
    return data;
  },
};