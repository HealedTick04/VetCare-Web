import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { authService } from "../../services/api/authService";
import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [tokenStatus, setTokenStatus] = useState(
    token ? "validating" : "invalid"
  );
  const [tokenErrorMessage, setTokenErrorMessage] = useState(
    "No encontramos un código de recuperación en el enlace. Solicita nuevamente la recuperación de tu contraseña desde el inicio de sesión."
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenStatus("invalid");
      return;
    }

    let isMounted = true;

    const verifyToken = async () => {
      try {
        setTokenStatus("validating");
        await authService.validateResetToken(token);
        if (isMounted) {
          setTokenStatus("valid");
        }
      } catch (err) {
        if (isMounted) {
          setTokenStatus("invalid");
          setTokenErrorMessage(
            err.response?.data?.message ||
              "El enlace de recuperación no es válido o ha expirado. Solicita uno nuevo."
          );
        }
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const requirements = [
    {
      label: "Al menos 8 caracteres",
      valid: password.length >= 8,
    },
    {
      label: "Al menos una letra mayúscula",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "Al menos una letra minúscula",
      valid: /[a-z]/.test(password),
    },
    {
      label: "Al menos un número",
      valid: /\d/.test(password),
    },
  ];

  const isPasswordValid = requirements.every((item) => item.valid);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!token || tokenStatus !== "valid") {
      setError("El enlace de recuperación no es válido.");
      return;
    }

    if (!isPasswordValid) {
      setError("La contraseña no cumple con todos los requisitos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token, password, confirmPassword);

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No fue posible cambiar la contraseña. Inténtalo nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  if (tokenStatus === "validating") {
    return (
      <main className="reset-page">
        <section className="reset-card reset-message-card">
          <div className="reset-icon">
            <LockKeyhole size={30} />
          </div>
          <span className="reset-brand">VETCARE</span>
          <h1>Verificando enlace...</h1>
          <p>Estamos comprobando la validez de tu solicitud de recuperación.</p>
        </section>
      </main>
    );
  }

  if (tokenStatus === "invalid") {
    return (
      <main className="reset-page">
        <section className="reset-card reset-message-card">
          <div className="reset-message-icon error">
            <AlertCircle size={30} />
          </div>

          <h1>Enlace no válido</h1>

          <p>{tokenErrorMessage}</p>

          <button
            type="button"
            className="reset-primary-button"
            onClick={() => navigate("/")}
          >
            Volver al inicio de sesión
          </button>
        </section>
      </main>
    );
  }

  if (success) {
    return (
      <main className="reset-page">
        <section className="reset-card reset-message-card">
          <div className="reset-message-icon success">
            <CheckCircle2 size={30} />
          </div>

          <span className="reset-brand">VETCARE</span>

          <h1>¡Contraseña actualizada!</h1>

          <p>
            Tu nueva contraseña ha sido procesada. Ya puedes volver al inicio
            de sesión para acceder a tu cuenta.
          </p>

          <button
            type="button"
            className="reset-primary-button"
            onClick={() => navigate("/")}
          >
            Ir al inicio de sesión
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="reset-page">
      <section className="reset-card">
        <button
          type="button"
          className="reset-back-button"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          Volver al inicio
        </button>

        <div className="reset-header">
          <div className="reset-icon">
            <LockKeyhole size={30} />
          </div>

          <span className="reset-brand">VETCARE</span>

          <h1>Crear nueva contraseña</h1>

          <p>
            Crea una contraseña segura para recuperar el acceso a tu cuenta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="reset-form">
          <div className="reset-field">
            <label htmlFor="new-password">Nueva contraseña</label>

            <div className="reset-input-wrapper">
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu nueva contraseña"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="reset-eye-button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div className="reset-requirements">
            <p>Tu contraseña debe contener:</p>

            {requirements.map((item) => (
              <div
                key={item.label}
                className={`reset-requirement ${item.valid ? "valid" : ""}`}
              >
                <CheckCircle2 size={15} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="reset-field">
            <label htmlFor="confirm-password">
              Confirmar nueva contraseña
            </label>

            <div className="reset-input-wrapper">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirma tu nueva contraseña"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="reset-eye-button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>

            {confirmPassword && password !== confirmPassword && (
              <span className="reset-field-error">
                Las contraseñas no coinciden.
              </span>
            )}
          </div>

          {error && (
            <div className="reset-error-message">
              <AlertCircle size={17} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="reset-primary-button"
            disabled={loading}
          >
            {loading ? "Actualizando contraseña..." : "Guardar nueva contraseña"}
          </button>
        </form>

        <div className="reset-security-note">
          <ShieldCheck size={17} />
          <span>Tu seguridad es importante para nosotros.</span>
        </div>
      </section>

      <footer className="reset-footer">
        VetCare · Cuidando de quienes más quieres.
      </footer>
    </main>
  );
}

export default ResetPassword;