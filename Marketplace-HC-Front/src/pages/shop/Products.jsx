import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { getProducts } from "@/services/productService";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@/services/wishlistService";

import {
  formatPrice,
  formatCurrencyInput,
  parseCurrencyToNumber,
} from "@/utils/format";

import { StoreHeader } from "@/components/StoreHeader";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { getUser } from "@/utils/auth";
import { usePolling } from "@/utils/usePolling";

import "@/styles/pages/Products.css";

const API_URL = import.meta.env.VITE_API_URL;

export function Products() {
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { showSuccess, showError } = useToast();

  const user = getUser();
  const isAdmin = user?.role === "ADMIN";

  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());

  const [headerFilters, setHeaderFilters] = useState({
    name: "",
    categoryId: "",
  });

  const [priceFilters, setPriceFilters] = useState({
    minPrice: "",
    maxPrice: "",
    sort: "createdAt,desc",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const buildProductFilters = useCallback(
    (filters = {}) => {
      const cleanFilters = {};

      if (filters.name) cleanFilters.name = filters.name;
      if (filters.categoryId) cleanFilters.categoryId = filters.categoryId;

      if (filters.minPrice !== "" && filters.minPrice !== null) {
        cleanFilters.minPrice = filters.minPrice;
      }

      if (filters.maxPrice !== "" && filters.maxPrice !== null) {
        cleanFilters.maxPrice = filters.maxPrice;
      }

      if (filters.sort) cleanFilters.sort = filters.sort;

      return cleanFilters;
    },
    []
  );

  const getCurrentProductFilters = useCallback(() => {
    return buildProductFilters({
      ...headerFilters,
      minPrice: parseCurrencyToNumber(priceFilters.minPrice),
      maxPrice: parseCurrencyToNumber(priceFilters.maxPrice),
      sort: priceFilters.sort,
    });
  }, [buildProductFilters, headerFilters, priceFilters]);

  async function loadProducts(filters = {}) {
    try {
      setLoading(true);
      setError("");

      const cleanFilters = buildProductFilters(filters);

      const data = await getProducts(cleanFilters);
      setProducts(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      setError(err.message || "Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  }

  async function loadWishlist() {
    if (!user || isAdmin) return;

    try {
      const data = await getWishlist();

      const ids = new Set(
        data.map((item) => item.product?.id || item.productId || item.id)
      );

      setWishlistIds(ids);
    } catch (err) {
      console.error("Erro ao carregar lista de desejos:", err);
    }
  }

  const fetchProductsSilently = useCallback(async () => {
    const data = await getProducts(getCurrentProductFilters());
    return Array.isArray(data) ? data : data.content || [];
  }, [getCurrentProductFilters]);

  const updateProductsSilently = useCallback((data) => {
    setProducts(Array.isArray(data) ? data : []);
  }, []);

  const fetchWishlistSilently = useCallback(async () => {
    if (!user || isAdmin) return [];

    const data = await getWishlist();

    return data.map((item) => item.product?.id || item.productId || item.id);
  }, [user, isAdmin]);

  const updateWishlistSilently = useCallback((ids) => {
    setWishlistIds(new Set(ids));
  }, []);

  usePolling({
    fetchData: fetchProductsSilently,
    onUpdate: updateProductsSilently,
    interval: 3000,
    enabled: !loading,
  });

  usePolling({
    fetchData: fetchWishlistSilently,
    onUpdate: updateWishlistSilently,
    interval: 3000,
    enabled: !loading && !!user && !isAdmin,
  });

  useEffect(() => {
    loadProducts({
      ...headerFilters,
      minPrice: parseCurrencyToNumber(priceFilters.minPrice),
      maxPrice: parseCurrencyToNumber(priceFilters.maxPrice),
      sort: priceFilters.sort,
    });

    loadWishlist();
  }, []);

  function handleSearch(filters) {
    const updatedHeaderFilters = {
      name: filters.name || "",
      categoryId: filters.categoryId || "",
    };

    setHeaderFilters(updatedHeaderFilters);

    loadProducts({
      ...updatedHeaderFilters,
      minPrice: parseCurrencyToNumber(priceFilters.minPrice),
      maxPrice: parseCurrencyToNumber(priceFilters.maxPrice),
      sort: priceFilters.sort,
    });
  }

  function handlePriceChange(e) {
    const { name, value } = e.target;

    setPriceFilters((prev) => ({
      ...prev,
      [name]: name === "sort" ? value : formatCurrencyInput(value),
    }));
  }

  function handlePriceSubmit(e) {
    e.preventDefault();

    loadProducts({
      ...headerFilters,
      minPrice: parseCurrencyToNumber(priceFilters.minPrice),
      maxPrice: parseCurrencyToNumber(priceFilters.maxPrice),
      sort: priceFilters.sort,
    });
  }

  function handleClearPriceFilters() {
    const cleanPriceFilters = {
      minPrice: "",
      maxPrice: "",
      sort: "id,asc",
    };

    setPriceFilters(cleanPriceFilters);

    loadProducts({
      ...headerFilters,
      minPrice: "",
      maxPrice: "",
      sort: cleanPriceFilters.sort,
    });
  }

  async function handleToggleWishlist(e, productId, isFavorite) {
    e.preventDefault();
    e.stopPropagation();

    if (isAdmin) return;

    if (!user) {
      navigate("/auth/identify", { state: { from: "/products" } });
      return;
    }

    try {
      if (isFavorite) {
        await removeFromWishlist(productId);

        setWishlistIds((prev) => {
          const updated = new Set(prev);
          updated.delete(productId);
          return updated;
        });

        showSuccess("Produto removido da lista de desejos.");
      } else {
        await addToWishlist(productId);

        setWishlistIds((prev) => {
          const updated = new Set(prev);
          updated.add(productId);
          return updated;
        });

        showSuccess("Produto adicionado à lista de desejos.");
      }
    } catch (err) {
      showError(err.message || "Erro ao atualizar lista de desejos.");
    }
  }

  async function handleAddToCart(e, product) {
    e.preventDefault();
    e.stopPropagation();

    if (isAdmin) return;
    if (product.stock === 0 || product.active === false) return;

    try {
      const added = await addToCart(product);
      if (!added) return;
    } catch (err) {
      showError(err.message || "Erro ao adicionar produto à sacola.");
    }
  }

  function getImage(product) {
    let url = product.imageUrl;

    if (!url) {
      return "https://images.unsplash.com/photo-1594938298603-c8148c4b4d8b?w=800&q=80";
    }

    url = url.trim().replace(/"/g, "");

    if (url.startsWith("/")) return API_URL + url;

    return url;
  }

  function isUnavailable(product) {
    return product.stock === 0 || product.active === false;
  }

  return (
    <div className="products-page">
      <StoreHeader onSearch={handleSearch} />

      <section className="products-header">
        <div className="products-header__ornament">
          <span />
          <i>Alfaiataria HazzeCury</i>
          <span />
        </div>

        <h1 className="products-header__title">Nossa Vitrine</h1>

        <p className="products-header__subtitle">
          Peças selecionadas para homens de presença
        </p>
      </section>

      <section className="products-price-filter">
        <form
          className="products-price-filter__form"
          onSubmit={handlePriceSubmit}
        >
          <input
            type="text"
            name="minPrice"
            placeholder="Preço mínimo"
            value={priceFilters.minPrice}
            onChange={handlePriceChange}
          />

          <input
            type="text"
            name="maxPrice"
            placeholder="Preço máximo"
            value={priceFilters.maxPrice}
            onChange={handlePriceChange}
          />

          <select
            name="sort"
            value={priceFilters.sort}
            onChange={handlePriceChange}
          >
            <option value="id,asc">Mais recentes</option>
            <option value="price,asc">Menor preço</option>
            <option value="price,desc">Maior preço</option>
            <option value="name,asc">Nome A-Z</option>
            <option value="name,desc">Nome Z-A</option>
          </select>

          <button type="submit" className="products-price-filter__button">
            Aplicar
          </button>

          <button
            type="button"
            className="products-price-filter__clear"
            onClick={handleClearPriceFilters}
          >
            Limpar
          </button>
        </form>
      </section>

      {loading && <p className="products-message">Carregando produtos...</p>}

      {error && (
        <p className="products-message products-message--error">{error}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="products-message">Nenhum produto encontrado.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <section className="products-grid">
          {products.map((product) => {
            const unavailable = isUnavailable(product);
            const isFavorite = wishlistIds.has(product.id);

            return (
              <Link
                to={`/products/${product.id}`}
                key={product.id}
                className="product-card-link"
              >
                <article className="product-card">
                  <div className="product-card__image-wrapper">
                    {!isAdmin && (
                      <button
                        type="button"
                        className={`product-card__wishlist ${
                          isFavorite ? "is-favorite" : ""
                        }`}
                        onClick={(e) =>
                          handleToggleWishlist(e, product.id, isFavorite)
                        }
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
                      src={getImage(product)}
                      alt={product.name}
                      className="product-card__image"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1594938298603-c8148c4b4d8b?w=800&q=80";
                      }}
                    />

                    <span className="product-card__categoria">
                      {product.categoryName ||
                        product.category?.name ||
                        "Produto"}
                    </span>

                    {unavailable && (
                      <span className="product-card__status">Esgotado</span>
                    )}
                  </div>

                  <div className="product-card__body">
                    <h2 className="product-card__nome">{product.name}</h2>

                    <p className="product-card__descricao">
                      {product.description || "Produto exclusivo HazzeCury."}
                    </p>

                    {isAdmin && (
                      <p className="product-card__admin-stock">
                        Estoque: {product.stock ?? 0}
                      </p>
                    )}

                    <div className="product-card__footer">
                      <div className="product-card__price-action">
                        <strong className="product-card__preco">
                          {formatPrice(product.price)}
                        </strong>

                        {!isAdmin && (
                          <button
                            className="btn-buy"
                            disabled={unavailable}
                            onClick={(e) => handleAddToCart(e, product)}
                          >
                            {unavailable ? "Esgotado" : "Adicionar à sacola"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
}