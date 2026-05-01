import { Link, Navigate } from "react-router-dom";
import { getUser } from "@/utils/auth";
import "@/styles/pages/Home.css";

export function Home() {
  const user = getUser();

  return (
    <div className="home">

      {/* ── Hero ── */}
      <section className="hero">

        <div className="top-actions">
          <Link to="/login"    className="btn-outline">Entrar</Link>
          <Link to="/register" className="btn-outline">Cadastrar</Link>
        </div>

        <div className="hero-ornament">
          <span />
          <i>Alfaiataria de Prestígio</i>
          <span />
        </div>

        <h1>HazzeCury</h1>
        <p>Alfaiataria moderna para homens de presença</p>

        <div className="hero-buttons">
          <Link to="/products" className="btn-outline main-btn">
            Ver Coleção
          </Link>
        </div>

      </section>

      {/* ── Redes Sociais ── */}
      <section className="social">
        <h2>Redes Sociais</h2>
        <span className="gold-rule" />
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          Instagram
        </a>
      </section>

      {/* ── Equipe ── */}
      <section className="devs">
        <h2 className="devs-title">Equipe</h2>

        <div className="dev-cards-grid">

          <div className="dev-card">
            <h3>Raphael Martins</h3>
            <div className="social-links">
              <a href="https://github.com/Raphaelmdev" target="_blank" rel="noreferrer">GitHub</a>
              <a href="#" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://www.linkedin.com/in/raphael-martins-15539826a/" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>

          <div className="dev-card">
            <h3>Nicholas Pedro</h3>
            <div className="social-links">
              <a href="https://github.com/NicholasPedroF" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://www.instagram.com/nc.ferreiraps?igsh=MW5iYWk4MnoybHhtcA==" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://www.linkedin.com/in/nicholas-pedro-ferreira-da-silva/" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>

          <div className="dev-card">
            <h3>Miguel Solon</h3>
            <div className="social-links">
              <a href="https://github.com/miguel-cury-dados" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://www.instagram.com/miguel_solon/" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://www.linkedin.com/in/miguel-cury-dados/" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>

          <div className="dev-card">
            <h3>Reinaldo Campos</h3>
            <div className="social-links">
              <a href="https://github.com/reinaldodlc" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://www.instagram.com/reinaldodlc/" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://www.linkedin.com/in/reinaldo-campos-developer/" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>

        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <p>© 2026 HazzeCury — Todos os direitos reservados</p>
      </footer>

    </div>
  );
}