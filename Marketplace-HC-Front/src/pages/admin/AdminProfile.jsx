import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import { getMyProfile, updateMyProfile } from "@/services/clientService";
import { useToast } from "@/context/ToastContext";
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

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)\S{6,}$/.test(password);
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

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetPasswordVisibility() {
    setShowCurrentPassword(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  function handleCancelEdit() {
    setEditing(false);
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

    if (!validateEmail(form.email)) {
      showError("Informe um e-mail válido.");
      return;
    }

    const wantsChangePassword =
      form.currentPassword || form.password || form.confirmPassword;

    if (wantsChangePassword && !form.currentPassword) {
      showError("Informe sua senha atual para alterar a senha.");
      return;
    }

    if (wantsChangePassword && !validatePassword(form.password)) {
      showError("A nova senha deve ter no mínimo 6 caracteres, incluindo letras e números.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showError("As senhas não coincidem.");
      return;
    }

    try {
      setSaving(true);

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
    <>
      <AdminHeader />

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
                  minLength="3"
                  maxLength="100"
                  required
                />
              </label>

              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  maxLength="150"
                  required
                />
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
                  />

                  <button
                    type="button"
                    className="password-eye-button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                  >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>

              <label>
                Nova senha
                <div className="password-field">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Opcional"
                  />

                  <button
                    type="button"
                    className="password-eye-button"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
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
                  />

                  <button
                    type="button"
                    className="password-eye-button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
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
    </>
  );
}