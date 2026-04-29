import { Link, Navigate } from "react-router-dom";
import "@/styles/pages/Home.css";

export function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role === "CLIENT") {
    return <Navigate to="/client" replace />;
  }

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="home">

      {/* TOPO DIREITO */}
      <div className="top-actions">
        <Link to="/login" className="btn-outline">Entrar</Link>
        <Link to="/register" className="btn-outline">Cadastrar</Link>
      </div>

      <section className="hero">
        <h1>HazzeCury</h1>
        <p>Alfaiataria moderna para homens de presença</p>

        <div className="hero-buttons">
          <Link to="/products" className="btn-outline main-btn">
            Veja nossa vitrine
          </Link>
        </div>
      </section>

      <section className="social">
        <h2>Redes Sociais</h2>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          Instagram
        </a>
      </section>

      <section className="devs">
        <h2 className="devs-title">Equipe</h2>

        {/* ✅ wrapper que organiza os cards em grade */}
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
              <a href="#" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://www.linkedin.com/in/nicholas-pedro-ferreira-da-silva/" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>

          <div className="dev-card">
            <h3>Miguel Solon</h3>
            <div className="social-links">
              <a href="https://github.com/miguel-cury-dados" target="_blank" rel="noreferrer">GitHub</a>
              <a href="#" target="_blank" rel="noreferrer">Instagram</a>
              <a href="#" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>

          <div className="dev-card">
            <h3>Reinaldo Campos</h3>
            <div className="social-links">
              <a href="https://github.com/reinaldodlc" target="_blank" rel="noreferrer">GitHub</a>
              <a href="#" target="_blank" rel="noreferrer">Instagram</a>
              <a href="#" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>

        </div>
      </section>

      <footer className="footer">
        <p>© 2026 HazzeCury - Todos os direitos reservados</p>
      </footer>
    </div>
  );
}