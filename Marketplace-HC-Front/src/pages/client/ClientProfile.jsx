import { useEffect, useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { getMyProfile } from "@/services/clientService";
import { useToast } from "@/context/ToastContext";
import { formatCPF, formatPhone } from "@/utils/format";
import "@/styles/pages/ClientPages.css";

export function ClientProfile() {
  const { showError } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  function formatRole(role) {
    if (role === "CLIENT") return "CLIENTE";
    if (role === "ADMIN") return "ADMINISTRADOR";
    return role || "CLIENTE";
  }

  async function loadProfile() {
    try {
      setLoading(true);

      const data = await getMyProfile();
      setProfile(data);
    } catch (err) {
      showError(err.message || "Erro ao carregar perfil.");
    } finally {
      setLoading(false);
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
            <h1>Seu perfil</h1>
            <p>Visualize os dados principais da sua conta.</p>
          </div>
        </section>

        <section className="profile-container">
          {loading ? (
            <p className="loading-text">Carregando perfil...</p>
          ) : (
            <section className="profile-card">
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
                  {profile?.phone ? formatPhone(profile.phone) : "Não informado"}
                </strong>
              </div>

              <div>
                <span>CPF:</span>
                <strong>
                  {profile?.cpf ? formatCPF(profile.cpf) : "Não informado"}
                </strong>
              </div>

              <div>
                <span>Tipo de conta:</span>
                <strong>{formatRole(profile?.role)}</strong>
              </div>
            </section>
          )}
        </section>
      </main>
    </>
  );
}