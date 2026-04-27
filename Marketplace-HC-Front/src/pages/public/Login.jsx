import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { MdEmail, MdLock } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "@/services/authService";
import { useToast } from "@/context/ToastContext";
import { validateLoginForm } from "@/utils/validations";
import "@/styles/pages/Login.css";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useToast();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const emailFromIdentify = location.state?.email;
    const savedEmail = localStorage.getItem("rememberedEmail");

    if (emailFromIdentify) {
      setForm((prev) => ({
        ...prev,
        email: emailFromIdentify
      }));
      return;
    }

    if (savedEmail) {
      setForm((prev) => ({
        ...prev,
        email: savedEmail
      }));
      setRememberMe(true);
    }
  }, [location.state]);

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
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGeneralError("");

    const errors = validateLoginForm(form);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      await login(form);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", form.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      const savedUser = JSON.parse(localStorage.getItem("user"));

      showSuccess("Login realizado com sucesso.", () => {
        const redirectFromIdentify = location.state?.from;

        if (redirectFromIdentify) {
          navigate(redirectFromIdentify, { replace: true });
          return;
        }

        if (savedUser?.role === "ADMIN") {
          navigate("/admin", { replace: true });
        } else if (savedUser?.role === "CLIENT") {
          navigate("/client", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      });

    } catch {
      const message = "Email ou senha inválidos.";
      setGeneralError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box login-box">
        <h2>Fazer Login</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <div className={`input-wrapper ${fieldErrors.email ? "input-error" : ""}`}>
              <span className="input-icon">
                <MdEmail />
              </span>

              <div className="floating-field">
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label htmlFor="login-email">Email</label>
              </div>
            </div>

            {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
          </div>

          <div className="auth-field">
            <div className={`input-wrapper ${fieldErrors.password ? "input-error" : ""}`}>
              <span className="input-icon">
                <MdLock />
              </span>

              <div className="floating-field">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label htmlFor="login-password">Senha</label>
              </div>

              <button
                type="button"
                className="icon-button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((prev) => !prev)}
              />
              <span className="custom-checkbox"></span>
              <span className="remember-text">Lembrar de mim</span>
            </label>

            <Link to="/forgot-password">Esqueceu a senha?</Link>
          </div>

          {generalError && <p className="auth-error">{generalError}</p>}

          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="auth-link-text">
            Não tem uma conta? <Link to="/register">Cadastre-se</Link>
          </div>
        </form>
      </div>
    </div>
  );
}