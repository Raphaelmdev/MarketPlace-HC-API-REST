import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdShoppingCart,
  MdPerson,
  MdLogout,
  MdListAlt,
  MdReceiptLong,
  MdHome
} from "react-icons/md";
import { IoMdStar } from "react-icons/io";
import { useCart } from "@/context/CartContext";
import "@/styles/components/StoreHeader.css";

export function StoreHeader() {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartAnimate, setCartAnimate] = useState(false);

  const closeTimeout = useRef(null);
  const previousCartCount = useRef(cartCount);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (cartCount > previousCartCount.current) {
      setCartAnimate(true);
      setTimeout(() => setCartAnimate(false), 300);
    }
    previousCartCount.current = cartCount;
  }, [cartCount]);

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

  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="store-header">
      <div className="header-top">
        {/* LOGO */}
        <div
          className="logo"
          onClick={() => navigate(isAdmin ? "/admin" : "/home")}
        >
          <img src="/src/assets/logohc.png" alt="HazzeCury" />
        </div>

        {/* SEARCH (somente cliente) */}
        {!isAdmin && (
          <div className="search-box">
            <input placeholder="Buscar produtos..." />
            <button>
              <MdSearch />
            </button>
          </div>
        )}

        <div className="header-actions">

          {/* ACCOUNT */}
          <div
            className="account"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
          <div className="account-label">
            <MdPerson />

            <div>
              <span>
                {user ? `Olá, ${user.name}` : "Olá, entre ou cadastre-se"}
              </span>

              <strong>
                {isAdmin ? "Administrador" : "Contas e Listas"}
              </strong>
            </div>
          </div>

          {menuOpen && (
            <div className="dropdown">
              {!user && (
                <div className="dropdown-login">
                  <button
                    className="login-button"
                    onClick={() => navigate("/auth/identify")}
                  >
                    Faça seu login
                  </button>

                  <p>
                    Cliente novo?{" "}
                    <span onClick={() => navigate("/auth/identify")}>
                      Comece aqui
                    </span>
                  </p>

                  <div className="dropdown-divider"></div>
                </div>
              )}

              {user && (
                <div className="dropdown-section">
                  {isAdmin ? (
                    <button onClick={handleLogout}>
                      <MdLogout /> Sair
                    </button>
                  ) : (
                    <>
                      <button onClick={() => navigate("/client/profile")}>
                        <MdPerson /> Seu perfil
                      </button>

                      <button onClick={() => navigate("/client/orders")}>
                        <MdListAlt /> Seus pedidos
                      </button>

                      <button onClick={() => navigate("/client/address")}>
                        <MdHome /> Seu endereço
                      </button>

                      <button onClick={() => navigate("/client/wishlist")}>
                        <IoMdStar /> Lista de desejos
                      </button>

                      <button onClick={handleLogout}>
                        <MdLogout /> Sair
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

          {/* CLIENT ONLY */}
          {!isAdmin && (
            <>
              <div
                className="orders"
                onClick={() => navigate("/client/orders")}>
                  <MdReceiptLong />
                <strong>Pedidos</strong>
              </div>

              <div className="cart" onClick={() => navigate("/cart")}>
                <MdShoppingCart />
                <strong>Carrinho</strong>

                <span
                  className={`cart-count ${cartAnimate ? "cart-count-pop" : ""}`}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}