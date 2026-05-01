import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { getUser } from "@/utils/auth";
import { formatPrice } from "@/utils/format";
import { StoreHeader } from "@/components/StoreHeader";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@/services/wishlistService";

import "@/styles/pages/ProductDetail.css";

const API_URL = import.meta.env.VITE_API_URL;

function getImage(imageUrl) {
  const fallback =
    "https://images.unsplash.com/photo-1594938298603-c8148c4b4d8b?w=800&q=80";
  if (!imageUrl) return fallback;

  const url = imageUrl.trim().replace(/"/g, "");
  return url.startsWith("/") ? API_URL + url : url;
}

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showSuccess, showError } = useToast();

  const user = getUser();
  const isAdmin = user?.role === "ADMIN";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products/${id}`);
        const data = await response.json().catch(() => null);

        if (!response.ok)
          throw new Error(data?.message || "Produto não encontrado.");

        setProduct(data);
      } catch (err) {
        setError(err.message || "Erro ao carregar produto.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  useEffect(() => {
    async function checkFavorite() {
      if (!user || isAdmin) return;

      try {
        const data = await getWishlist();

        const exists = data.some(
          (item) =>
            Number(item.product?.id || item.productId || item.id) === Number(id)
        );

        setIsFavorite(exists);
      } catch (err) {
        console.error("Erro ao verificar lista de desejos:", err);
      }
    }

    checkFavorite();
  }, [id]);

  function handleDecrement() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function handleIncrement() {
    if (!product) return;
    setQuantity((prev) => Math.min(product.stock, prev + 1));
  }

  async function handleToggleWishlist() {
    if (isAdmin) return;

    if (!user) {
      navigate("/auth/identify", { state: { from: `/products/${id}` } });
      return;
    }

    try {
      if (isFavorite) {
        await removeFromWishlist(id);
        setIsFavorite(false);
        showSuccess("Produto removido da lista de desejos.");
      } else {
        await addToWishlist(id);
        setIsFavorite(true);
        showSuccess("Produto adicionado à lista de desejos.");
      }
    } catch (err) {
      showError(err.message || "Erro ao atualizar lista de desejos.");
    }
  }

  async function handleAddToCart() {
    if (!product) return;
    if (isAdmin) return;

    let success = true;

    for (let i = 0; i < quantity; i++) {
      const added = await addToCart(product);
      if (!added) {
        success = false;
        break;
      }
    }

    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  }

  function handleCheckout() {
    if (isAdmin) return;

    if (!user) {
      navigate("/auth/identify", { state: { from: `/products/${id}` } });
      return;
    }

    navigate("/cart");
  }

  const unavailable = product?.stock === 0 || product?.active === false;

  if (loading)
    return (
      <div className="detail-page">
        <StoreHeader />
        <p className="detail-message">Carregando produto...</p>
      </div>
    );

  if (error || !product)
    return (
      <div className="detail-page">
        <StoreHeader />
        <div className="detail-error-block">
          <p className="detail-error">{error || "Produto não encontrado."}</p>
          <button className="detail-btn-back" onClick={() => navigate(-1)}>
            ← Voltar
          </button>
        </div>
      </div>
    );

  return (
    <div className="detail-page">
      <StoreHeader />

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
              {!isAdmin && (
                <button
                  type="button"
                  className={`detail-wishlist ${isFavorite ? "active" : ""}`}
                  onClick={handleToggleWishlist}
                  title={
                    isFavorite
                      ? "Remover da lista de desejos"
                      : "Adicionar à lista de desejos"
                  }
                >
                  {isFavorite ? <FaHeart /> : <FaRegHeart />}
                </button>
              )}

              <img
                src={getImage(product.imageUrl)}
                alt={product.name}
                className="detail-image"
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

              {isAdmin && (
                <p className="detail-admin-stock">
                  Estoque: {product.stock ?? 0}
                </p>
              )}

              <div className="detail-meta">
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Disponibilidade</span>
                  <span
                    className={`detail-meta-value ${
                      unavailable ? "out" : "in"
                    }`}
                  >
                    {unavailable
                      ? "Indisponível"
                      : `${product.stock} em estoque`}
                  </span>
                </div>
              </div>

              {!isAdmin && !unavailable && (
                <div className="detail-quantity">
                  <span className="detail-quantity-label">Quantidade</span>
                  <div className="detail-quantity-control">
                    <button onClick={handleDecrement} disabled={quantity <= 1}>
                      −
                    </button>

                    <span>{quantity}</span>

                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="detail-actions">
                {!isAdmin && (
                  <>
                    <button
                      className={`detail-btn-cart ${added ? "added" : ""}`}
                      onClick={handleAddToCart}
                      disabled={unavailable}
                    >
                      {unavailable
                        ? "Esgotado"
                        : added
                        ? "✦ Adicionado"
                        : "Adicionar ao carrinho"}
                    </button>

                    <button
                      className="detail-btn-checkout"
                      onClick={handleCheckout}
                      disabled={unavailable}
                    >
                      {user ? "Ir para o carrinho" : "Finalizar pedido"}
                    </button>

                    {!user && (
                      <p className="detail-login-hint">
                        Faça login para finalizar seu pedido.
                      </p>
                    )}
                  </>
                )}

                <button
                  className="detail-btn-back"
                  onClick={() => navigate("/products")}
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