import { useState } from "react";
import { createAdminUser } from "@/services/adminService";
import { useToast } from "@/context/ToastContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "@/utils/validations";
import "@/styles/pages/AdminPages.css";

export function AdminCreateUser() {
  const { showSuccess, showError } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  function validateForm() {
    const newErrors = {};

    const nameError = validateName(form.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(form.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(form.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      form.password,
      form.confirmPassword
    );
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    };

    try {
      setSaving(true);

      await createAdminUser(payload);

      showSuccess("Administrador criado com sucesso.");

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (err) {
      showError(err.message || "Erro ao criar administrador.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-hero">
        <h1>Criar Usuário Administrador</h1>
        <p>Cadastre uma nova conta com acesso administrativo.</p>
      </section>

      <section className="admin-panel">
        <h2>Novo administrador</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          {/* NOME */}
          <label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nome"
              className={errors.name ? "input-error-border" : ""}
            />
            {errors.name && (
              <small className="input-error">{errors.name}</small>
            )}
          </label>

          {/* EMAIL */}
          <label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className={errors.email ? "input-error-border" : ""}
            />
            {errors.email && (
              <small className="input-error">{errors.email}</small>
            )}
          </label>

          {/* SENHA */}
          <label>
            <div className="input-password">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Senha"
                className={errors.password ? "input-error-border" : ""}
              />

              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
              </button>
            </div>

            {errors.password && (
              <small className="input-error">{errors.password}</small>
            )}
          </label>

          {/* CONFIRMAR SENHA */}
          <label>
            <div className="input-password">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmar senha"
                className={errors.confirmPassword ? "input-error-border" : ""}
              />

              <button
                type="button"
                className="eye-button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash size={22} />
                ) : (
                  <FaEye size={22} />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <small className="input-error">{errors.confirmPassword}</small>
            )}
          </label>

          <div className="admin-actions admin-full">
            <button type="submit" disabled={saving}>
              {saving ? "Criando..." : "Criar administrador"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}