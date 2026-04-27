import { useEffect, useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import {
  createCart,
  createOrderFromCart,
  getMyCartItems,
  removeCartItem,
  updateCartItem,
} from "@/services/clientService";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/utils/format";
import "@/styles/pages/ClientPages.css";

export function ClientCart() {
  const { showSuccess, showError } = useToast();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [finishing, setFinishing] = useState(false);
  const [search, setSearch] = useState("");

  const isLogged = Boolean(localStorage.getItem("token"));

  async function loadCartItems() {
    try {
      setLoading(true);

      if (isLogged) {
        try {
          const data = await getMyCartItems();
          setItems(Array.isArray(data) ? data : []);
        } catch (err) {
          if (err.message?.toLowerCase().includes("carrinho não encontrado")) {
            await createCart();
            const data = await getMyCartItems();
            setItems(Array.isArray(data) ? data : []);
          } else {
            throw err;
          }
        }
      } else {
        setItems(Array.isArray(cart) ? cart : []);
      }
    } catch (err) {
      showError(err.message || "Erro ao carregar carrinho.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCartItems();
  }, [cart]);

  function getItemId(item) {
    return item.cartItemId || item.id;
  }

  function getProductId(item) {
    return item.productId || item.id;
  }

  function getItemName(item) {
    return item.productName || item.name || `Produto #${getProductId(item)}`;
  }

  function getItemPrice(item) {
    return Number(item.unitPrice || item.price || 0);
  }

  function getItemQuantity(item) {
    return Number(item.quantity || 1);
  }

  function getItemSubtotal(item) {
    return Number(
      item.subTotal ||
        item.subtotal ||
        getItemPrice(item) * getItemQuantity(item)
    );
  }

  async function handleUpdateQuantity(item, newQuantity) {
    const quantity = Number(newQuantity);
    if (quantity < 1) return;

    const itemId = getItemId(item);
    const productId = getProductId(item);

    try {
      setUpdatingId(itemId);

      if (isLogged) {
        await updateCartItem(itemId, productId, quantity);
        await loadCartItems();
      } else {
        updateQuantity(productId, quantity);
      }
    } catch (err) {
      showError(err.message || "Erro ao atualizar quantidade.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleRemoveItem(item) {
    const itemId = getItemId(item);
    const productId = getProductId(item);

    try {
      setRemovingId(itemId);

      if (isLogged) {
        await removeCartItem(itemId);
        await loadCartItems();
      } else {
        removeFromCart(productId);
      }

      showSuccess("Produto removido do carrinho.");
    } catch (err) {
      showError(err.message || "Erro ao remover produto.");
    } finally {
      setRemovingId(null);
    }
  }

  async function handleFinishOrder() {
    if (!isLogged) {
      showError("Faça login para finalizar o pedido.");
      return;
    }

    try {
      setFinishing(true);
      await createOrderFromCart();
      await loadCartItems();
      showSuccess("Pedido criado com sucesso.");
    } catch (err) {
      showError(err.message || "Erro ao finalizar pedido.");
    } finally {
      setFinishing(false);
    }
  }

  const total = items.reduce((sum, item) => sum + getItemSubtotal(item), 0);

  const filteredItems = items.filter((item) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    return getItemName(item).toLowerCase().includes(term);
  });

  return (
    <>
      <StoreHeader />

      <main className="client-page">
        <section className="client-hero">
          <div className="client-hero-inner">
            <h1>Meu carrinho</h1>
            <p>Confira os produtos adicionados antes de finalizar o pedido.</p>
          </div>
        </section>

        <section className="orders-container">
          <div className="orders-header">
            <h2>Produtos no carrinho</h2>

            <div className="orders-actions">
              <input
                type="text"
                placeholder="Buscar produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="empty-box">
              <h3>Carregando carrinho...</h3>
            </div>
          ) : !items.length ? (
            <div className="empty-box">
              <h3>Seu carrinho está vazio.</h3>
            </div>
          ) : !filteredItems.length ? (
            <div className="empty-box">
              <h3>Nenhum produto encontrado.</h3>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-items">
                <div className="orders-list">
                  {filteredItems.map((item) => {
                    const itemId = getItemId(item);

                    return (
                      <article className="order-card" key={itemId}>
                        <div className="order-card-header">
                          <div>
                            <h3>{getItemName(item)}</h3>

                            <p>
                              {getItemQuantity(item)} unidade(s) —{" "}
                              {formatPrice(getItemPrice(item))}
                            </p>
                          </div>

                          <strong>{formatPrice(getItemSubtotal(item))}</strong>
                        </div>

                        <div className="cart-card-footer">
                          <div className="cart-quantity-control">
                            <button
                              disabled={
                                getItemQuantity(item) <= 1 ||
                                updatingId === itemId
                              }
                              onClick={() =>
                                handleUpdateQuantity(
                                  item,
                                  getItemQuantity(item) - 1
                                )
                              }
                            >
                              -
                            </button>

                            <span>{getItemQuantity(item)}</span>

                            <button
                              disabled={updatingId === itemId}
                              onClick={() =>
                                handleUpdateQuantity(
                                  item,
                                  getItemQuantity(item) + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="btn-outline"
                            disabled={removingId === itemId}
                            onClick={() => handleRemoveItem(item)}
                          >
                            {removingId === itemId ? "Removendo..." : "Remover"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <aside className="cart-summary">
                <h3>Resumo do pedido</h3>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>{formatPrice(total)}</strong>
                </div>

                <div className="summary-row">
                  <span>Frete</span>
                  <strong>Grátis</strong>
                </div>

                <div className="summary-total">
                  <span>Total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>

                <button
                  className="btn-main"
                  disabled={finishing}
                  onClick={handleFinishOrder}
                >
                  {finishing ? "Finalizando..." : "Finalizar pedido"}
                </button>
              </aside>
            </div>
          )}
        </section>
      </main>
    </>
  );
}