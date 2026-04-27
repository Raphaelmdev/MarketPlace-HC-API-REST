import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { MdLock } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { resetPassword } from "@/services/authService";
import { validatePassword, validateConfirmPassword } from "@/utils/validations";
import "@/styles/pages/Login.css";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setGeneralError("Token inválido ou ausente.");
    }
  }, [token]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: ""
    }));

    setGeneralError("");
    setSuccessMessage("");
  }

  function validateForm() {
    const errors = {};

    const passwordError = validatePassword(form.newPassword);
    if (passwordError) errors.newPassword = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      form.newPassword,
      form.confirmPassword
    );
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      setGeneralError("Token inválido ou ausente.");
      return;
    }

    const errors = validateForm();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      await resetPassword({
        token,
        newPassword: form.newPassword
      });

      setSuccessMessage("Senha redefinida com sucesso!");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      setGeneralError(err.message || "Erro ao redefinir senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box login-box">
        <h2>Redefinir Senha</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <div className={`input-wrapper ${fieldErrors.newPassword ? "input-error" : ""}`}>
              <span className="input-icon">
                <MdLock />
              </span>

              <div className="floating-field">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label htmlFor="new-password">Nova senha</label>
              </div>

              <button
                type="button"
                className="icon-button"
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {fieldErrors.newPassword && (
              <p className="field-error">{fieldErrors.newPassword}</p>
            )}
          </div>

          <div className="auth-field">
            <div className={`input-wrapper ${fieldErrors.confirmPassword ? "input-error" : ""}`}>
              <span className="input-icon">
                <MdLock />
              </span>

              <div className="floating-field">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label htmlFor="confirm-password">Confirmar senha</label>
              </div>

              <button
                type="button"
                className="icon-button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {fieldErrors.confirmPassword && (
              <p className="field-error">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          {generalError && <p className="auth-error">{generalError}</p>}
          {successMessage && <p className="auth-success">{successMessage}</p>}

          <button type="submit" disabled={loading || !token} className="auth-submit">
            {loading ? "Salvando..." : "Redefinir senha"}
          </button>

          <p className="auth-link-text">
            Lembrou a senha? <Link to="/login">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}