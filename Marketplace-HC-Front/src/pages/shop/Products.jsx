import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "@/services/productService";
import "@/styles/pages/Products.css";

const API_URL = import.meta.env.VITE_API_URL;

export function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts(filters = {}) {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts(filters);

      setProducts(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      setError(err.message || "Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    loadProducts({ name });
  }

  function formatPrice(price) {
    return Number(price || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function getImage(product) {
    let url = product.imageUrl;

    if (!url) {
      return "https://images.unsplash.com/photo-1594938298603-c8148c4b4d8b?w=800&q=80";
    }

    url = url.trim().replace(/"/g, "");

    if (url.startsWith("/")) {
      return API_URL + url;
    }

    return url;
  }

  return (
    <div className="products-page">
      <header className="products-topbar">
        <Link to="/" className="products-logo">
          HazzeCury
        </Link>

        <div className="products-actions">
          <Link to="/login">Entrar</Link>
          <Link to="/register">Cadastrar</Link>
        </div>
      </header>

      <section className="products-header">
        <span className="products-header__ornament">✦</span>
        <h1 className="products-header__title">Nossa Vitrine</h1>
        <p className="products-header__subtitle">
          Peças selecionadas para homens de presença
        </p>
      </section>

      <form className="products-filter" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar produto..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit">Buscar</button>

        <button
          type="button"
          onClick={() => {
            setName("");
            loadProducts();
          }}
        >
          Limpar
        </button>
      </form>

      {loading && <p className="products-message">Carregando produtos...</p>}

      {error && <p className="products-error">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="products-message">Nenhum produto encontrado.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <section className="products-grid">
          {products.map((product) => (
            <Link
              to={`/products/${product.id}`}
              key={product.id}
              className="product-card-link"
            >
              <article className="product-card">
                <div className="product-card__image-wrapper">
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
                    {product.categoryName || product.category?.name || "Produto"}
                  </span>
                </div>

                <div className="product-card__body">
                  <h2 className="product-card__nome">{product.name}</h2>

                  <p className="product-card__descricao">
                    {product.description || "Produto exclusivo HazzeCury."}
                  </p>

                  <div className="product-card__footer">
                    <div className="product-card__price-action">
                      <strong className="product-card__preco">
                        {formatPrice(product.price)}
                      </strong>

                      <button
                        className="btn-buy"
                        disabled={product.stock === 0 || product.active === false}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {product.stock === 0 || product.active === false
                          ? "Esgotado"
                          : "Comprar"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}