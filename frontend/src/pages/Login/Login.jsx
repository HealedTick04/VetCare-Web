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
        setError("Esta cuenta pertenece al personal. Cambia a 'Personal veterinario'.");
        await authService.logout();
        setLoading(false);
        return;
      }

      if (!isClient && role === "CLIENT") {
        setError("Esta cuenta es de cliente. Cambia a 'Cliente'.");
        await authService.logout();
        setLoading(false);
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Correo o contraseña incorrectos. Verifica tus datos."
      );
    } finally {
      setLoading(false);
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
            <h2>{isClient ? "Todo para tu mascota." : "Bienvenido al equipo."}</h2>
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
              <p style={{ color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>
                {error}
              </p>
            )}

            <div className="forgot-password">
              <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
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
    </main>
  );
}

export default Login;