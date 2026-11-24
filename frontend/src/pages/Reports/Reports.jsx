
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Users,
  PawPrint,
  DollarSign,
  Download,
  TrendingUp,
  ClipboardList,
  Package,
  FileSpreadsheet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Sidebar from "../../components/layout/Sidebar";
import "./Reports.css";

const COLORS = ["#3976a1", "#e5a84b", "#d96b6b"];

const reportData = {
  "7 días": {
    stats: {
      appointments: 32,
      clients: 248,
      pets: 326,
      income: 4850,
    },
    appointments: [
      { month: "Lun", citas: 4 },
      { month: "Mar", citas: 6 },
      { month: "Mié", citas: 5 },
      { month: "Jue", citas: 3 },
      { month: "Vie", citas: 7 },
      { month: "Sáb", citas: 5 },
      { month: "Dom", citas: 2 },
    ],
    statuses: [
      { name: "Completadas", value: 22 },
      { name: "Pendientes", value: 7 },
      { name: "Canceladas", value: 3 },
    ],
    services: [
      { name: "Consulta", cantidad: 12 },
      { name: "Vacunación", cantidad: 8 },
      { name: "Estética", cantidad: 5 },
      { name: "Cirugía", cantidad: 2 },
      { name: "Curaciones", cantidad: 5 },
    ],
    incomeLabel: "Últimos 7 días",
  },
  "30 días": {
    stats: {
      appointments: 142,
      clients: 248,
      pets: 326,
      income: 18450,
    },
    appointments: [
      { month: "Semana 1", citas: 30 },
      { month: "Semana 2", citas: 38 },
      { month: "Semana 3", citas: 35 },
      { month: "Semana 4", citas: 39 },
    ],
    statuses: [
      { name: "Completadas", value: 98 },
      { name: "Pendientes", value: 28 },
      { name: "Canceladas", value: 16 },
    ],
    services: [
      { name: "Consulta", cantidad: 42 },
      { name: "Vacunación", cantidad: 34 },
      { name: "Estética", cantidad: 26 },
      { name: "Cirugía", cantidad: 15 },
      { name: "Curaciones", cantidad: 25 },
    ],
    incomeLabel: "Últimos 30 días",
  },
  "6 meses": {
    stats: {
      appointments: 685,
      clients: 248,
      pets: 326,
      income: 85450,
    },
    appointments: [
      { month: "Jun", citas: 85 },
      { month: "Jul", citas: 110 },
      { month: "Ago", citas: 95 },
      { month: "Sep", citas: 130 },
      { month: "Oct", citas: 145 },
      { month: "Nov", citas: 120 },
    ],
    statuses: [
      { name: "Completadas", value: 445 },
      { name: "Pendientes", value: 137 },
      { name: "Canceladas", value: 103 },
    ],
    services: [
      { name: "Consulta", cantidad: 185 },
      { name: "Vacunación", cantidad: 145 },
      { name: "Estética", cantidad: 108 },
      { name: "Cirugía", cantidad: 92 },
      { name: "Curaciones", cantidad: 155 },
    ],
    incomeLabel: "Últimos 6 meses",
  },
  "12 meses": {
    stats: {
      appointments: 1280,
      clients: 248,
      pets: 326,
      income: 164800,
    },
    appointments: [
      { month: "Dic", citas: 80 },
      { month: "Ene", citas: 92 },
      { month: "Feb", citas: 88 },
      { month: "Mar", citas: 105 },
      { month: "Abr", citas: 98 },
      { month: "May", citas: 112 },
      { month: "Jun", citas: 85 },
      { month: "Jul", citas: 110 },
      { month: "Ago", citas: 95 },
      { month: "Sep", citas: 130 },
      { month: "Oct", citas: 145 },
      { month: "Nov", citas: 140 },
    ],
    statuses: [
      { name: "Completadas", value: 850 },
      { name: "Pendientes", value: 260 },
      { name: "Canceladas", value: 170 },
    ],
    services: [
      { name: "Consulta", cantidad: 340 },
      { name: "Vacunación", cantidad: 285 },
      { name: "Estética", cantidad: 210 },
      { name: "Cirugía", cantidad: 175 },
      { name: "Curaciones", cantidad: 270 },
    ],
    incomeLabel: "Últimos 12 meses",
  },
};

const inventoryData = [
  { name: "Productos disponibles", value: 42, status: "Normal", type: "available" },
  { name: "Productos con stock bajo", value: 8, status: "Atención", type: "low" },
  { name: "Productos agotados", value: 3, status: "Agotado", type: "empty" },
];

function Reports() {
  const [period, setPeriod] = useState("6 meses");
  const [exportMessage, setExportMessage] = useState("");

  const currentReport = useMemo(
    () => reportData[period],
    [period]
  );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(amount);

  const handleExport = () => {
    const rows = [
      ["Reporte de VetCare"],
      ["Periodo", period],
      [],
      ["Estadísticas generales"],
      ["Indicador", "Valor"],
      ["Total de citas", currentReport.stats.appointments],
      ["Clientes registrados", currentReport.stats.clients],
      ["Mascotas registradas", currentReport.stats.pets],
      ["Ingresos estimados (MXN)", currentReport.stats.income],
      [],
      ["Actividad de citas"],
      ["Periodo", "Cantidad"],
      ...currentReport.appointments.map((item) => [
        item.month,
        item.citas,
      ]),
      [],
      ["Estado de las citas"],
      ["Estado", "Cantidad"],
      ...currentReport.statuses.map((item) => [
        item.name,
        item.value,
      ]),
      [],
      ["Servicios más solicitados"],
      ["Servicio", "Cantidad"],
      ...currentReport.services.map((item) => [
        item.name,
        item.cantidad,
      ]),
      [],
      ["Resumen de inventario"],
      ["Indicador", "Cantidad", "Estado"],
      ...inventoryData.map((item) => [
        item.name,
        item.value,
        item.status,
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(";")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `vetcare-reporte-${period.replace(" ", "-")}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportMessage("El reporte se ha descargado correctamente.");
  };

  return (
    <div className="reports-layout">
      <Sidebar role="ADMIN" />

      <main className="reports-main">
        <header className="reports-header">
          <div>
            <span className="reports-breadcrumb">
              Administración / Reportes
            </span>
            <h1>Reportes y estadísticas</h1>
            <p>Consulta el rendimiento y la actividad de tu clínica.</p>
          </div>

          <button
            className="reports-export-button"
            onClick={handleExport}
          >
            <Download size={18} />
            Exportar reporte
          </button>
        </header>

        <section className="reports-toolbar">
          <div>
            <span>Periodo de consulta</span>
            <select
              value={period}
              onChange={(event) => {
                setPeriod(event.target.value);
                setExportMessage("");
              }}
            >
              <option value="7 días">Últimos 7 días</option>
              <option value="30 días">Últimos 30 días</option>
              <option value="6 meses">Últimos 6 meses</option>
              <option value="12 meses">Últimos 12 meses</option>
            </select>
          </div>

          <span className="reports-update-label">
            <TrendingUp size={16} />
            Datos de demostración
          </span>
        </section>

        {exportMessage && (
          <p className="reports-export-feedback" role="status">
            <FileSpreadsheet size={17} />
            {exportMessage}
          </p>
        )}

        <section className="reports-stats">
          <article className="reports-stat-card">
            <div className="reports-stat-icon blue">
              <CalendarDays size={22} />
            </div>
            <div>
              <span>Total de citas</span>
              <strong>
                {currentReport.stats.appointments.toLocaleString("es-MX")}
              </strong>
              <small>{period} · Periodo seleccionado</small>
            </div>
          </article>

          <article className="reports-stat-card">
            <div className="reports-stat-icon green">
              <Users size={22} />
            </div>
            <div>
              <span>Clientes registrados</span>
              <strong>
                {currentReport.stats.clients.toLocaleString("es-MX")}
              </strong>
              <small>En la clínica</small>
            </div>
          </article>

          <article className="reports-stat-card">
            <div className="reports-stat-icon purple">
              <PawPrint size={22} />
            </div>
            <div>
              <span>Mascotas registradas</span>
              <strong>
                {currentReport.stats.pets.toLocaleString("es-MX")}
              </strong>
              <small>En la clínica</small>
            </div>
          </article>

          <article className="reports-stat-card">
            <div className="reports-stat-icon orange">
              <DollarSign size={22} />
            </div>
            <div>
              <span>Ingresos estimados</span>
              <strong>{formatCurrency(currentReport.stats.income)}</strong>
              <small>MXN · Dato ficticio</small>
            </div>
          </article>
        </section>

        <section className="reports-chart-grid">
          <article className="reports-panel reports-main-chart">
            <div className="reports-panel-header">
              <div>
                <h2>Actividad de citas</h2>
                <p>Cantidad de citas del periodo seleccionado.</p>
              </div>
              <CalendarDays size={20} />
            </div>

            <div className="reports-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentReport.appointments}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="citas"
                    name="Citas"
                    fill="#3976a1"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="reports-panel reports-pie-panel">
            <div className="reports-panel-header">
              <div>
                <h2>Estado de las citas</h2>
                <p>Distribución de las citas.</p>
              </div>
              <ClipboardList size={20} />
            </div>

            <div className="reports-pie-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentReport.statuses}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {currentReport.statuses.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

        <section className="reports-bottom-grid">
          <article className="reports-panel">
            <div className="reports-panel-header">
              <div>
                <h2>Servicios más solicitados</h2>
                <p>Distribución de servicios registrados.</p>
              </div>
            </div>

            <div className="reports-service-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentReport.services} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={85}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="cantidad"
                    name="Solicitudes"
                    fill="#65a68b"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="reports-panel reports-inventory-panel">
            <div className="reports-panel-header">
              <div>
                <h2>Resumen de inventario</h2>
                <p>Estado general de las existencias.</p>
              </div>
              <Package size={20} />
            </div>

            {inventoryData.map((item) => (
              <div className="reports-inventory-item" key={item.type}>
                <div>
                  <span>{item.name}</span>
                  <strong>{item.value}</strong>
                </div>
                <span className={`reports-inventory-badge ${item.type}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </article>
        </section>
      </main>
    </div>
  );
}

export default Reports;

