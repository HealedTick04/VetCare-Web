
import { useEffect } from "react";
import { X } from "lucide-react";
import "./Modal.css";

function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "medium",
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    // Evita que la página del fondo se desplace.
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={handleBackdropClick}
    >
      <div
        className={`modal-container modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div>
            <h2 id="modal-title">{title}</h2>

            {description && (
              <p>{description}</p>
            )}
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Cerrar ventana"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
