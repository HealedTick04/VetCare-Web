
import { useState } from "react";
import {
  CalendarDays,
  Users,
  PawPrint,
  DollarSign,
  Download,
  TrendingUp,
  ClipboardList,
  Package,
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

const appointmentData = [
  { month: "Jun", citas: 85 },
  { month: "Jul", citas: 110 },
  { month: "Ago", citas: 95 },
  { month: "Sep", citas: 130 },
  { month: "Oct", citas: 145 },
  { month: "Nov", citas: 120 },
];

const appointmentStatusData = [
  { name: "Completadas", value: 65 },
  { name: "Pendientes", value: 20 },
  { name: "Canceladas", value: 15 },
];

const serviceData = [
  { name: "Consulta", cantidad: 85 },
  { name: "Vacunación", cantidad: 65 },
  { name: "Estética", cantidad: 48 },
  { name: "Cirugía", cantidad: 25 },
  { name: "Curaciones", cantidad: 38 },
];

const COLORS = ["#3976a1", "#e5a84b", "#d96b6b"];

function Reports() {
  const [period, setPeriod] = useState("6 meses");

  const handleExport = () => {
    alert("La exportación de reportes estará disponible al conectar los datos reales.");
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
              onChange={(event) => setPeriod(event.target.value)}
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

        <section className="reports-stats">
          <article className="reports-stat-card">
            <div className="reports-stat-icon blue">
              <CalendarDays size={22} />
            </div>
            <div>
              <span>Total de citas</span>
              <strong>685</strong>
              <small>Periodo de demostración</small>
            </div>
          </article>

          <article className="reports-stat-card">
            <div className="reports-stat-icon green">
              <Users size={22} />
            </div>
            <div>
              <span>Clientes registrados</span>
              <strong>248</strong>
              <small>En la clínica</small>
            </div>
          </article>

          <article className="reports-stat-card">
            <div className="reports-stat-icon purple">
              <PawPrint size={22} />
            </div>
            <div>
              <span>Mascotas registradas</span>
              <strong>326</strong>
              <small>En la clínica</small>
            </div>
          </article>

          <article className="reports-stat-card">
            <div className="reports-stat-icon orange">
              <DollarSign size={22} />
            </div>
            <div>
              <span>Ingresos estimados</span>
              <strong>$85,450</strong>
              <small>MXN · Dato ficticio</small>
            </div>
          </article>
        </section>

        <section className="reports-chart-grid">
          <article className="reports-panel reports-main-chart">
            <div className="reports-panel-header">
              <div>
                <h2>Actividad de citas</h2>
                <p>Cantidad de citas registradas por mes.</p>
              </div>
              <CalendarDays size={20} />
            </div>

            <div className="reports-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="citas"
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
                    data={appointmentStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {appointmentStatusData.map((entry, index) => (
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
                <BarChart data={serviceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={85}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="cantidad"
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

            <div className="reports-inventory-item">
              <div>
                <span>Productos disponibles</span>
                <strong>42</strong>
              </div>
              <span className="reports-inventory-badge available">
                Normal
              </span>
            </div>

            <div className="reports-inventory-item">
              <div>
                <span>Productos con stock bajo</span>
                <strong>8</strong>
              </div>
              <span className="reports-inventory-badge low">
                Atención
              </span>
            </div>

            <div className="reports-inventory-item">
              <div>
                <span>Productos agotados</span>
                <strong>3</strong>
              </div>
              <span className="reports-inventory-badge empty">
                Agotado
              </span>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default Reports;
