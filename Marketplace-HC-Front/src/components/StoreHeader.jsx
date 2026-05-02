import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdSearch,
  MdPerson,
  MdLogout,
  MdReceiptLong,
  MdHome,
  MdAdminPanelSettings
} from "react-icons/md";
import { FaHeart, FaFilter } from "react-icons/fa";
import { IoBagHandleSharp } from "react-icons/io5";

import { useCart } from "@/context/CartContext";
import { getUser, logout } from "@/utils/auth";
import { isAdmin as checkAdmin } from "@/utils/roles";
import { getCategories } from "@/services/productService";
import { usePolling } from "@/utils/usePolling";

import "@/styles/components/StoreHeader.css";

export function StoreHeader({ onSearch }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { cartCount } = useCart();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartAnimate, setCartAnimate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  const closeTimeout = useRef(null);
  const previousCartCount = useRef(cartCount);

  const isAdmin = checkAdmin(user);
  const isClient = !!user && !isAdmin;
  const isPublic = !user;

  const showSearch = location.pathname.startsWith("/products");
  const isCartPage = location.pathname.startsWith("/cart");

  useEffect(() => {
    function syncUser() {
      setUser(getUser());
    }

    syncUser();
    window.addEventListener("authChanged", syncUser);

    return () => window.removeEventListener("authChanged", syncUser);
  }, []);

  // 🔥 LOAD INICIAL
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : data.content || []);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
        setCategories([]);
      }
    }

    loadCategories();
  }, []);

  // 🔥 POLLING (LEVE)
  const fetchCategoriesSilently = useCallback(async () => {
    const data = await getCategories();
    return Array.isArray(data) ? data : data.content || [];
  }, []);

  const updateCategoriesSilently = useCallback((data) => {
    setCategories(data);
  }, []);

  usePolling({
    fetchData: fetchCategoriesSilently,
    onUpdate: updateCategoriesSilently,
    interval: 10000, // 👈 importante: mais leve
    enabled: true,
  });

  useEffect(() => {
    if (cartCount > previousCartCount.current) {
      setCartAnimate(true);
      setTimeout(() => setCartAnimate(false), 300);
    }

    previousCartCount.current = cartCount;
  }, [cartCount]);

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

  function handleSearch(e) {
    e.preventDefault();

    const filters = {
      name: searchTerm.trim(),
      categoryId,
    };

    if (onSearch) {
      onSearch(filters);
      return;
    }

    navigate("/products", { state: { filters } });
  }

  function handleCategoryChange(e) {
    const selectedCategoryId = e.target.value;
    setCategoryId(selectedCategoryId);

    if (onSearch) {
      onSearch({
        name: searchTerm.trim(),
        categoryId: selectedCategoryId,
      });
    }
  }

  function handleLoginClick() {
    const currentUser = getUser();

    if (currentUser) {
      const currentIsAdmin = checkAdmin(currentUser);
      navigate(currentIsAdmin ? "/admin" : "/client");
      return;
    }

    setUser(null);

    navigate("/auth/identify", {
      state: { from: location.pathname }
    });
  }

  return (
    <header className="store-header">
      <div className="header-top">
        <div className="logo" onClick={() => navigate("/home")}>
          <img src="/src/assets/logohc.png" alt="HazzeCury" />
        </div>

        {showSearch && (
          <form className="search-box" onSubmit={handleSearch}>
            <div className="search-filter-icon">
              <FaFilter />
            </div>

            <select
              className="search-category"
              value={categoryId}
              onChange={handleCategoryChange}
            >
              <option value="">Todas</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button type="submit">
              <MdSearch />
            </button>
          </form>
        )}

        <div className="header-actions">
          <div
            className="account"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="account-label" onClick={handleLoginClick}>
              <MdPerson />

              <div>
                <span>
                  {user
                    ? `Olá, ${user.name.split(" ")[0]}`
                    : "Olá, entre ou cadastre-se"}
                </span>

                <strong>
                  {isAdmin ? "Administrador" : "Contas e Listas"}
                </strong>
              </div>
            </div>

            {menuOpen && (
              <div className="dropdown">
                {isPublic && (
                  <div className="dropdown-login">
                    <button
                      className="login-button"
                      onClick={handleLoginClick}
                    >
                      Faça seu login
                    </button>

                    <p>
                      Cliente novo?{" "}
                      <span onClick={() => navigate("/auth/identify")}>
                        Comece aqui
                      </span>
                    </p>
                  </div>
                )}

                {isClient && (
                  <div className="dropdown-section">
                    <button onClick={() => navigate("/client")}>
                      <MdPerson /> Sua Conta
                    </button>

                    <button onClick={() => navigate("/client/orders")}>
                      <MdReceiptLong /> Seus pedidos
                    </button>

                    <button onClick={() => navigate("/client/address")}>
                      <MdHome /> Seu endereço
                    </button>

                    <button onClick={() => navigate("/client/wishlist")}>
                      <FaHeart /> Lista de desejos
                    </button>

                    <button onClick={handleLogout}>
                      <MdLogout /> Sair
                    </button>
                  </div>
                )}

                {isAdmin && (
                  <div className="dropdown-section">
                    <button onClick={() => navigate("/admin")}>
                      <MdAdminPanelSettings /> Painel Administrativo
                    </button>

                    <button onClick={handleLogout}>
                      <MdLogout /> Sair
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {isClient && (
            <div className="orders" onClick={() => navigate("/client/orders")}>
              <MdReceiptLong />
              <strong>Pedidos</strong>
            </div>
          )}

          {!isAdmin && !isCartPage && (
            <div className="cart" onClick={() => navigate("/cart")}>
              <IoBagHandleSharp />

              <span
                className={`cart-count${
                  cartAnimate ? " cart-count-pop" : ""
                }`}
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}