import { Link } from "react-router-dom";
import "@/styles/components/Footer.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-brand">
          <span className="footer-brand-icon">✦</span>
          <span className="footer-brand-name">HazzeCury</span>
          <p className="footer-tagline">Elegância sob medida.</p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>Navegação</h4>
            <ul>
              <li><Link to="/products">Coleção</Link></li>
              <li><Link to="/products">Produtos</Link></li>
              <li><Link to="/home#sobre">Sobre</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Conta</h4>
            <ul>
              <li><Link to="/login">Entrar</Link></li>
              <li><Link to="/register">Cadastrar</Link></li>
              <li><Link to="/account">Minha Conta</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contato</h4>
            <ul>
              <li>
                <a href="mailto:contato@hazzecury.com">
                  contato@hazzecury.com
                </a>
              </li>
              <li><span>Rio de Janeiro, BR</span></li>
            </ul>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="footer-divider" />
        <span>© {year} HazzeCury Alfaiataria. Todos os direitos reservados.</span>
      </div>
    </footer>
  );
}