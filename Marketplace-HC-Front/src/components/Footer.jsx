import { Link } from "react-router-dom";
import "@/styles/Footer.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-brand">
          <span className="footer-brand-icon">✦</span>
          <span className="footer-brand-name">Alfaiataria</span>
          <p className="footer-tagline">Elegância sob medida.</p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>Navegação</h4>
            <ul>
              <li><Link to="/home">Coleção</Link></li>
              <li><Link to="/home">Produtos</Link></li>
              <li><Link to="/home">Sobre</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Conta</h4>
            <ul>
              <li><Link to="/login">Entrar</Link></li>
              <li><Link to="/register">Cadastrar</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contato</h4>
            <ul>
              <li><a href="mailto:contato@alfaiataria.com">contato@alfaiataria.com</a></li>
              <li><span>Rio de Janeiro, BR</span></li>
            </ul>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <span>© {year} Alfaiataria. Todos os direitos reservados.</span>
        <div className="footer-divider" />
      </div>
    </footer>
  );
}
