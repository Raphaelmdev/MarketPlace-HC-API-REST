import { useState, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  MdHome,
  MdReceiptLong,
  MdPerson,
  MdLogout,
  MdLocationOn,
  MdShoppingBag,
  MdStorefront
} from "react-icons/md";
import { IoMdStar } from "react-icons/io";

import { getUser, logout } from "@/utils/auth";
import "@/styles/components/ClientHeader.css";

export function ClientHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimeout = useRef(null);

  const user = getUser();

  const showNav = location.pathname !== "/client";

  function handleLogout() {
    logout();
    navigate("/home", { replace: true });
  }

  function handleMouseEnter() {
    clearTimeout(closeTimeout.current);
    setMenuOpen(true);
  }

  function handleMouseLeave() {
    closeTimeout.current = setTimeout(() => setMenuOpen(false), 180);
  }

  return (
    <header
      className={`store-header client-header ${
        showNav ? "client-header-nav-mode" : "client-header-simple"
      }`}
    >
      <div className="header-top">
        <div className="logo" onClick={() => navigate("/client")}>
          <img src="/src/assets/logohc.png" alt="HazzeCury Cliente" />
        </div>

        {showNav && (
          <nav className="client-header-nav">
            <NavLink to="/client" end>
              <MdHome /> Minha conta
            </NavLink>

            <NavLink to="/client/orders">
              <MdReceiptLong /> Meus pedidos
            </NavLink>

            <NavLink to="/cart">
              <MdShoppingBag /> Minha sacola
            </NavLink>

            <NavLink to="/client/wishlist">
              <IoMdStar /> Lista de desejos
            </NavLink>

            <NavLink to="/client/address">
              <MdLocationOn /> Meu endereço
            </NavLink>

            <NavLink to="/client/profile">
              <MdPerson /> Meu perfil
            </NavLink>
          </nav>
        )}

        <div
          className="account client-account"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="account-label">
            <MdPerson />
            <div>
              <span>Área do cliente</span>
              <strong>{user?.name?.split(" ")[0] ?? "Cliente"}</strong>
            </div>
          </div>

          {menuOpen && (
            <div className="dropdown">
              <div className="dropdown-section">
                <button onClick={() => navigate("/products")}>
                <MdStorefront /> Ver loja
                </button>
                <button onClick={handleLogout}>
                  <MdLogout /> Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}