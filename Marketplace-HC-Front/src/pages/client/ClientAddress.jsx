import { useEffect, useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { getMyProfile, updateMyAddress } from "@/services/clientService";
import { useToast } from "@/context/ToastContext";
import { formatCEP } from "@/utils/format";
import "@/styles/pages/ClientPages.css";

export function ClientAddress() {
  const { showSuccess, showError } = useToast();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchingCep, setSearchingCep] = useState(false);

  async function loadProfile() {
    try {
      setLoading(true);

      const data = await getMyProfile();
      setProfile(data);

      setForm({
        cep: data?.cep ? formatCEP(data.cep) : "",
        street: data?.street || "",
        number: data?.number || "",
        complement: data?.complement || "",
        neighborhood: data?.neighborhood || "",
        city: data?.city || "",
        state: data?.state || "",
      });
    } catch (err) {
      showError(err.message || "Erro ao carregar endereço.");
    } finally {
      setLoading(false);
    }
  }

  function normalizeCep(value) {
    return value.replace(/\D/g, "").slice(0, 8);
  }

  function applyCepMask(value) {
    const onlyNumbers = normalizeCep(value);

    return onlyNumbers
      .replace(/^(\d{5})(\d)/, "$1-$2");
  }

  function normalizeAddressFromViaCep(data) {
    if (!data || data.erro) return null;

    return {
      street: data.logradouro || "",
      neighborhood: data.bairro || "",
      city: data.localidade || "",
      state: data.uf || "",
    };
  }

  function normalizeAddressFromBrasilApi(data) {
    if (!data) return null;

    return {
      street: data.street || "",
      neighborhood: data.neighborhood || "",
      city: data.city || "",
      state: data.state || "",
    };
  }

  async function fetchViaCep(cep) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

    if (!response.ok) {
      throw new Error("ViaCEP indisponível.");
    }

    const data = await response.json();
    const address = normalizeAddressFromViaCep(data);

    if (!address) {
      throw new Error("CEP não encontrado na ViaCEP.");
    }

    return address;
  }

  async function fetchBrasilApiCep(cep) {
    const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);

    if (!response.ok) {
      throw new Error("BrasilAPI indisponível.");
    }

    const data = await response.json();
    const address = normalizeAddressFromBrasilApi(data);

    if (!address) {
      throw new Error("CEP não encontrado na BrasilAPI.");
    }

    return address;
  }

  async function searchCep(cepValue) {
    const cep = normalizeCep(cepValue);

    if (cep.length !== 8) return;

    try {
      setSearchingCep(true);

      let address;

      try {
        address = await fetchViaCep(cep);
      } catch {
        address = await fetchBrasilApiCep(cep);
      }

      setForm((prev) => ({
        ...prev,
        street: address.street,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state.toUpperCase().slice(0, 2),
      }));
    } catch {
      showError("CEP não encontrado.");
    } finally {
      setSearchingCep(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "cep") {
      const maskedCep = applyCepMask(value);

      setForm((prev) => ({
        ...prev,
        cep: maskedCep,
      }));

      const onlyNumbers = normalizeCep(maskedCep);

      if (onlyNumbers.length === 8) {
        searchCep(onlyNumbers);
      }

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: name === "state" ? value.toUpperCase().slice(0, 2) : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...form,
        cep: normalizeCep(form.cep),
        state: form.state.toUpperCase(),
      };

      const updated = await updateMyAddress(payload);

      setProfile(updated);
      setForm({
        cep: updated?.cep ? formatCEP(updated.cep) : "",
        street: updated?.street || "",
        number: updated?.number || "",
        complement: updated?.complement || "",
        neighborhood: updated?.neighborhood || "",
        city: updated?.city || "",
        state: updated?.state || "",
      });

      setEditing(false);
      showSuccess("Endereço atualizado com sucesso.");
    } catch (err) {
      showError(err.message || "Erro ao atualizar endereço.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    setEditing(false);

    setForm({
      cep: profile?.cep ? formatCEP(profile.cep) : "",
      street: profile?.street || "",
      number: profile?.number || "",
      complement: profile?.complement || "",
      neighborhood: profile?.neighborhood || "",
      city: profile?.city || "",
      state: profile?.state || "",
    });
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
              <div className="profile-actions-header">
                <h2>Seu Endereço</h2>

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
                </>
              ) : (
                <form className="profile-form" onSubmit={handleSubmit}>
                  <label>
                    CEP
                    <input
                      name="cep"
                      value={form.cep}
                      onChange={handleChange}
                      maxLength="9"
                      placeholder="00000-000"
                      required
                    />
                  </label>

                  {searchingCep && (
                    <p className="cep-helper">Buscando endereço...</p>
                  )}

                  <label>
                    Rua
                    <input
                      name="street"
                      value={form.street}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label>
                    Número
                    <input
                      name="number"
                      value={form.number}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label>
                    Complemento
                    <input
                      name="complement"
                      value={form.complement}
                      onChange={handleChange}
                    />
                  </label>

                  <label>
                    Bairro
                    <input
                      name="neighborhood"
                      value={form.neighborhood}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label>
                    Cidade
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label>
                    UF
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      maxLength="2"
                      required
                    />
                  </label>

                  <button
                    type="submit"
                    className="btn-main"
                    disabled={saving || searchingCep}
                  >
                    {saving ? "Salvando..." : "Salvar endereço"}
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