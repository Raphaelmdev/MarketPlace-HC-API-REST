import { useEffect, useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { getMyProfile, updateMyProfile } from "@/services/clientService";
import { useToast } from "@/context/ToastContext";
import { formatCPF, formatPhone } from "@/utils/format";
import "@/styles/pages/ClientPages.css";

export function ClientProfile() {
  const { showSuccess, showError } = useToast();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  function formatRole(role) {
    if (role === "CLIENT") return "CLIENTE";
    if (role === "ADMIN") return "ADMINISTRADOR";
    return role || "CLIENTE";
  }

  function onlyNumbers(value) {
    return value.replace(/\D/g, "");
  }

  async function loadProfile() {
    try {
      setLoading(true);

      const data = await getMyProfile();
      setProfile(data);

      setForm({
        name: data?.name || "",
        email: data?.email || "",
        phone: data?.phone || "",
        cpf: data?.cpf || "",
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
      [name]:
        name === "phone"
          ? onlyNumbers(value).slice(0, 11)
          : name === "cpf"
          ? onlyNumbers(value).slice(0, 11)
          : value,
    }));
  }

  function handleCancelEdit() {
    setEditing(false);

    setForm({
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      cpf: profile?.cpf || "",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: onlyNumbers(form.phone),
        cpf: onlyNumbers(form.cpf),
      };

      const updated = await updateMyProfile(payload);

      setProfile(updated);
      setForm({
        name: updated?.name || "",
        email: updated?.email || "",
        phone: updated?.phone || "",
        cpf: updated?.cpf || "",
      });

      setEditing(false);
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
      <StoreHeader />

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
                    Telefone
                    <input
                      name="phone"
                      value={formatPhone(form.phone)}
                      onChange={handleChange}
                      maxLength="15"
                      placeholder="(11) 99999-9999"
                    />
                  </label>

                  <label>
                    CPF
                    <input
                      name="cpf"
                      value={formatCPF(form.cpf)}
                      onChange={handleChange}
                      maxLength="14"
                      placeholder="000.000.000-00"
                      required
                    />
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
    </>
  );
}