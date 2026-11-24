
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
  Trash2,
  ArrowDownUp,
} from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
import Modal from "../../components/common/Modal";
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

const emptyForm = {
  name: "",
  category: "Medicamentos",
  code: "",
  quantity: "",
  minimumStock: "",
  price: "",
};

const emptyStockForm = {
  operation: "Entrada",
  quantity: "",
  reason: "",
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
  const [products, setProducts] = useState(demoProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [stockForm, setStockForm] = useState(emptyStockForm);
  const [formError, setFormError] = useState("");

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
      const searchText = search.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(searchText) ||
        product.code.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText);

      const matchesCategory =
        categoryFilter === "Todas" ||
        product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "Todos" ||
        getStockStatus(product) === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedProduct(null);
    setFormData(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openViewModal = (product) => {
    setModalMode("view");
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      code: product.code,
      quantity: String(product.quantity),
      minimumStock: String(product.minimumStock),
      price: String(product.price),
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode("edit");
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      code: product.code,
      quantity: String(product.quantity),
      minimumStock: String(product.minimumStock),
      price: String(product.price),
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openStockModal = (product) => {
    setModalMode("stock");
    setSelectedProduct(product);
    setStockForm(emptyStockForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setFormError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleStockInputChange = (e) => {
    const { name, value } = e.target;

    setStockForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.category ||
      !formData.code.trim() ||
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
      price <= 0
    ) {
      setFormError(
        "Las existencias y el stock mínimo deben ser números enteros iguales o mayores que cero. El precio debe ser mayor que cero."
      );
      return;
    }

    const normalizedCode = formData.code.trim().toUpperCase();

    const duplicateCode = products.some(
      (product) =>
        product.code.toUpperCase() === normalizedCode &&
        product.id !== selectedProduct?.id
    );

    if (duplicateCode) {
      setFormError("Ya existe un producto registrado con ese código.");
      return;
    }

    const productData = {
      name: formData.name.trim(),
      category: formData.category,
      code: normalizedCode,
      quantity,
      minimumStock,
      price,
    };

    if (modalMode === "create") {
      setProducts((previous) => [
        {
          id: Date.now(),
          ...productData,
        },
        ...previous,
      ]);
    }

    if (modalMode === "edit" && selectedProduct) {
      setProducts((previous) =>
        previous.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, ...productData }
            : product
        )
      );
    }

    closeModal();
  };

  const handleStockSubmit = (e) => {
    e.preventDefault();

    const amount = Number(stockForm.quantity);

    if (
      !Number.isInteger(amount) ||
      amount <= 0
    ) {
      setFormError("Ingresa una cantidad entera mayor que cero.");
      return;
    }

    if (!selectedProduct) return;

    if (
      stockForm.operation === "Salida" &&
      amount > selectedProduct.quantity
    ) {
      setFormError(
        `No hay suficientes existencias. Disponibles: ${selectedProduct.quantity}.`
      );
      return;
    }

    setProducts((previous) =>
      previous.map((product) => {
        if (product.id !== selectedProduct.id) {
          return product;
        }

        const newQuantity =
          stockForm.operation === "Entrada"
            ? product.quantity + amount
            : product.quantity - amount;

        return {
          ...product,
          quantity: newQuantity,
        };
      })
    );

    closeModal();
  };

  const handleDelete = (product) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar "${product.name}" del inventario?`
    );

    if (!confirmed) return;

    setProducts((previous) =>
      previous.filter((item) => item.id !== product.id)
    );
  };

  const modalTitle =
    modalMode === "create"
      ? "Nuevo producto"
      : modalMode === "edit"
        ? "Editar producto"
        : modalMode === "stock"
          ? "Ajustar existencias"
          : "Detalles del producto";

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

          <button
            className="inventory-primary-button"
            onClick={openCreateModal}
          >
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

                      <td className="inventory-code">
                        {product.code}
                      </td>

                      <td>
                        <strong>{product.quantity}</strong>
                      </td>

                      <td>{product.minimumStock}</td>

                      <td>
                        ${product.price.toLocaleString("es-MX", {
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

                          <button
                            title="Editar producto"
                            onClick={() => openEditModal(product)}
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            title="Ajustar existencias"
                            className="inventory-stock-btn"
                            onClick={() => openStockModal(product)}
                          >
                            <ArrowDownUp size={17} />
                          </button>

                          <button
                            title="Eliminar producto"
                            className="inventory-delete-btn"
                            onClick={() => handleDelete(product)}
                          >
                            <Trash2 size={17} />
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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        description={
          modalMode === "view"
            ? "Consulta la información del producto seleccionado."
            : modalMode === "stock"
              ? "Registra una entrada o salida de existencias."
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
                form={
                  modalMode === "stock"
                    ? "stock-form"
                    : "product-form"
                }
                className="inventory-primary-button"
              >
                {modalMode === "create"
                  ? "Guardar producto"
                  : modalMode === "edit"
                    ? "Guardar cambios"
                    : "Aplicar ajuste"}
              </button>
            )}
          </>
        }
      >
        {modalMode === "stock" ? (
          <form id="stock-form" onSubmit={handleStockSubmit}>
            <div className="inventory-stock-summary">
              <span>Producto seleccionado</span>
              <strong>{selectedProduct?.name}</strong>
              <span>
                Existencias actuales: {selectedProduct?.quantity}
              </span>
            </div>

            <div className="inventory-form-grid">
              <div className="inventory-form-field">
                <label>Tipo de movimiento *</label>
                <select
                  name="operation"
                  value={stockForm.operation}
                  onChange={handleStockInputChange}
                >
                  <option value="Entrada">Entrada de productos</option>
                  <option value="Salida">Salida de productos</option>
                </select>
              </div>

              <div className="inventory-form-field">
                <label>Cantidad *</label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  step="1"
                  value={stockForm.quantity}
                  onChange={handleStockInputChange}
                  placeholder="Cantidad de unidades"
                />
              </div>

              <div className="inventory-form-field inventory-form-full">
                <label>Motivo del movimiento</label>
                <textarea
                  name="reason"
                  value={stockForm.reason}
                  onChange={handleStockInputChange}
                  placeholder="Describe brevemente el motivo..."
                />
              </div>
            </div>

            {formError && (
              <p className="inventory-form-error">{formError}</p>
            )}
          </form>
        ) : (
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
                <label>Código del producto *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Ej. MED-001"
                  disabled={modalMode === "view"}
                />
              </div>

              <div className="inventory-form-field">
                <label>Categoría *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  disabled={modalMode === "view"}
                >
                  <option value="Medicamentos">Medicamentos</option>
                  <option value="Material médico">Material médico</option>
                  <option value="Higiene">Higiene</option>
                  <option value="Alimentos">Alimentos</option>
                </select>
              </div>

              <div className="inventory-form-field">
                <label>Precio unitario (MXN) *</label>
                <input
                  type="number"
                  name="price"
                  min="0.01"
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
                  disabled={modalMode === "view"}
                />
              </div>
            </div>

            {formError && (
              <p className="inventory-form-error">{formError}</p>
            )}
          </form>
        )}
      </Modal>
    </div>
  );
}

export default Inventory;

