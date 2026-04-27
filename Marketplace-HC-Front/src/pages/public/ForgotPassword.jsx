import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { forgotPassword } from "@/services/authService";
import { validateEmail } from "@/utils/validations";
import "@/styles/pages/Login.css";

const COOLDOWN_SECONDS = 180;
const COOLDOWN_STORAGE_PREFIX = "resetPasswordCooldownExpiresAt_";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [message, setMessage] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [cooldownEmail, setCooldownEmail] = useState("");

  function getNormalizedEmail(value = email) {
    return value.trim().toLowerCase();
  }

  function getCooldownKey(targetEmail) {
    return `${COOLDOWN_STORAGE_PREFIX}${targetEmail}`;
  }

  useEffect(() => {
    if (cooldown <= 0 || !cooldownEmail) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(getCooldownKey(cooldownEmail));
          setCooldownEmail("");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown, cooldownEmail]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;

    return `${minutes}:${String(rest).padStart(2, "0")}`;
  }

  function validateEmailField() {
    return validateEmail(email);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setFieldError("");
    setMessage("");
    setGeneralError("");
    setResetLink("");

    const error = validateEmailField();

    if (error) {
      setFieldError(error);
      return;
    }

    const normalizedEmail = getNormalizedEmail();
    const key = getCooldownKey(normalizedEmail);
    const savedExpiresAt = localStorage.getItem(key);

    if (savedExpiresAt) {
      const remainingSeconds = Math.ceil(
        (Number(savedExpiresAt) - Date.now()) / 1000
      );

      if (remainingSeconds > 0) {
        setCooldownEmail(normalizedEmail);
        setCooldown(remainingSeconds);
        setMessage("Você já solicitou um link para este email.");
        return;
      }

      localStorage.removeItem(key);
    }

    setLoading(true);

    try {
      const response = await forgotPassword({ email: normalizedEmail });

      setMessage(
        response.message ||
          "Se houver uma conta vinculada a este email, o link será exibido abaixo."
      );

      setResetLink(response.link || "");

      const expiresAt = Date.now() + COOLDOWN_SECONDS * 1000;
      localStorage.setItem(key, String(expiresAt));

      setCooldownEmail(normalizedEmail);
      setCooldown(COOLDOWN_SECONDS);
    } catch (err) {
      setGeneralError(err.message || "Erro ao solicitar recuperação.");
    } finally {
      setLoading(false);
    }
  }

  const isCurrentEmailInCooldown =
    cooldown > 0 && cooldownEmail === getNormalizedEmail();

  return (
    <div className="auth-page">
      <div className="auth-box login-box">
        <h2>Recuperar Senha</h2>

        <p className="auth-description">
          Informe seu email para receber o link de redefinição de senha.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <div className={`input-wrapper ${fieldError ? "input-error" : ""}`}>
              <span className="input-icon">
                <MdEmail />
              </span>

              <div className="floating-field">
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldError("");
                    setMessage("");
                    setGeneralError("");
                    setResetLink("");
                  }}
                  placeholder=" "
                />
                <label htmlFor="forgot-email">Email</label>
              </div>
            </div>

            {fieldError && <p className="field-error">{fieldError}</p>}
          </div>

          {generalError && <p className="auth-error">{generalError}</p>}
          {message && <p className="auth-success">{message}</p>}

          {resetLink && (
            <>
              <p className="reset-expiration">
                Este link é válido por 3 minutos.
              </p>

              <a href={resetLink} className="reset-link-button">
                Redefinir minha senha
              </a>
            </>
          )}

          {isCurrentEmailInCooldown ? (
            <p className="cooldown-message">
              Você poderá solicitar um novo link para este email em{" "}
              {formatTime(cooldown)}.
            </p>
          ) : (
            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? "Gerando link..." : "Enviar instruções"}
            </button>
          )}

          <p className="auth-link-text">
            Lembrou a senha? <Link to="/login">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}