import { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BsBoxSeamFill } from "react-icons/bs";
import {
  MdAdminPanelSettings,
  MdCategory,
  MdDashboard,
  MdInventory,
  MdLogout,
  MdPeople,
  MdPerson,
  MdReceiptLong
} from "react-icons/md";
import "@/styles/components/AdminHeader.css";

export function AdminHeader() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimeout = useRef(null);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/home", { replace: true });
  }

  function handleMouseEnter() {
    clearTimeout(closeTimeout.current);
    setMenuOpen(true);
  }

  function handleMouseLeave() {
    closeTimeout.current = setTimeout(() => {
      setMenuOpen(false);
    }, 180);
  }

  return (
    <header className="admin-header">
      <div className="admin-header-top">
        <div className="admin-logo" onClick={() => navigate("/admin")}>
          <img src="/src/assets/logohc.png" alt="HazzeCury Admin" />
        </div>

        <nav className="admin-header-nav">
          <NavLink to="/admin" end>
            <MdDashboard />
            Painel
          </NavLink>

          <NavLink to="/admin/products">
            <MdInventory />
            Produtos
          </NavLink>

          <NavLink to="/admin/categories">
            <MdCategory />
            Categorias
          </NavLink>

          <NavLink to="/admin/users">
            <MdPeople />
            Usuários
          </NavLink>

          <NavLink to="/admin/orders">
            <BsBoxSeamFill />
            Pedidos
          </NavLink>

          <NavLink to="/admin/create-admin">
            <MdAdminPanelSettings />
            Criar administrador
          </NavLink>
        </nav>

        <div
          className="admin-account"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="admin-account-label">
            <MdPerson />

            <div>
              <span>Área administrativa</span>
              <strong>Administrador</strong>
            </div>
          </div>

          {menuOpen && (
            <div className="admin-dropdown">
              <button onClick={handleLogout}>
                <MdLogout />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}