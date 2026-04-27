import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import "@/styles/Navbar.css";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cart } = useCart();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const token = localStorage.getItem("token");

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        <Link to="/home" className="navbar-brand">
          <span className="brand-icon">✦</span>
          <span className="brand-name">Alfaiataria</span>
        </Link>

        <ul className="navbar-links">
          <li><Link to="/home">Coleção</Link></li>
          <li><Link to="/home">Produtos</Link></li>
          <li><Link to="/home">Sobre</Link></li>
        </ul>

        <div className="navbar-actions">
          {token ? (
            <>
              <Link to="/cart" className="nav-icon cart-icon" title="Carrinho">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {cart.length > 0 && (
                  <span className="cart-badge">{cart.length}</span>
                )}
              </Link>
              <button className="nav-logout" onClick={handleLogout}>Sair</button>
            </>
          ) : (
            <Link to="/login" className="nav-cta">Entrar</Link>
          )}
        </div>

        <button
          className={`navbar-burger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`navbar-mobile ${menuOpen ? "open" : ""}`}>
        <Link to="/home" onClick={() => setMenuOpen(false)}>Coleção</Link>
        <Link to="/home" onClick={() => setMenuOpen(false)}>Produtos</Link>
        <Link to="/home" onClick={() => setMenuOpen(false)}>Sobre</Link>
        {token ? (
          <>
            <Link to="/cart" onClick={() => setMenuOpen(false)}>
              Carrinho {cart.length > 0 && `(${cart.length})`}
            </Link>
            <button onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <Link to="/login" onClick={() => setMenuOpen(false)}>Entrar</Link>
        )}
      </div>
    </nav>
  );
}