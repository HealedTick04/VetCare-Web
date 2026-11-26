import api from "./axiosConfig";
import { settingsService } from "./settingsService";

const STORAGE_READ_KEY = "vetcare_notifications_read";
const STORAGE_DELETED_KEY = "vetcare_notifications_deleted";

function getStoredSet(key) {
  try {
    const raw = localStorage.getItem(key);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveStoredSet(key, set) {
  localStorage.setItem(key, JSON.stringify(Array.from(set)));
}

export const notificationService = {
  getAll: async (role = "VETERINARIAN") => {
    const isClient = role === "CLIENT";
    const readIds = getStoredSet(STORAGE_READ_KEY);
    const deletedIds = getStoredSet(STORAGE_DELETED_KEY);
    const prefs = settingsService.getAll().notifications;

    const [apptsRes, recordsRes, inventoryRes] = await Promise.all([
      api.get("/appointments", { params: { size: 50 } }).catch(() => ({ data: [] })),
      api.get("/medical-records", { params: { size: 30 } }).catch(() => ({ data: [] })),
      !isClient
        ? api.get("/inventory", { params: { size: 100 } }).catch(() => ({ data: [] }))
        : Promise.resolve({ data: [] }),
    ]);

    const appointments = apptsRes.data.content || apptsRes.data || [];
    const records = recordsRes.data.content || recordsRes.data || [];
    const inventory = inventoryRes.data.content || inventoryRes.data || [];

    const items = [];

    // 1. Avisos de Inventario (solo personal de la clínica)
    if (!isClient && prefs.lowInventory) {
      inventory.forEach((prod) => {
        const qty = prod.quantity ?? 0;
        const min = prod.minStock ?? 5;

        if (qty === 0) {
          const id = `inv-out-${prod.id}`;
          items.push({
            id,
            title: "Producto agotado",
            message: `El producto "${prod.name}" ya no tiene existencias en inventario.`,
            type: "Inventario",
            date: new Date().toISOString(),
            read: readIds.has(id),
          });
        } else if (qty <= min) {
          const id = `inv-low-${prod.id}-${qty}`;
          items.push({
            id,
            title: `Stock bajo: ${prod.name}`,
            message: `Quedan ${qty} unidades (mínimo recomendado: ${min}).`,
            type: "Inventario",
            date: new Date().toISOString(),
            read: readIds.has(id),
          });
        }
      });
    }

    // 2. Avisos de Citas (pendientes, confirmadas o canceladas recientes)
    appointments.slice(0, 15).forEach((appt) => {
      const id = `appt-${appt.id}-${appt.status}`;
      const dateStr = appt.appointmentDate || new Date().toISOString();

      if ((appt.status === "PENDING" || appt.status === "CONFIRMED") && prefs.newAppointments) {
        items.push({
          id,
          title: "Cita pendiente de confirmación",
          message: `Cita para ${appt.petName || "mascota"} (${appt.reason || "Consulta"}) con ${appt.veterinarianName || "veterinario"}.`,
          type: "Citas",
          date: dateStr,
          read: readIds.has(id),
        });
      } else if (appt.status === "CONFIRMED") {
        items.push({
          id,
          title: "Cita confirmada",
          message: `La cita de ${appt.petName || "mascota"} está confirmada (${appt.reason || "Consulta"}).`,
          type: "Citas",
          date: dateStr,
          read: readIds.has(id),
        });
      } else if (appt.status === "CANCELLED" && prefs.cancelledAppointments) {
        items.push({
          id,
          title: "Cita cancelada",
          message: `Se canceló la cita de ${appt.petName || "mascota"} (${appt.ownerName || "cliente"}).`,
          type: "Citas",
          date: dateStr,
          read: readIds.has(id),
        });
      }
    });

    // 3. Avisos de Expedientes Médicos recientes
    records.slice(0, 10).forEach((rec) => {
      const id = `rec-${rec.id}`;
      items.push({
        id,
        title: "Expediente médico registrado",
        message: `Consulta de ${rec.petName || "mascota"}: ${rec.diagnosis || "Revisión clínica"}.`,
        type: "Expedientes",
        date: rec.recordDate || new Date().toISOString(),
        read: readIds.has(id),
      });
    });

    // Filtrar eliminadas y ordenar por fecha más reciente
    return items
      .filter((item) => !deletedIds.has(item.id))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  markAsRead: (id) => {
    const readIds = getStoredSet(STORAGE_READ_KEY);
    readIds.add(id);
    saveStoredSet(STORAGE_READ_KEY, readIds);
  },

  markAllAsRead: (ids) => {
    const readIds = getStoredSet(STORAGE_READ_KEY);
    ids.forEach((id) => readIds.add(id));
    saveStoredSet(STORAGE_READ_KEY, readIds);
  },

  deleteNotification: (id) => {
    const deletedIds = getStoredSet(STORAGE_DELETED_KEY);
    deletedIds.add(id);
    saveStoredSet(STORAGE_DELETED_KEY, deletedIds);
  },
};