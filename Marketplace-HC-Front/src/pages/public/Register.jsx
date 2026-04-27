import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  MdPerson,
  MdEmail,
  MdLock,
  MdPhone,
  MdBadge,
  MdLocationOn,
  MdHome,
  MdNumbers,
  MdApartment,
  MdLocationCity,
  MdMap
} from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { register } from "@/services/authService";
import { useToast } from "@/context/ToastContext";
import { formatCPF, formatPhone, formatCEP, onlyNumbers } from "@/utils/format";
import { validateRegisterForm } from "@/utils/validations";
import "@/styles/pages/Register.css";

export function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    cpf: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: ""
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cepAutoFilled, setCepAutoFilled] = useState(false);

  useEffect(() => {
    const emailFromIdentify = location.state?.email;

    if (emailFromIdentify) {
      setForm((prev) => ({
        ...prev,
        email: emailFromIdentify
      }));
    }
  }, [location.state]);

  async function fetchCep(cep) {
    const cleanCep = onlyNumbers(cep);
    if (cleanCep.length !== 8) return;

    try {
      const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

      if (viaCepResponse.ok) {
        const viaCepData = await viaCepResponse.json();

        if (!viaCepData.erro) {
          setGeneralError("");
          setCepAutoFilled(true);

          setForm((prev) => ({
            ...prev,
            street: viaCepData.logradouro || "",
            neighborhood: viaCepData.bairro || "",
            city: viaCepData.localidade || "",
            state: viaCepData.uf || ""
          }));

          return;
        }
      }

      const brasilApiResponse = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`);

      if (brasilApiResponse.ok) {
        const brasilData = await brasilApiResponse.json();

        setGeneralError("");
        setCepAutoFilled(true);

        setForm((prev) => ({
          ...prev,
          street: brasilData.street || "",
          neighborhood: brasilData.neighborhood || "",
          city: brasilData.city || "",
          state: brasilData.state || ""
        }));

        return;
      }

      throw new Error("CEP não encontrado.");
    } catch {
      const message = "CEP não encontrado.";
      setGeneralError(message);
      showError(message);
      setCepAutoFilled(false);

      setForm((prev) => ({
        ...prev,
        street: "",
        neighborhood: "",
        city: "",
        state: ""
      }));
    }
  }

  function handleChange(e) {
    let { name, value } = e.target;

    if (name === "cpf") value = formatCPF(value);
    if (name === "phone") value = formatPhone(value);
    if (name === "number") value = onlyNumbers(value).slice(0, 10);

    if (name === "cep") {
      value = formatCEP(value);
      const cleanCep = onlyNumbers(value);

      if (cleanCep.length < 8) {
        setCepAutoFilled(false);

        setForm((prev) => ({
          ...prev,
          street: "",
          neighborhood: "",
          city: "",
          state: ""
        }));
      }

      if (cleanCep.length === 8) {
        fetchCep(cleanCep);
      }
    }

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

  function getPasswordStrength(password) {
    let score = 0;

    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password) || /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return "fraca";
    if (score <= 3) return "media";
    return "forte";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGeneralError("");

    const errors = validateRegisterForm(form);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    const dataToSend = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: onlyNumbers(form.phone),
      cpf: onlyNumbers(form.cpf),
      cep: onlyNumbers(form.cep),
      street: form.street,
      number: form.number,
      complement: form.complement,
      neighborhood: form.neighborhood,
      city: form.city,
      state: form.state
    };

    try {
      await register(dataToSend);

      showSuccess("Conta criada com sucesso.", () => {
        navigate("/login", {
          replace: true,
          state: {
            email: form.email,
            from: location.state?.from
          }
        });
      });
    } catch (error) {
      const message = error?.message || "Erro ao cadastrar.";
      setGeneralError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  }

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <div className="auth-page">
      <div className="auth-box register-box">
        <h2>Criar Conta</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="register-grid">
            <div className="auth-field">
              <div className={`input-wrapper ${fieldErrors.name ? "input-error" : ""}`}>
                <span className="input-icon"><MdPerson /></span>

                <div className="floating-field">
                  <input
                    id="register-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder=" "
                  />
                  <label htmlFor="register-name">Nome</label>
                </div>
              </div>

              {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
            </div>

            <div className="auth-field">
              <div className={`input-wrapper ${fieldErrors.email ? "input-error" : ""}`}>
                <span className="input-icon"><MdEmail /></span>

                <div className="floating-field">
                  <input
                    id="register-email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder=" "
                  />
                  <label htmlFor="register-email">Email</label>
                </div>
              </div>

              {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
            </div>

            <div className="auth-field">
              <div className={`input-wrapper ${fieldErrors.phone ? "input-error" : ""}`}>
                <span className="input-icon"><MdPhone /></span>

                <div className="floating-field">
                  <input
                    id="register-phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder=" "
                  />
                  <label htmlFor="register-phone">Telefone (Opcional)</label>
                </div>
              </div>

              {fieldErrors.phone && <p className="field-error">{fieldErrors.phone}</p>}
            </div>

            <div className="auth-field">
              <div className={`input-wrapper ${fieldErrors.cpf ? "input-error" : ""}`}>
                <span className="input-icon"><MdBadge /></span>

                <div className="floating-field">
                  <input
                    id="register-cpf"
                    name="cpf"
                    value={form.cpf}
                    onChange={handleChange}
                    placeholder=" "
                  />
                  <label htmlFor="register-cpf">CPF (Obrigatório)</label>
                </div>
              </div>

              {fieldErrors.cpf && <p className="field-error">{fieldErrors.cpf}</p>}
            </div>

            <div className="auth-field">
              <div className={`input-wrapper ${fieldErrors.password ? "input-error" : ""}`}>
                <span className="input-icon"><MdLock /></span>

                <div className="floating-field">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder=" "
                  />
                  <label htmlFor="register-password">Senha</label>
                </div>

                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {form.password && (
                <div className="password-strength-wrapper">
                  <div className="password-strength-bar">
                    <div className={`password-strength-fill strength-${passwordStrength}`}></div>
                  </div>

                  <p className={`password-strength-text strength-${passwordStrength}`}>
                    Senha {passwordStrength}
                  </p>
                </div>
              )}

              {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
            </div>

            <div className="auth-field">
              <div className={`input-wrapper ${fieldErrors.confirmPassword ? "input-error" : ""}`}>
                <span className="input-icon"><MdLock /></span>

                <div className="floating-field">
                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder=" "
                  />
                  <label htmlFor="register-confirm-password">Confirmar senha</label>
                </div>

                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {fieldErrors.confirmPassword && (
                <p className="field-error">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <div className="auth-field">
              <div className={`input-wrapper ${fieldErrors.cep ? "input-error" : ""}`}>
                <span className="input-icon"><MdLocationOn /></span>

                <div className="floating-field">
                  <input
                    id="register-cep"
                    name="cep"
                    value={form.cep}
                    onChange={handleChange}
                    placeholder=" "
                  />
                  <label htmlFor="register-cep">CEP</label>
                </div>
              </div>

              {fieldErrors.cep && <p className="field-error">{fieldErrors.cep}</p>}
            </div>

            <div className="auth-field">
              <div className={`input-wrapper ${fieldErrors.number ? "input-error" : ""}`}>
                <span className="input-icon"><MdNumbers /></span>

                <div className="floating-field">
                  <input
                    id="register-number"
                    name="number"
                    value={form.number}
                    onChange={handleChange}
                    placeholder=" "
                  />
                  <label htmlFor="register-number">Número</label>
                </div>
              </div>

              {fieldErrors.number && <p className="field-error">{fieldErrors.number}</p>}
            </div>

            <div className="auth-field full-width">
              <div className="input-wrapper">
                <span className="input-icon"><MdHome /></span>

                <div className="floating-field">
                  <input
                    id="register-street"
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    placeholder=" "
                  />
                  <label htmlFor="register-street">Rua</label>
                </div>
              </div>
            </div>

            <div className="auth-field full-width">
              <div className="input-wrapper">
                <span className="input-icon"><MdApartment /></span>

                <div className="floating-field">
                  <input
                    id="register-complement"
                    name="complement"
                    value={form.complement}
                    onChange={handleChange}
                    placeholder=" "
                  />
                  <label htmlFor="register-complement">Complemento (Opcional)</label>
                </div>
              </div>
            </div>

            <div className="auth-field full-width">
              <div className="input-wrapper">
                <span className="input-icon"><MdMap /></span>

                <div className="floating-field">
                  <input
                    id="register-neighborhood"
                    name="neighborhood"
                    value={form.neighborhood}
                    onChange={handleChange}
                    placeholder=" "
                  />
                  <label htmlFor="register-neighborhood">Bairro</label>
                </div>
              </div>
            </div>

            <div className="auth-field">
              <div className="input-wrapper">
                <span className="input-icon"><MdLocationCity /></span>

                <div className="floating-field">
                  <input
                    id="register-city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder=" "
                  />
                  <label htmlFor="register-city">Cidade</label>
                </div>
              </div>
            </div>

            <div className="auth-field">
              <div className="input-wrapper">
                <span className="input-icon"><MdMap /></span>

                <div className="floating-field">
                  <input
                    id="register-state"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder=" "
                  />
                  <label htmlFor="register-state">Estado</label>
                </div>
              </div>
            </div>
          </div>

          {cepAutoFilled && (
            <p className="cep-hint">
              Endereço preenchido automaticamente. Revise os dados antes de continuar.
            </p>
          )}

          {generalError && <p className="auth-error">{generalError}</p>}

          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>

          <p className="auth-link-text">
            Já tem uma conta? <Link to="/login">Fazer login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}