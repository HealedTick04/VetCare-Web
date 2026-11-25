import api from "./axiosConfig";

const STORAGE_KEY = "vetcare_system_settings";

export const defaultSettings = {
  clinic: {
    name: "VetCare",
    email: "contacto@vetcare.com",
    phone: "55 1234 5678",
    address: "Ciudad de México, México",
    openingTime: "09:00",
    closingTime: "18:00",
  },
  preferences: {
    language: "Español",
    timezone: "America/Mexico_City",
    dateFormat: "DD/MM/YYYY",
    currency: "MXN",
  },
  notifications: {
    newAppointments: true,
    cancelledAppointments: true,
    lowInventory: true,
    emailNotifications: false,
  },
};

export const settingsService = {
  getAll: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultSettings;
      const parsed = JSON.parse(raw);

      return {
        clinic: { ...defaultSettings.clinic, ...(parsed.clinic || {}) },
        preferences: {
          ...defaultSettings.preferences,
          ...(parsed.preferences || {}),
        },
        notifications: {
          ...defaultSettings.notifications,
          ...(parsed.notifications || {}),
        },
      };
    } catch {
      return defaultSettings;
    }
  },

  saveSection: (sectionKey, sectionData) => {
    const current = settingsService.getAll();
    const updated = {
      ...current,
      [sectionKey]: sectionData,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  checkBackendHealth: async () => {
    try {
      await api.get("/services", { params: { size: 1 } });
      return true;
    } catch {
      return false;
    }
  },
};