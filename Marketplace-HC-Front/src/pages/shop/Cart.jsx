import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrderFromCart } from "@/services/clientService";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { getUser } from "@/utils/auth";
import { formatPrice } from "@/utils/format";
import "@/styles/pages/Cart.css";

export function Cart() {
  const { showSuccess, showError } = useToast();

  const {
    cart,
    loadingCart,
    removeFromCart,
    updateQuantity,
    loadCart,
    migrateGuestCartToUserCart,
    clearGuestCart,
  } = useCart();

  const navigate = useNavigate();
  const user = getUser();
  const isLogged = !!user && user.role === "CLIENT";

  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [finishing, setFinishing] = useState(false);
  const [search, setSearch] = useState("");
  const [guestCartHandled, setGuestCartHandled] = useState(false);

  const guestCart = JSON.parse(localStorage.getItem("cart_guest")) || [];

  const showGuestWarning =
    isLogged && guestCart.length > 0 && !guestCartHandled;

  const items = Array.isArray(cart) ? cart : cart?.items || [];

  const getItemId = (item) => item.cartItemId || item.id;

  const getProductId = (item) => item.productId || item.id;

  const getItemName = (item) =>
    item.productName ||
    item.name ||
    item.product?.name ||
    `Produto #${getProductId(item)}`;

  const getItemPrice = (item) =>
    Number(item.unitPrice || item.price || item.product?.price || 0);

  const getItemQuantity = (item) => Number(item.quantity || 1);

  const getItemSubtotal = (item) =>
    Number(
      item.subTotal ??
        item.subtotal ??
        getItemPrice(item) * getItemQuantity(item)
    );

  const totalFromItems = items.reduce(
    (sum, item) => sum + getItemSubtotal(item),
    0
  );

  const total =
    Number(cart?.total || 0) > 0 ? Number(cart.total) : totalFromItems;

  async function handleMigrateGuestCart() {
    try {
      await migrateGuestCartToUserCart();
      await loadCart();

      setGuestCartHandled(true);
      showSuccess("Itens do carrinho visitante adicionados ao seu carrinho.");
    } catch (err) {
      showError(err.message || "Erro ao adicionar carrinho visitante.");
    }
  }

  function handleDiscardGuestCart() {
    clearGuestCart();
    setGuestCartHandled(true);
    showSuccess("Carrinho visitante descartado.");
  }

  async function handleUpdateQuantity(item, newQty) {
    const quantity = Number(newQty);

    if (quantity < 1) return;

    const itemId = getItemId(item);
    const productId = getProductId(item);

    try {
      setUpdatingId(itemId);
      await updateQuantity(productId, quantity);
      await loadCart();
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
      await removeFromCart(productId);
      await loadCart();
    } catch (err) {
      showError(err.message || "Erro ao remover produto.");
    } finally {
      setRemovingId(null);
    }
  }

 async function handleFinishOrder() {
  if (!isLogged) {
    navigate("/auth/identify", {
      state: { from: "/cart" },
    });
    return;
  }

  try {
    setFinishing(true);

    await createOrderFromCart();

    showSuccess("Pedido criado com sucesso!");

    await loadCart(); // limpa/atualiza carrinho

  
    navigate("/client/orders");

  } catch (err) {
    showError(err.message || "Erro ao finalizar pedido.");
  } finally {
    setFinishing(false);
  }
}

  const filteredItems = search.trim()
    ? items.filter((item) =>
        getItemName(item).toLowerCase().includes(search.toLowerCase().trim())
      )
    : items;

  return (
    <main className="cart-page">
      <section className="cart-hero">
        <div className="cart-hero__ornament"></div>

        <h1>Minha Sacola</h1>
        <p>Confira os produtos antes de finalizar o pedido.</p>
      </section>

      <section className="cart-section">
        <div className="cart-section__header">
          <h2>Produtos selecionados</h2>

          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="cart-search"
          />
        </div>

        {showGuestWarning && (
          <div className="cart-guest-warning">
            <p>
              Você possui itens no carrinho de visitante. Deseja adicioná-los ao
              seu carrinho da conta?
            </p>

            <div className="cart-guest-actions">
              <button
                type="button"
                className="cart-btn-main"
                onClick={handleMigrateGuestCart}
              >
                Adicionar a minha sacola
              </button>

              <button
                type="button"
                className="cart-btn-outline"
                onClick={handleDiscardGuestCart}
              >
                Descartar sacola visitante
              </button>
            </div>
          </div>
        )}

        {loadingCart ? (
          <div className="cart-empty-box">
            <p>Carregando sacola...</p>
          </div>
        ) : !items.length ? (
          <div className="cart-empty-box">
            <span className="cart-empty-box__icon">✦</span>
            <p>Sua sacola está vazia.</p>

            <button
              className="cart-btn-outline"
              onClick={() => navigate("/products")}
            >
              Ver coleção
            </button>
          </div>
        ) : !filteredItems.length ? (
          <div className="cart-empty-box">
            <p>Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              <button
                className="cart-btn-outline cart-continue"
                onClick={() => navigate("/products")}
              >
                ← Continuar comprando
              </button>

              {filteredItems.map((item) => {
                const itemId = getItemId(item);

                return (
                  <article className="cart-card" key={itemId}>
                    <div className="cart-card__info">
                      <h3 className="cart-card__name">{getItemName(item)}</h3>

                      <p className="cart-card__unit">
                        {formatPrice(getItemPrice(item))} / unidade
                      </p>
                    </div>

                    <div className="cart-card__footer">
                      <div className="cart-qty">
                        <button
                          className="cart-qty__btn"
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
                          −
                        </button>

                        <span className="cart-qty__value">
                          {getItemQuantity(item)}
                        </span>

                        <button
                          className="cart-qty__btn"
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

                      <strong className="cart-card__subtotal">
                        {formatPrice(getItemSubtotal(item))}
                      </strong>

                      <button
                        className="cart-card__remove"
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

            <aside className="cart-summary">
              <h3 className="cart-summary__title">Resumo</h3>

              <div className="cart-summary__rows">
                <div className="cart-summary__row">
                  <span>Subtotal: </span>
                  <strong>{formatPrice(total)}</strong>
                </div>

                <div className="cart-summary__row">
                  <span>Frete: </span>
                  <strong>Grátis</strong>
                </div>
              </div>

              <div className="cart-summary__total">
                <span>Total: </span>
                <strong>{formatPrice(total)}</strong>
              </div>

              <button
                className="cart-btn-main"
                disabled={finishing}
                onClick={handleFinishOrder}
              >
                {finishing
                  ? "Finalizando..."
                  : isLogged
                  ? "Finalizar pedido"
                  : "Entrar para finalizar"}
              </button>

              {!isLogged && (
                <p className="cart-summary__hint">
                  Sua sacola será salva como visitante até você entrar.
                </p>
              )}
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}