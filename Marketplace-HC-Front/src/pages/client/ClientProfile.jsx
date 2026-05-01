import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "@/services/clientService";
import { useToast } from "@/context/ToastContext";
import { formatCPF, formatPhone, onlyNumbers } from "@/utils/format";
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
} from "@/utils/validations";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "@/styles/pages/ClientPages.css";

export function ClientProfile() {
  const { showSuccess, showError } = useToast();

  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function loadProfile() {
    try {
      setLoading(true);

      const data = await getMyProfile();
      setProfile(data);

      setForm({
        name: data?.name || "",
        email: data?.email || "",
        phone: onlyNumbers(data?.phone || ""),
        cpf: onlyNumbers(data?.cpf || ""),
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

    const phoneError = validatePhone(form.phone);
    if (phoneError) newErrors.phone = phoneError;

    if (form.password || form.confirmPassword) {
      const passwordError = validatePassword(form.password);
      if (passwordError) newErrors.password = passwordError;

      const confirmPasswordError = validateConfirmPassword(
        form.password,
        form.confirmPassword
      );
      if (confirmPasswordError) {
        newErrors.confirmPassword = confirmPasswordError;
      }
    }

    return newErrors;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "phone" ? onlyNumbers(value).slice(0, 11) : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  function handleCancelEdit() {
    setEditing(false);
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);

    setForm({
      name: profile?.name || "",
      email: profile?.email || "",
      phone: onlyNumbers(profile?.phone || ""),
      cpf: onlyNumbers(profile?.cpf || ""),
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

      const payload = {
        name: form.name?.trim() || "",
        email: form.email?.trim() || "",
        phone: onlyNumbers(form.phone || ""),
      };

      if (form.password?.trim()) {
        payload.password = form.password;
      }

      const updated = await updateMyProfile(payload);

      setProfile(updated);

      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            name: updated.name,
            email: updated.email,
          })
        );
      }

      setForm({
        name: updated?.name || "",
        email: updated?.email || "",
        phone: onlyNumbers(updated?.phone || ""),
        cpf: onlyNumbers(updated?.cpf || ""),
        password: "",
        confirmPassword: "",
      });

      setErrors({});
      setEditing(false);
      setShowPassword(false);
      setShowConfirmPassword(false);

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
    <main className="client-page">
      <section className="client-hero">
        <div className="client-hero-inner">
          <h1>Meu perfil</h1>
          <p>Visualize e atualize os dados principais da sua conta.</p>
        </div>
      </section>

      <section className="profile-container">
        {loading ? (
          <p className="loading-text">Carregando perfil...</p>
        ) : (
          <section className="profile-card">
            <div className="profile-actions-header">
              <h2>Dados pessoais</h2>

              <button
                type="button"
                className="btn-outline"
                onClick={editing ? handleCancelEdit : () => setEditing(true)}
              >
                {editing ? "Cancelar" : "Editar"}
              </button>
            </div>

            {!editing ? (
              <>
                <div className="profile-header">
                  <div className="avatar">
                    {(profile?.name || "C").charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h2>{profile?.name || "Cliente"}</h2>
                    <p>{profile?.email || "Email não informado"}</p>
                  </div>
                </div>

                <div>
                  <span>Nome:</span>
                  <strong>{profile?.name || "Não informado"}</strong>
                </div>

                <div>
                  <span>Email:</span>
                  <strong>{profile?.email || "Não informado"}</strong>
                </div>

                <div>
                  <span>Telefone:</span>
                  <strong>
                    {profile?.phone
                      ? formatPhone(profile.phone)
                      : "Não informado"}
                  </strong>
                </div>

                <div>
                  <span>CPF:</span>
                  <strong>
                    {profile?.cpf ? formatCPF(profile.cpf) : "Não informado"}
                  </strong>
                </div>
              </>
            ) : (
              <form className="profile-form" onSubmit={handleSubmit}>
                <label>
                  Nome
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
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
                    className={errors.email ? "input-error-border" : ""}
                  />
                  {errors.email && (
                    <small className="input-error">{errors.email}</small>
                  )}
                </label>

                <label>
                  Telefone
                  <input
                    name="phone"
                    value={formatPhone(form.phone)}
                    onChange={handleChange}
                    placeholder="11999999999"
                    className={errors.phone ? "input-error-border" : ""}
                  />
                  {errors.phone && (
                    <small className="input-error">{errors.phone}</small>
                  )}
                </label>

                <label>
                  CPF
                  <input
                    name="cpf"
                    value={formatCPF(form.cpf)}
                    disabled
                  />
                </label>

                <label>
                  Nova senha
                  <div className="password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Deixe em branco para não alterar"
                      className={errors.password ? "input-error-border" : ""}
                    />

                    <span
                      className="eye-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash size={22} />
                      ) : (
                        <FaEye size={22} />
                      )}
                    </span>
                  </div>

                  {errors.password && (
                    <small className="input-error">{errors.password}</small>
                  )}
                </label>

                <label>
                  Confirmar nova senha
                  <div className="password-field">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirme a nova senha"
                      className={
                        errors.confirmPassword ? "input-error-border" : ""
                      }
                    />

                    <span
                      className="eye-icon"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash size={22} />
                      ) : (
                        <FaEye size={22} />
                      )}
                    </span>
                  </div>

                  {errors.confirmPassword && (
                    <small className="input-error">
                      {errors.confirmPassword}
                    </small>
                  )}
                </label>

                <button type="submit" className="btn-main" disabled={saving}>
                  {saving ? "Salvando..." : "Salvar perfil"}
                </button>
              </form>
            )}
          </section>
        )}
      </section>
    </main>
  );
}