import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "@/services/clientService";
import { useToast } from "@/context/ToastContext";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/utils/validations";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "@/styles/pages/AdminPages.css";

export function AdminProfile() {
  const { showSuccess, showError } = useToast();

  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function formatRole(role) {
    if (role === "ADMIN") return "Administrador";
    if (role === "CLIENT") return "Cliente";
    return role || "Administrador";
  }

  async function loadProfile() {
    try {
      setLoading(true);

      const data = await getMyProfile();
      setProfile(data);

      setForm({
        name: data?.name || "",
        email: data?.email || "",
        currentPassword: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      showError(err.message || "Erro ao carregar perfil.");
    } finally {
      setLoading(false);
    }
  }

  function validateForm() {
    const newErrors = {};

    const nameError = validateName(form.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(form.email);
    if (emailError) newErrors.email = emailError;

    const wantsChangePassword =
      form.currentPassword || form.password || form.confirmPassword;

    if (wantsChangePassword) {
      if (!form.currentPassword) {
        newErrors.currentPassword = "Informe sua senha atual.";
      }

      const passwordError = validatePassword(form.password);
      if (passwordError) newErrors.password = passwordError;

      const confirmError = validateConfirmPassword(
        form.password,
        form.confirmPassword
      );
      if (confirmError) newErrors.confirmPassword = confirmError;
    }

    return newErrors;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  function resetPasswordVisibility() {
    setShowCurrentPassword(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  function handleCancelEdit() {
    setEditing(false);
    setErrors({});
    resetPasswordVisibility();

    setForm({
      name: profile?.name || "",
      email: profile?.email || "",
      currentPassword: "",
      password: "",
      confirmPassword: "",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);

      const wantsChangePassword =
        form.currentPassword || form.password || form.confirmPassword;

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        currentPassword: wantsChangePassword ? form.currentPassword : null,
        password: wantsChangePassword ? form.password : null,
      };

      const updated = await updateMyProfile(payload);

      setProfile(updated);

      setForm({
        name: updated?.name || "",
        email: updated?.email || "",
        currentPassword: "",
        password: "",
        confirmPassword: "",
      });

      setErrors({});
      setEditing(false);
      resetPasswordVisibility();

      showSuccess("Perfil atualizado com sucesso.");
    } catch (err) {
      showError(err.message || "Erro ao atualizar perfil.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <main className="admin-page">
      <section className="admin-hero">
        <h1>Meu Perfil</h1>
        <p>Visualize e atualize os dados da sua conta administrativa.</p>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <h2>Dados pessoais</h2>

          <button
            type="button"
            className="admin-edit-button"
            onClick={editing ? handleCancelEdit : () => setEditing(true)}
          >
            {editing ? "Cancelar" : "Editar"}
          </button>
        </div>

        {loading ? (
          <p className="admin-loading">Carregando perfil...</p>
        ) : !editing ? (
          <div className="admin-profile-card">
            <div>
              <span>Nome:</span>
              <strong>{profile?.name || "Não informado"}</strong>
            </div>

            <div>
              <span>Email:</span>
              <strong>{profile?.email || "Não informado"}</strong>
            </div>

            <div>
              <span>Tipo de conta:</span>
              <strong>{formatRole(profile?.role)}</strong>
            </div>
          </div>
        ) : (
          <form className="admin-profile-form" onSubmit={handleSubmit}>
            <label>
              Nome
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Informe seu nome"
                className={errors.name ? "input-error-border" : ""}
              />
              {errors.name && (
                <small className="input-error">{errors.name}</small>
              )}
            </label>

            <label>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Informe seu email"
                className={errors.email ? "input-error-border" : ""}
              />
              {errors.email && (
                <small className="input-error">{errors.email}</small>
              )}
            </label>

            <label>
              Senha atual
              <div className="password-field">
                <input
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Obrigatória para alterar senha"
                  className={
                    errors.currentPassword ? "input-error-border" : ""
                  }
                />

                <button
                  type="button"
                  className="password-eye-button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                >
                  {showCurrentPassword ? (
                    <FaEyeSlash size={22} />
                  ) : (
                    <FaEye size={22} />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <small className="input-error">
                  {errors.currentPassword}
                </small>
              )}
            </label>

            <label>
              Nova senha
              <div className="password-field">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Nova senha"
                  className={errors.password ? "input-error-border" : ""}
                />

                <button
                  type="button"
                  className="password-eye-button"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <FaEyeSlash size={22} />
                  ) : (
                    <FaEye size={22} />
                  )}
                </button>
              </div>
              {errors.password && (
                <small className="input-error">{errors.password}</small>
              )}
            </label>

            <label>
              Confirmar senha
              <div className="password-field">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repita a nova senha"
                  className={
                    errors.confirmPassword ? "input-error-border" : ""
                  }
                />

                <button
                  type="button"
                  className="password-eye-button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={22} />
                  ) : (
                    <FaEye size={22} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <small className="input-error">
                  {errors.confirmPassword}
                </small>
              )}
            </label>

            <small className="password-hint">
              Deixe os campos de senha em branco caso não queira alterar.
            </small>

            <button type="submit" className="btn-main" disabled={saving}>
              {saving ? "Salvando..." : "Salvar perfil"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}