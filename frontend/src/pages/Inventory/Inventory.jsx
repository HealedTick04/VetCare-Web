
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Package,
  Boxes,
  AlertTriangle,
  XCircle,
  Eye,
  Pencil,
  Filter,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import "./Inventory.css";

const demoProducts = [
  {
    id: 1,
    name: "Vacuna antirrábica",
    category: "Medicamentos",
    code: "MED-001",
    quantity: 24,
    minimumStock: 10,
    price: 180,
  },
  {
    id: 2,
    name: "Antiparasitario canino",
    category: "Medicamentos",
    code: "MED-002",
    quantity: 6,
    minimumStock: 10,
    price: 95,
  },
  {
    id: 3,
    name: "Gasas estériles",
    category: "Material médico",
    code: "MAT-001",
    quantity: 120,
    minimumStock: 30,
    price: 5,
  },
  {
    id: 4,
    name: "Guantes desechables",
    category: "Material médico",
    code: "MAT-002",
    quantity: 0,
    minimumStock: 20,
    price: 2.5,
  },
  {
    id: 5,
    name: "Shampoo veterinario",
    category: "Higiene",
    code: "HIG-001",
    quantity: 18,
    minimumStock: 8,
    price: 110,
  },
  {
    id: 6,
    name: "Solución antiséptica",
    category: "Material médico",
    code: "MAT-003",
    quantity: 4,
    minimumStock: 10,
    price: 65,
  },
  {
    id: 7,
    name: "Alimento para perro",
    category: "Alimentos",
    code: "ALI-001",
    quantity: 35,
    minimumStock: 10,
    price: 320,
  },
];

function getStockStatus(product) {
  if (product.quantity === 0) {
    return "Agotado";
  }

  if (product.quantity <= product.minimumStock) {
    return "Stock bajo";
  }

  return "Disponible";
}

function Inventory() {
  const [products] = useState(demoProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const totalProducts = products.length;
  const totalUnits = products.reduce(
    (total, product) => total + product.quantity,
    0
  );
  const lowStock = products.filter(
    (product) =>
      product.quantity > 0 &&
      product.quantity <= product.minimumStock
  ).length;
  const outOfStock = products.filter(
    (product) => product.quantity === 0
  ).length;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.code.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "Todas" ||
        product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "Todos" ||
        getStockStatus(product) === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  return (
    <div className="inventory-layout">
      <Sidebar role="VETERINARIAN" />

      <main className="inventory-main">
        <header className="inventory-header">
          <div>
            <span className="inventory-breadcrumb">
              Administración / Inventario
            </span>
            <h1>Inventario</h1>
            <p>Controla los productos y existencias de tu clínica.</p>
          </div>

          <button className="inventory-primary-button">
            <Plus size={18} />
            Nuevo producto
          </button>
        </header>

        <section className="inventory-stats">
          <div className="inventory-stat-card">
            <div className="inventory-stat-icon blue">
              <Package size={22} />
            </div>
            <div>
              <span>Productos registrados</span>
              <strong>{totalProducts}</strong>
            </div>
          </div>

          <div className="inventory-stat-card">
            <div className="inventory-stat-icon green">
              <Boxes size={22} />
            </div>
            <div>
              <span>Unidades disponibles</span>
              <strong>{totalUnits}</strong>
            </div>
          </div>

          <div className="inventory-stat-card">
            <div className="inventory-stat-icon orange">
              <AlertTriangle size={22} />
            </div>
            <div>
              <span>Stock bajo</span>
              <strong>{lowStock}</strong>
            </div>
          </div>

          <div className="inventory-stat-card">
            <div className="inventory-stat-icon red">
              <XCircle size={22} />
            </div>
            <div>
              <span>Productos agotados</span>
              <strong>{outOfStock}</strong>
            </div>
          </div>
        </section>

        <section className="inventory-content">
          <div className="inventory-content-header">
            <div>
              <h2>Productos registrados</h2>
              <p>Consulta las existencias de los productos.</p>
            </div>
          </div>

          <div className="inventory-filters">
            <div className="inventory-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar producto o código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="inventory-select">
              <Filter size={17} />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="Todas">Todas las categorías</option>
                <option value="Medicamentos">Medicamentos</option>
                <option value="Material médico">Material médico</option>
                <option value="Higiene">Higiene</option>
                <option value="Alimentos">Alimentos</option>
              </select>
            </div>

            <select
              className="inventory-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Disponible">Disponible</option>
              <option value="Stock bajo">Stock bajo</option>
              <option value="Agotado">Agotado</option>
            </select>
          </div>

          <div className="inventory-table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Código</th>
                  <th>Existencias</th>
                  <th>Stock mínimo</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product);

                  return (
                    <tr key={product.id}>
                      <td>
                        <strong>{product.name}</strong>
                      </td>
                      <td>{product.category}</td>
                      <td className="inventory-code">{product.code}</td>
                      <td>
                        <strong>{product.quantity}</strong>
                      </td>
                      <td>{product.minimumStock}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>
                        <span
                          className={`inventory-status ${
                            status === "Disponible"
                              ? "available"
                              : status === "Stock bajo"
                                ? "low"
                                : "empty"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td>
                        <div className="inventory-actions">
                          <button title="Ver producto">
                            <Eye size={17} />
                          </button>
                          <button title="Editar producto">
                            <Pencil size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="8" className="inventory-empty">
                      No se encontraron productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="inventory-table-footer">
            Mostrando {filteredProducts.length} de {totalProducts} productos
          </div>
        </section>
      </main>
    </div>
  );
}

export default Inventory;
