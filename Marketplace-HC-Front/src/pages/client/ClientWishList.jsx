import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { getWishlist, removeFromWishlist } from "@/services/wishlistService";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/utils/format";
import "@/styles/pages/ClientPages.css";

export function ClientWishlist() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  async function loadWishlist() {
    try {
      setLoading(true);
      const data = await getWishlist();
      setWishlist(Array.isArray(data) ? data : []);
    } catch (err) {
      showError(err.message || "Erro ao carregar lista de desejos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(productId) {
    try {
      setRemovingId(productId);
      await removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((product) => product.id !== productId));
      showSuccess("Produto removido da lista de desejos.");
    } catch (err) {
      showError(err.message || "Erro ao remover produto da lista.");
    } finally {
      setRemovingId(null);
    }
  }

  const filteredWishlist = wishlist.filter((product) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    return (
      product.name?.toLowerCase().includes(term) ||
      product.categoryName?.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    loadWishlist();
  }, []);

  return (
    <main className="client-page">
      <section className="client-hero">
        <div className="client-hero-inner">
          <h1>Lista de desejos</h1>
          <p>Produtos salvos para comprar futuramente.</p>
        </div>
      </section>

      <section className="wishlist-container">
        <div className="wishlist-header">
          <h2>Produtos salvos</h2>
          <input
            type="text"
            placeholder="Buscar por produto ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="wishlist-empty-box">
            <h3>Carregando lista de desejos...</h3>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="wishlist-empty-box">
            <FaHeart />
            <h3>Sua lista de desejos ainda está vazia</h3>
            <p>Salve produtos da vitrine para comprar futuramente.</p>
            <button onClick={() => navigate("/products")}>Ver produtos</button>
          </div>
        ) : filteredWishlist.length === 0 ? (
          <div className="wishlist-empty-box">
            <h3>Nenhum produto encontrado.</h3>
          </div>
        ) : (
          <div className="wishlist-grid">
            {filteredWishlist.map((product) => (
              <article className="wishlist-card" key={product.id}>
                <div className="wishlist-image">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <FaHeart />
                  )}
                </div>

                <div className="wishlist-info">
                  <h3>{product.name}</h3>
                  <p>{product.description || "Produto sem descrição."}</p>
                  <strong>{formatPrice(product.price)}</strong>

                  <div className="wishlist-actions">
                    <button onClick={() => navigate(`/products/${product.id}`)}>
                      Ver produto
                    </button>
                    <button
                      className="danger"
                      disabled={removingId === product.id}
                      onClick={() => handleRemove(product.id)}
                    >
                      {removingId === product.id ? "Removendo..." : "Remover"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}