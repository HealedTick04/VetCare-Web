import api from "./axiosConfig";

const roleToLabel = {
  ADMIN: "Administrador",
  VETERINARIAN: "Veterinario",
  CLIENT: "Cliente",
};

const labelToRole = {
  Administrador: "ADMIN",
  Veterinario: "VETERINARIAN",
  Cliente: "CLIENT",
};

function splitFullName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "Usuario";
  return { firstName, lastName };
}

export const userService = {
  getAll: async () => {
    const { data } = await api.get("/users", { params: { size: 100 } });
    const list = data.content || data;

    return list.map((u) => {
      const dateStr = u.createdAt
        ? u.createdAt.split("T")[0].split("-").reverse().join("/")
        : "Sin fecha";

      return {
        id: u.id,
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
        email: u.email,
        phone: u.phone || "Sin teléfono",
        roleCode: u.role,
        role: roleToLabel[u.role] || u.role,
        status: u.active !== false ? "Activo" : "Inactivo",
        registrationDate: dateStr,
      };
    });
  },

  getById: async (id) => {
    const { data } = await api.get(`/users/${id}`);
    return {
      id: data.id,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
      email: data.email,
      phone: data.phone || "",
      role: data.role,
      roleLabel: roleToLabel[data.role] || data.role,
    };
  },

  create: async (form) => {
    const { firstName, lastName } = splitFullName(form.name);
    const payload = {
      firstName,
      lastName,
      email: form.email.trim().toLowerCase(),
      password: form.password.trim(),
      phone: form.phone.trim(),
      role: labelToRole[form.role] || "CLIENT",
    };

    const { data } = await api.post("/users", payload);
    return data;
  },

  update: async (id, form) => {
    const { firstName, lastName } = splitFullName(form.name);
    const payload = {
      firstName,
      lastName,
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      role: labelToRole[form.role] || form.role || "CLIENT",
    };

    const { data } = await api.put(`/users/${id}`, payload);
    return data;
  },

  toggleActive: async (id) => {
    const { data } = await api.patch(`/users/${id}/toggle-active`);
    return data;
  },
};