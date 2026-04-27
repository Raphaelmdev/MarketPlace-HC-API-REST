import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { checkEmail } from "@/services/authService";
import { validateEmail } from "@/utils/validations";
import "@/styles/pages/IdentifyAccount.css";

export function IdentifyAccount() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/client";

  const [email, setEmail] = useState(location.state?.email || "");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const validationError = validateEmail(email);

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email.trim();

      const data = await checkEmail(cleanEmail);

      if (data.exists) {
        navigate("/login", {
          state: { email: cleanEmail, from },
          replace: true
        });
      } else {
        setStep("new-user");
      }
    } catch (err) {
      setError(err.message || "Não foi possível verificar o email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box login-box">
        <h2>Entrar ou criar conta</h2>

        <p className="auth-description">
          Informe seu email para continuar comprando.
        </p>

        {step === "email" && (
          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <div className={`input-wrapper ${error ? "input-error" : ""}`}>
                <span className="input-icon">
                  <MdEmail />
                </span>

                <div className="floating-field">
                  <input
                    id="identify-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder=" "
                  />
                  <label htmlFor="identify-email">Email</label>
                </div>
              </div>

              {error && <p className="field-error">{error}</p>}
            </div>

            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? "Verificando..." : "Continuar"}
            </button>
          </form>
        )}

        {step === "new-user" && (
          <div className="new-user-box">
            <h3>Novo por aqui?</h3>

            <p className="auth-description">
              Não encontramos uma conta com este email. Crie sua conta para continuar comprando.
            </p>

            <button
              className="auth-submit"
              onClick={() =>
                navigate("/register", {
                  state: { email: email.trim(), from },
                  replace: true
                })
              }
            >
              Criar conta
            </button>

            <button
              className="auth-submit secondary-auth-button"
              onClick={() => {
                setStep("email");
                setError("");
              }}
            >
              Usar outro email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}