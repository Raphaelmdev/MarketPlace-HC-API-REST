import { useState } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import { createAdminUser } from "@/services/adminService";
import { useToast } from "@/context/ToastContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword
} from "@/utils/validations";
import "@/styles/pages/AdminPages.css";

export function AdminCreateUser() {
  const { showSuccess, showError } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function validateForm() {
    const errors = {};

    const nameError = validateName(form.name);
    if (nameError) errors.name = nameError;

    const emailError = validateEmail(form.email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(form.password);
    if (passwordError) errors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      form.password,
      form.confirmPassword
    );
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = validateForm();
    const firstError = Object.values(errors)[0];

    if (firstError) {
      showError(firstError);
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password
    };

    try {
      setSaving(true);

      await createAdminUser(payload);

      showSuccess("Administrador criado com sucesso.");
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
    } catch (err) {
      showError(err.message || "Erro ao criar administrador.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminHeader />

      <main className="admin-page">
        <section className="admin-hero">
          <h1>Criar Usuário Administrador</h1>
          <p>Cadastre uma nova conta com acesso administrativo.</p>
        </section>

        <section className="admin-panel">
          <h2>Novo administrador</h2>

          <form className="admin-form" onSubmit={handleSubmit}>
            {/* NOME */}
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nome"
            />

            {/* EMAIL */}
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
            />

            {/* SENHA */}
            <div className="input-password">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Senha"
            />

            <button
              type="button"
              className="eye-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

            {/* CONFIRMAR SENHA */}
            <div className="input-password">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmar senha"
              />

              <button
                type="button"
                className="eye-button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="admin-actions admin-full">
              <button type="submit" disabled={saving}>
                {saving ? "Criando..." : "Criar administrador"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}