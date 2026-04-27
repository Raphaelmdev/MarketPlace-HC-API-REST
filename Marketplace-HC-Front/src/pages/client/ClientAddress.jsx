import { useEffect, useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { getMyProfile } from "@/services/clientService";
import { useToast } from "@/context/ToastContext";
import { formatCEP } from "@/utils/format";
import "@/styles/pages/ClientPages.css";

export function ClientAddress() {
  const { showError } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    try {
      setLoading(true);

      const data = await getMyProfile();
      setProfile(data);
    } catch (err) {
      showError(err.message || "Erro ao carregar endereço.");
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
            <h1>Seu endereço</h1>
            <p>Endereço cadastrado para entrega dos seus pedidos.</p>
          </div>
        </section>

        <section className="profile-container">
          {loading ? (
            <p className="loading-text">Carregando endereço...</p>
          ) : (
            <section className="profile-card">
              <div>
                <span>CEP:</span>
                <strong>
                  {profile?.cep ? formatCEP(profile.cep) : "Não informado"}
                </strong>
              </div>

              <div>
                <span>Rua:</span>
                <strong>{profile?.street || "Não informado"}</strong>
              </div>

              <div>
                <span>Número:</span>
                <strong>{profile?.number || "Não informado"}</strong>
              </div>

              <div>
                <span>Complemento:</span>
                <strong>{profile?.complement || "Não informado"}</strong>
              </div>

              <div>
                <span>Bairro:</span>
                <strong>{profile?.neighborhood || "Não informado"}</strong>
              </div>

              <div>
                <span>Cidade/Estado:</span>
                <strong>
                  {profile?.city || profile?.state
                    ? `${profile?.city || ""}/${profile?.state || ""}`
                    : "Não informado"}
                </strong>
              </div>
            </section>
          )}
        </section>
      </main>
    </>
  );
}