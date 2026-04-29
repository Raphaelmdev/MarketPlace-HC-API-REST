import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import "@/styles/pages/ProductDetail.css";

const API_URL = import.meta.env.VITE_API_URL;

function formatPrice(price) {
  return Number(price || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getImage(imageUrl) {
  if (!imageUrl) {
    return "https://images.unsplash.com/photo-1594938298603-c8148c4b4d8b?w=800&q=80";
  }

  const url = imageUrl.trim().replace(/"/g, "");

  if (url.startsWith("/")) {
    return API_URL + url;
  }

  return url;
}

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products/${id}`);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || "Produto não encontrado.");
        }

        setProduct(data);
      } catch (err) {
        setError(err.message || "Erro ao carregar produto.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  function handleDecrement() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function handleIncrement() {
    if (!product) return;
    setQuantity((prev) => Math.min(product.stock, prev + 1));
  }

  function handleAddToCart() {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    navigate("/cart");
  }

  const unavailable = product?.stock === 0 || product?.active === false;

  if (loading) {
    return (
      <div className="detail-page">
        <DetailHeader />
        <p className="detail-message">Carregando produto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail-page">
        <DetailHeader />
        <div className="detail-error-block">
          <p className="detail-error">{error || "Produto não encontrado."}</p>
          <button className="detail-back-btn" onClick={() => navigate(-1)}>
            ← Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <DetailHeader />

      <main className="detail-main">
        <nav className="detail-breadcrumb">
          <Link to="/products">Vitrine</Link>
          <span className="detail-breadcrumb__sep">✦</span>
          <span>{product.categoryName || "Produto"}</span>
          <span className="detail-breadcrumb__sep">✦</span>
          <span className="detail-breadcrumb__current">{product.name}</span>
        </nav>

        <div className="detail-content">
          <div className="detail-image-col">
            <div className="detail-image-wrapper">
              <img
                src={getImage(product.imageUrl)}
                alt={product.name}
                className="detail-image"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1594938298603-c8148c4b4d8b?w=800&q=80";
                }}
              />
              {product.categoryName && (
                <span className="detail-category-badge">
                  {product.categoryName}
                </span>
              )}
              {unavailable && (
                <div className="detail-sold-out-overlay">
                  <span>Esgotado</span>
                </div>
              )}
            </div>
          </div>

          <div className="detail-info-col">
            <div className="detail-info-inner">
              <p className="detail-category-label">
                {product.categoryName || "HazzeCury"}
              </p>

              <h1 className="detail-name">{product.name}</h1>

              <div className="detail-divider" />

              <p className="detail-price">{formatPrice(product.price)}</p>

              {product.description && (
                <p className="detail-description">{product.description}</p>
              )}

              <div className="detail-meta">
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Disponibilidade</span>
                  <span className={`detail-meta-value ${unavailable ? "out" : "in"}`}>
                    {unavailable ? "Indisponível" : `${product.stock} em estoque`}
                  </span>
                </div>

                <div className="detail-meta-item">
                  <span className="detail-meta-label">Referência</span>
                  <span className="detail-meta-value">
                    HC-{String(product.id).padStart(4, "0")}
                  </span>
                </div>
              </div>

              {!unavailable && (
                <div className="detail-quantity">
                  <span className="detail-quantity-label">Quantidade</span>
                  <div className="detail-quantity-control">
                    <button
                      className="detail-qty-btn"
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="detail-qty-value">{quantity}</span>
                    <button
                      className="detail-qty-btn"
                      onClick={handleIncrement}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="detail-actions">
                <button
                  className="detail-btn-cart"
                  onClick={handleAddToCart}
                  disabled={unavailable}
                >
                  {unavailable ? "Esgotado" : "Adicionar ao carrinho"}
                </button>

                <button
                  className="detail-btn-back"
                  onClick={() => navigate(-1)}
                >
                  ← Continuar comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DetailHeader() {
  return (
    <header className="detail-topbar">
      <Link to="/" className="detail-logo">
        HazzeCury
      </Link>

      <div className="detail-nav">
        <Link to="/products">Vitrine</Link>
        <Link to="/login">Entrar</Link>
        <Link to="/register">Cadastrar</Link>
      </div>
    </header>
  );
}