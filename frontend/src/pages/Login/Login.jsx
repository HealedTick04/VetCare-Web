

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/api/authService";
import "./Login.css";

function Login() {
  const [userType, setUserType] = useState("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryError, setRecoveryError] = useState("");
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const navigate = useNavigate();
  const isClient = userType === "client";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      const role = response.user?.role;

      if (isClient && role !== "CLIENT") {
        setError(
          "Esta cuenta pertenece al personal. Cambia a 'Personal veterinario'."
        );
        await authService.logout();
        return;
      }

      if (!isClient && role === "CLIENT") {
        setError("Esta cuenta es de cliente. Cambia a 'Cliente'.");
        await authService.logout();
        return;
      }

      if (role === "CLIENT") {
        navigate("/client/medical-records");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Correo o contraseña incorrectos. Verifica tus datos."
      );
    } finally {
      setLoading(false);
    }
  };

  const openRecovery = () => {
    setRecoveryEmail(email);
    setRecoveryError("");
    setRecoverySuccess(false);
    setShowRecovery(true);
  };

  const closeRecovery = () => {
    if (recoveryLoading) return;

    setShowRecovery(false);
    setRecoveryError("");
    setRecoverySuccess(false);
  };

  const handleRecoverySubmit = async (event) => {
    event.preventDefault();
    setRecoveryError("");

    const normalizedEmail = recoveryEmail.trim();

    if (!normalizedEmail) {
      setRecoveryError("Ingresa tu correo electrónico.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      setRecoveryError("Ingresa un correo electrónico válido.");
      return;
    }

    setRecoveryLoading(true);

    try {
      // Pendiente: conectar con el servicio de recuperación del backend.
      // Ejemplo futuro: await authService.forgotPassword(normalizedEmail);

      setRecoverySuccess(true);
    } catch (err) {
      setRecoveryError(
        err.response?.data?.message ||
          "No fue posible procesar la solicitud. Inténtalo nuevamente."
      );
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-welcome">
        <div className="welcome-content">
          <span className="welcome-label">VETCARE</span>

          <h1>
            Cuidamos de los
            <br />
            que más quieres.
          </h1>

          <p>
            Una forma sencilla de gestionar el cuidado y bienestar de tus mascotas.
          </p>

          <div className="user-selector">
            <button
              type="button"
              className={isClient ? "active" : ""}
              onClick={() => setUserType("client")}
            >
              Cliente
            </button>

            <button
              type="button"
              className={!isClient ? "active" : ""}
              onClick={() => setUserType("staff")}
            >
              Personal veterinario
            </button>
          </div>

          <div className="welcome-description">
            <h2>
              {isClient ? "Todo para tu mascota." : "Bienvenido al equipo."}
            </h2>

            <p>
              {isClient
                ? "Consulta la información de tus mascotas y administra sus citas desde un solo lugar."
                : "Gestiona pacientes, consultas y expedientes médicos de forma sencilla."}
            </p>
          </div>

          <div className="welcome-image">
            <span>Espacio para imagen</span>
          </div>
        </div>
      </section>

      <section className="login-form-section">
        <div className="login-form-container">
          <div className="login-heading">
            <span>VETCARE</span>
            <h2>¡Hola de nuevo!</h2>
            <p>Ingresa tus datos para acceder a tu cuenta.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p
                style={{
                  color: "#dc2626",
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                }}
              >
                {error}
              </p>
            )}

            <div className="forgot-password">
              <button
                type="button"
                onClick={openRecovery}
                className="recovery-link"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="login-footer">
            <p>VetCare · Cuidando de quienes más quieres.</p>
          </div>
        </div>
      </section>

      {showRecovery && (
        <div
          className="recovery-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeRecovery();
          }}
        >
          <section
            className="recovery-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="recovery-title"
          >
            <button
              type="button"
              className="recovery-close"
              onClick={closeRecovery}
              disabled={recoveryLoading}
              aria-label="Cerrar"
            >
              ×
            </button>

            {!recoverySuccess ? (
              <>
                <div className="recovery-icon">
                  <span>✉</span>
                </div>

                <h2 id="recovery-title">¿Olvidaste tu contraseña?</h2>

                <p className="recovery-description">
                  No te preocupes. Introduce el correo electrónico asociado a
                  tu cuenta y te enviaremos instrucciones para recuperarla.
                </p>

                <form onSubmit={handleRecoverySubmit}>
                  <div className="form-group">
                    <label htmlFor="recovery-email">
                      Correo electrónico
                    </label>

                    <input
                      id="recovery-email"
                      type="email"
                      placeholder="ejemplo@correo.com"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  {recoveryError && (
                    <p className="recovery-error">{recoveryError}</p>
                  )}

                  <button
                    type="submit"
                    className="login-button recovery-submit"
                    disabled={recoveryLoading}
                  >
                    {recoveryLoading
                      ? "Procesando..."
                      : "Enviar instrucciones"}
                  </button>
                </form>

                <button
                  type="button"
                  className="recovery-back"
                  onClick={closeRecovery}
                  disabled={recoveryLoading}
                >
                  Volver al inicio de sesión
                </button>
              </>
            ) : (
              <div className="recovery-success">
                <div className="recovery-success-icon">✓</div>

                <h2 id="recovery-title">Solicitud recibida</h2>

                <p>
                  La solicitud se ha procesado correctamente. Cuando conectemos
                  el servicio de correo, recibirás las instrucciones para
                  recuperar tu contraseña.
                </p>

                <button
                  type="button"
                  className="login-button recovery-submit"
                  onClick={closeRecovery}
                >
                  Volver al inicio de sesión
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

export default Login;
