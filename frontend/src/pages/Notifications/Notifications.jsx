import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Package,
  ClipboardList,
  Check,
  CheckCheck,
  Trash2,
  Search,
  Filter,
  Clock,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import { notificationService } from "../../services/api/notificationService";
import { authService } from "../../services/api/authService";
import "./Notifications.css";

const notificationIcons = {
  Citas: CalendarDays,
  Inventario: Package,
  Expedientes: ClipboardList,
  Tratamientos: ClipboardList,
};

function Notifications() {
  const currentUser = authService.getCurrentUser();
  const role = currentUser?.role || "VETERINARIAN";

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todas");

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getAll(role);
        setNotifications(data);
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [role]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesSearch =
        notification.title.toLowerCase().includes(search.toLowerCase()) ||
        notification.message.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "Todas" ||
        (filter === "No leídas" && !notification.read) ||
        (filter === "Leídas" && notification.read);

      return matchesSearch && matchesFilter;
    });
  }, [notifications, search, filter]);

  const markAsRead = (id) => {
    notificationService.markAsRead(id);
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead(notifications.map((n) => n.id));
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (id) => {
    notificationService.deleteNotification(id);
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  };

  const formatDate = (date) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "Reciente";

    return new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsed);
  };

  return (
    <div className="notifications-layout">
      <Sidebar role={role} />

      <main className="notifications-main">
        <header className="notifications-header">
          <div>
            <span className="notifications-breadcrumb">
              Administración / Notificaciones
            </span>
            <h1>Notificaciones</h1>
            <p>Consulta los avisos y novedades de tu clínica.</p>
          </div>

          <button
            className="notifications-read-all"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck size={18} />
            Marcar todas como leídas
          </button>
        </header>

        <section className="notifications-stats">
          <div className="notifications-stat-card">
            <div className="notifications-stat-icon blue">
              <Bell size={22} />
            </div>
            <div>
              <span>Total de notificaciones</span>
              <strong>{notifications.length}</strong>
            </div>
          </div>

          <div className="notifications-stat-card">
            <div className="notifications-stat-icon orange">
              <Clock size={22} />
            </div>
            <div>
              <span>Pendientes de leer</span>
              <strong>{unreadCount}</strong>
            </div>
          </div>

          <div className="notifications-stat-card">
            <div className="notifications-stat-icon green">
              <Check size={22} />
            </div>
            <div>
              <span>Notificaciones leídas</span>
              <strong>{notifications.length - unreadCount}</strong>
            </div>
          </div>
        </section>

        <section className="notifications-content">
          <div className="notifications-content-header">
            <div>
              <h2>Centro de notificaciones</h2>
              <p>
                {loading
                  ? "Sincronizando avisos..."
                  : "Mantente al tanto de la actividad de VetCare."}
              </p>
            </div>
            <span className="notifications-counter">
              {unreadCount} sin leer
            </span>
          </div>

          <div className="notifications-filters">
            <div className="notifications-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar notificación..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="notifications-filter-select">
              <Filter size={17} />
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="Todas">Todas</option>
                <option value="No leídas">No leídas</option>
                <option value="Leídas">Leídas</option>
              </select>
            </div>
          </div>

          <div className="notifications-list">
            {filteredNotifications.map((notification) => {
              const Icon = notificationIcons[notification.type] || Bell;

              return (
                <article
                  key={notification.id}
                  className={`notification-item ${
                    notification.read ? "read" : "unread"
                  }`}
                >
                  <div
                    className={`notification-icon ${notification.type.toLowerCase()}`}
                  >
                    <Icon size={21} />
                  </div>

                  <div className="notification-information">
                    <div className="notification-title-row">
                      <h3>{notification.title}</h3>
                      {!notification.read && (
                        <span className="notification-new">Nueva</span>
                      )}
                    </div>

                    <p>{notification.message}</p>

                    <div className="notification-metadata">
                      <span>{notification.type}</span>
                      <span>•</span>
                      <span>{formatDate(notification.date)}</span>
                    </div>
                  </div>

                  <div className="notification-actions">
                    {!notification.read && (
                      <button
                        title="Marcar como leída"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check size={18} />
                      </button>
                    )}

                    <button
                      title="Eliminar notificación"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </article>
              );
            })}

            {!loading && filteredNotifications.length === 0 && (
              <div className="notifications-empty">
                <Bell size={35} />
                <h3>No hay notificaciones</h3>
                <p>No encontramos avisos que coincidan con tu búsqueda.</p>
              </div>
            )}
          </div>

          <div className="notifications-footer">
            Mostrando {filteredNotifications.length} de {notifications.length}{" "}
            notificaciones
          </div>
        </section>
      </main>
    </div>
  );
}

export default Notifications;