import { useEffect, useMemo, useState } from "react";
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
import { reportService } from "../../services/api/reportService";
import { authService } from "../../services/api/authService";
import "./Reports.css";

const COLORS = ["#3976a1", "#e5a84b", "#d96b6b"];

const emptyDatasets = {
  appointments: [],
  users: [],
  pets: [],
  inventory: [],
  invoices: [],
};

function Reports() {
  const currentUser = authService.getCurrentUser();
  const role = currentUser?.role || "ADMIN";

  const [datasets, setDatasets] = useState(emptyDatasets);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("6 meses");
  const [exportMessage, setExportMessage] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const data = await reportService.fetchAllDatasets();
        setDatasets(data);
      } catch (error) {
        console.error("Error al cargar datos de reportes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const currentReport = useMemo(
    () => reportService.buildReportForPeriod(datasets, period),
    [datasets, period]
  );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 2,
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
      ["Ingresos cobrados (MXN)", currentReport.stats.income],
      [],
      ["Actividad de citas"],
      ["Periodo", "Cantidad"],
      ...currentReport.appointments.map((item) => [item.month, item.citas]),
      [],
      ["Estado de las citas"],
      ["Estado", "Cantidad"],
      ...currentReport.statuses.map((item) => [item.name, item.value]),
      [],
      ["Servicios más solicitados"],
      ["Servicio", "Cantidad"],
      ...currentReport.services.map((item) => [item.name, item.cantidad]),
      [],
      ["Resumen de inventario"],
      ["Indicador", "Cantidad", "Estado"],
      ...currentReport.inventorySummary.map((item) => [
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
      <Sidebar role={role} />

      <main className="reports-main">
        <header className="reports-header">
          <div>
            <span className="reports-breadcrumb">
              Administración / Reportes
            </span>
            <h1>Reportes y estadísticas</h1>
            <p>Consulta el rendimiento y la actividad de tu clínica.</p>
          </div>

          <button className="reports-export-button" onClick={handleExport}>
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
            {loading ? "Sincronizando datos..." : "Datos en tiempo real"}
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
              <span>Ingresos cobrados</span>
              <strong>{formatCurrency(currentReport.stats.income)}</strong>
              <small>Facturas pagadas ({period})</small>
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
                <p>Distribución de motivos de consulta registrados.</p>
              </div>
            </div>

            <div className="reports-service-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentReport.services} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={110} />
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

            {currentReport.inventorySummary.map((item) => (
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