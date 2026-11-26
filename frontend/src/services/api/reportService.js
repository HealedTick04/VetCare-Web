import api from "./axiosConfig";

const MONTH_NAMES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function getCutoffDate(period) {
  const now = new Date();
  const cutoff = new Date(now);

  switch (period) {
    case "7 días":
      cutoff.setDate(now.getDate() - 7);
      break;
    case "30 días":
      cutoff.setDate(now.getDate() - 30);
      break;
    case "12 meses":
      cutoff.setFullYear(now.getFullYear() - 1);
      break;
    case "6 meses":
    default:
      cutoff.setMonth(now.getMonth() - 6);
      break;
  }
  return cutoff;
}

export const reportService = {
  fetchAllDatasets: async () => {
    const [apptsRes, usersRes, petsRes, inventoryRes, invoicesRes] =
      await Promise.all([
        api.get("/appointments", { params: { size: 500 } }),
        api.get("/users", { params: { size: 500 } }),
        api.get("/pets", { params: { size: 500 } }),
        api.get("/inventory", { params: { size: 500 } }),
        api.get("/invoices", { params: { size: 500 } }).catch(() => ({ data: [] })),
      ]);

    return {
      appointments: apptsRes.data.content || apptsRes.data || [],
      users: usersRes.data.content || usersRes.data || [],
      pets: petsRes.data.content || petsRes.data || [],
      inventory: inventoryRes.data.content || inventoryRes.data || [],
      invoices: invoicesRes.data.content || invoicesRes.data || [],
    };
  },

  buildReportForPeriod: (datasets, period) => {
    const { appointments, users, pets, inventory, invoices } = datasets;
    const cutoff = getCutoffDate(period);

    const periodAppointments = appointments.filter((a) => {
      if (!a.appointmentDate) return false;
      const d = new Date(a.appointmentDate);
      return d >= cutoff;
    });

    const clientsCount = users.filter((u) => u.role === "CLIENT").length;
    const petsCount = pets.length;

    // Ingresos reales de facturas PAID en el periodo
    const periodIncome = invoices
      .filter((inv) => {
        if (inv.status !== "PAID") return false;
        const d = inv.createdAt ? new Date(inv.createdAt) : new Date();
        return d >= cutoff;
      })
      .reduce((sum, inv) => sum + Number(inv.total || 0), 0);

    // Agrupación para gráfica de barras (Actividad de citas)
    let activityChart = [];
    if (period === "7 días") {
      const orderedDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
      const counts = Object.fromEntries(orderedDays.map((d) => [d, 0]));
      periodAppointments.forEach((a) => {
        const dayLabel = DAY_NAMES[new Date(a.appointmentDate).getDay()];
        if (counts[dayLabel] !== undefined) counts[dayLabel] += 1;
      });
      activityChart = orderedDays.map((day) => ({
        month: day,
        citas: counts[day],
      }));
    } else {
      const monthCounts = {};
      periodAppointments.forEach((a) => {
        const d = new Date(a.appointmentDate);
        const key = `${MONTH_NAMES[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
        monthCounts[key] = (monthCounts[key] || 0) + 1;
      });
      activityChart = Object.entries(monthCounts).map(([month, citas]) => ({
        month,
        citas,
      }));
      if (activityChart.length === 0) {
        const nowMonth = MONTH_NAMES[new Date().getMonth()];
        activityChart = [{ month: nowMonth, citas: 0 }];
      }
    }

    // Estado de las citas (Gráfica de pastel)
    const completed = periodAppointments.filter(
      (a) => a.status === "COMPLETED"
    ).length;
    const pending = periodAppointments.filter(
      (a) => a.status === "PENDING" || a.status === "CONFIRMED"
    ).length;
    const cancelled = periodAppointments.filter(
      (a) => a.status === "CANCELLED" || a.status === "NO_SHOW"
    ).length;

    const statuses = [
      { name: "Completadas", value: completed },
      { name: "Pendientes", value: pending },
      { name: "Canceladas", value: cancelled },
    ];

    // Servicios / motivos más solicitados
    const serviceMap = {};
    periodAppointments.forEach((a) => {
      const reason = (a.reason || "Consulta general").trim();
      serviceMap[reason] = (serviceMap[reason] || 0) + 1;
    });

    const services = Object.entries(serviceMap)
      .map(([name, cantidad]) => ({ name, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 6);

    // Resumen de inventario
    const availableCount = inventory.filter(
      (i) => (i.quantity ?? 0) > (i.minStock ?? 5)
    ).length;
    const lowCount = inventory.filter(
      (i) => (i.quantity ?? 0) > 0 && (i.quantity ?? 0) <= (i.minStock ?? 5)
    ).length;
    const emptyCount = inventory.filter((i) => (i.quantity ?? 0) === 0).length;

    const inventorySummary = [
      {
        name: "Productos disponibles",
        value: availableCount,
        status: "Normal",
        type: "available",
      },
      {
        name: "Productos con stock bajo",
        value: lowCount,
        status: "Atención",
        type: "low",
      },
      {
        name: "Productos agotados",
        value: emptyCount,
        status: "Agotado",
        type: "empty",
      },
    ];

    return {
      stats: {
        appointments: periodAppointments.length,
        clients: clientsCount,
        pets: petsCount,
        income: periodIncome,
      },
      appointments: activityChart,
      statuses,
      services:
        services.length > 0 ? services : [{ name: "Sin registros", cantidad: 0 }],
      inventorySummary,
    };
  },
};