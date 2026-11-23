
import { useState } from "react";
import "./Login.css";

function Login() {
  const [userType, setUserType] = useState("client");

  const isClient = userType === "client";

  const handleSubmit = (event) => {
    event.preventDefault();

    // Más adelante conectaremos el formulario con Spring Boot.
    console.log("Tipo de acceso:", userType);
  };

  return (
    <main className="login-page">

      {/* Panel izquierdo */}
      <section className="login-welcome">

        <div className="welcome-content">
          <span className="welcome-label">VETCARE</span>

          <h1>
            Cuidamos de los
            <br />
            que más quieres.
          </h1>

          <p>
            Una forma sencilla de gestionar el cuidado
            y bienestar de tus mascotas.
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
              {isClient
                ? "Todo para tu mascota."
                : "Bienvenido al equipo."}
            </h2>

            <p>
              {isClient
                ? "Consulta la información de tus mascotas y administra sus citas desde un solo lugar."
                : "Gestiona pacientes, consultas y expedientes médicos de forma sencilla."}
            </p>
          </div>

          {/* Espacio reservado para imagen */}
          <div className="welcome-image">
            <span>Espacio para imagen</span>
          </div>
        </div>

      </section>

      {/* Panel derecho */}
      <section className="login-form-section">

        <div className="login-form-container">

          <div className="login-heading">
            <span>VETCARE</span>

            <h2>¡Hola de nuevo!</h2>

            <p>
              Ingresa tus datos para acceder a tu cuenta.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="email">
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>

            <div className="forgot-password">
              <a href="/forgot-password">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button type="submit" className="login-button">
              Iniciar sesión
            </button>

          </form>

          <div className="login-footer">
            <p>
              VetCare · Cuidando de quienes más quieres.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}

export default Login;
