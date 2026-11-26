import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Package,
  Boxes,
  AlertTriangle,
  XCircle,
  Eye,
  Filter,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Modal from "../../components/common/Modal";
import { inventoryService } from "../../services/api/inventoryService";
import { authService } from "../../services/api/authService";
import "./Inventory.css";

const emptyForm = {
  name: "",
  category: "pieza",
  description: "",
  quantity: "",
  minimumStock: "5",
  price: "",
  expirationDate: "",
};

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
  const currentUser = authService.getCurrentUser();
  const role = currentUser?.role || "VETERINARIAN";
  const canCreate = role === "ADMIN" || role === "VETERINARIAN";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar inventario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const totalProducts = products.length;

  const totalUnits = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const lowStock = products.filter(
    (product) =>
      product.quantity > 0 && product.quantity <= product.minimumStock
  ).length;

  const outOfStock = products.filter(
    (product) => product.quantity === 0
  ).length;

  const uniqueUnits = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(searchText) ||
        product.code.toLowerCase().includes(searchText) ||
        (product.description || "").toLowerCase().includes(searchText);

      const matchesCategory =
        categoryFilter === "Todas" || product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "Todos" || getStockStatus(product) === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const openCreateModal = () => {
    setModalMode("create");
    setFormData(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openViewModal = (product) => {
    setModalMode("view");
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || "",
      quantity: String(product.quantity),
      minimumStock: String(product.minimumStock),
      price: String(product.price),
      expirationDate: product.expirationDate || "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (
      !formData.name.trim() ||
      formData.quantity === "" ||
      formData.minimumStock === "" ||
      formData.price === ""
    ) {
      setFormError("Completa todos los campos obligatorios.");
      return;
    }

    const quantity = Number(formData.quantity);
    const minimumStock = Number(formData.minimumStock);
    const price = Number(formData.price);

    if (
      !Number.isInteger(quantity) ||
      quantity < 0 ||
      !Number.isInteger(minimumStock) ||
      minimumStock < 0 ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setFormError(
        "Las existencias y el stock mínimo deben ser enteros >= 0 y el precio >= 0."
      );
      return;
    }

    try {
      setSaving(true);
      await inventoryService.create(formData);
      await loadInventory();
      closeModal();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          "Error al registrar producto en inventario."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="inventory-layout">
      <Sidebar role={role} />

      <main className="inventory-main">
        <header className="inventory-header">
          <div>
            <span className="inventory-breadcrumb">
              Administración / Inventario
            </span>
            <h1>Inventario</h1>
            <p>Controla los productos y existencias de tu clínica.</p>
          </div>

          {canCreate && (
            <button
              className="inventory-primary-button"
              onClick={openCreateModal}
            >
              <Plus size={18} />
              Nuevo producto
            </button>
          )}
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
              <p>
                {loading
                  ? "Cargando inventario..."
                  : "Consulta las existencias de los productos."}
              </p>
            </div>
          </div>

          <div className="inventory-filters">
            <div className="inventory-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar producto, código o descripción..."
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
                <option value="Todas">Todas las unidades</option>
                {uniqueUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
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
                  <th>Unidad</th>
                  <th>Código</th>
                  <th>Existencias</th>
                  <th>Stock mínimo</th>
                  <th>Precio unitario</th>
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

                      <td>
                        $
                        {product.price.toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

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
                          <button
                            title="Ver producto"
                            onClick={() => openViewModal(product)}
                          >
                            <Eye size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {!loading && filteredProducts.length === 0 && (
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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalMode === "create"
            ? "Nuevo producto"
            : "Detalles del producto"
        }
        description={
          modalMode === "view"
            ? "Consulta la información del producto seleccionado."
            : "Completa la información del producto para el inventario."
        }
        size="large"
        footer={
          <>
            <button
              type="button"
              className="inventory-secondary-button"
              onClick={closeModal}
            >
              {modalMode === "view" ? "Cerrar" : "Cancelar"}
            </button>

            {modalMode !== "view" && (
              <button
                type="submit"
                form="product-form"
                className="inventory-primary-button"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar producto"}
              </button>
            )}
          </>
        }
      >
        <form id="product-form" onSubmit={handleSubmit}>
          <div className="inventory-form-grid">
            <div className="inventory-form-field">
              <label>Nombre del producto *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej. Vacuna antirrábica"
                disabled={modalMode === "view"}
              />
            </div>

            <div className="inventory-form-field">
              <label>Unidad de medida *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Ej. pieza, caja, frasco, ml"
                disabled={modalMode === "view"}
              />
            </div>

            <div className="inventory-form-field">
              <label>Precio unitario (MXN) *</label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Ej. 180.00"
                disabled={modalMode === "view"}
              />
            </div>

            <div className="inventory-form-field">
              <label>Existencias *</label>
              <input
                type="number"
                name="quantity"
                min="0"
                step="1"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Ej. 20"
                disabled={modalMode === "view"}
              />
            </div>

            <div className="inventory-form-field">
              <label>Stock mínimo *</label>
              <input
                type="number"
                name="minimumStock"
                min="0"
                step="1"
                value={formData.minimumStock}
                onChange={handleInputChange}
                placeholder="Ej. 5"
                disabled={modalMode === "view"}
              />
            </div>

            <div className="inventory-form-field">
              <label>Fecha de caducidad (opcional)</label>
              <input
                type="date"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleInputChange}
                disabled={modalMode === "view"}
              />
            </div>

            <div className="inventory-form-field inventory-form-full">
              <label>Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descripción o presentación del producto..."
                disabled={modalMode === "view"}
              />
            </div>
          </div>

          {formError && <p className="inventory-form-error">{formError}</p>}
        </form>
      </Modal>
    </div>
  );
}

export default Inventory;