import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "@/styles/Interface.css";

export function Interface() {
  return (
    <div className="interface">

      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-label">
            <span className="line" />
            <span className="label-text">Alfaiataria</span>
            <span className="line" />
          </div>
          <h1 className="hero-title">HazzeCury</h1>
          <p className="hero-sub">Alfaiataria moderna para homens que valorizam presença</p>
          <Link to="/products" className="btn-primary">Ver Coleção</Link>
        </div>
        <div className="hero-scroll-hint">
          <span />
        </div>
      </section>

      {/* MANIFESTO */}
      <div className="manifesto-band">
        <p>"Veste-se bem quem conhece a si mesmo."</p>
      </div>

      {/* DESTAQUES */}
      <section className="highlights">
        <div className="section-header">
          <span className="gold-rule" />
          <h2>Nossa Coleção</h2>
          <span className="gold-rule" />
        </div>

        <div className="cards">
          <div className="card">
            <div className="card-img card-img--ternos" />
            <div className="card-body">
              <h3>Ternos Sob Medida</h3>
              <p>Elegância e caimento perfeito para qualquer ocasião</p>
              <Link to="/products" className="card-link">Explorar →</Link>
            </div>
          </div>

          <div className="card card--featured">
            <div className="card-img card-img--camisas" />
            <div className="card-body">
              <h3>Camisas Premium</h3>
              <p>Conforto e sofisticação no dia a dia</p>
              <Link to="/products" className="card-link">Explorar →</Link>
            </div>
          </div>

          <div className="card">
            <div className="card-img card-img--acessorios" />
            <div className="card-body">
              <h3>Acessórios</h3>
              <p>Detalhes que fazem a diferença no visual</p>
              <Link to="/products" className="card-link">Explorar →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="about">
        <div className="about-img" />
        <div className="about-text">
          <span className="eyebrow">Nossa história</span>
          <h2>Sobre a HazzeCury</h2>
          <div className="gold-divider" />
          <p>
            Nossa missão é elevar o estilo masculino com peças sob medida,
            combinando tradição e modernidade. Cada ponto, cada corte, cada
            detalhe é pensado para o homem que entende que vestir-se bem
            é uma forma de respeito — consigo e com o mundo.
          </p>
          <Link to="/about" className="btn-ghost">Conheça a marca</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-bg" />
        <div className="cta-content">
          <span className="eyebrow">Comece agora</span>
          <h2>Monte seu estilo hoje</h2>
          <p>Peças exclusivas, feitas para durar uma vida inteira.</p>
          <div className="cta-buttons">
            <Link to="/products" className="btn-primary">Explorar Produtos</Link>
            <Link to="/cart"     className="btn-ghost">Ver Carrinho</Link>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}