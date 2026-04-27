import { useEffect, useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { cancelMyOrder, getMyOrders } from "@/services/clientService";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/utils/format";
import "@/styles/pages/ClientPages.css";

export function ClientOrders() {
  const { showSuccess, showError } = useToast();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingOrderId, setCancelingOrderId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  function formatStatus(status) {
    const map = {
      PENDING: "Pendente",
      PAID: "Pago",
      CONFIRMED: "Confirmado",
      SHIPPED: "Enviado",
      DELIVERED: "Entregue",
      CANCELED: "Cancelado",
      CANCELLED: "Cancelado",
    };

    return map[status] || status || "Pendente";
  }

  function getStatusClass(status) {
    const map = {
      PENDING: "pending",
      PAID: "paid",
      CONFIRMED: "confirmed",
      SHIPPED: "shipped",
      DELIVERED: "delivered",
      CANCELED: "canceled",
      CANCELLED: "canceled",
    };

    return map[status] || "pending";
  }

  function canCancelOrder(status) {
    return ["PENDING", "PAID", "CONFIRMED"].includes(status);
  }

  async function loadOrders() {
    try {
      setLoading(true);

      const data = await getMyOrders();
      const ordersList = Array.isArray(data) ? data : [];

      setOrders(ordersList);
      setFilteredOrders(ordersList);
    } catch (err) {
      showError(err.message || "Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelOrder(orderId) {
    const confirmCancel = window.confirm(
      "Tem certeza que deseja cancelar este pedido?"
    );

    if (!confirmCancel) return;

    try {
      setCancelingOrderId(orderId);

      await cancelMyOrder(orderId);
      await loadOrders();

      showSuccess("Pedido cancelado com sucesso.");
    } catch (err) {
      showError(err.message || "Erro ao cancelar pedido.");
    } finally {
      setCancelingOrderId(null);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    const searchText = search.trim().toLowerCase();

    const result = orders.filter((order) => {
      const orderId = String(order.id || "");

      const products = (order.items || [])
        .map((item) => item.productName || `Produto #${item.productId}`)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchText ||
        orderId.includes(searchText) ||
        products.includes(searchText);

      const matchesStatus = !statusFilter || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredOrders(result);
  }, [search, statusFilter, orders]);

  return (
    <>
      <StoreHeader />

      <main className="client-page">
        {/* HERO */}
        <section className="client-hero">
          <div className="client-hero-inner">
            <h1>Seus pedidos</h1>
            <p>Visualize e acompanhe seus pedidos realizados na HazzeCury.</p>
          </div>
        </section>

        {/* CONTEÚDO */}
        <section className="orders-container">
          <div className="orders-header">
            <h2>Pedidos cadastrados</h2>

            <div className="orders-actions">
              <input
                type="text"
                placeholder="Buscar por pedido ou produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="PENDING">Pendente</option>
                <option value="PAID">Pago</option>
                <option value="CONFIRMED">Confirmado</option>
                <option value="SHIPPED">Enviado</option>
                <option value="DELIVERED">Entregue</option>
                <option value="CANCELED">Cancelado</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="empty-box">
              <h3>Carregando pedidos...</h3>
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map((order) => (
                <article className="order-card" key={order.id}>
                  <div className="order-card-header">
                    <div>
                      <h3>Pedido #{order.id}</h3>

                      <p className={`order-status ${getStatusClass(order.status)}`}>
                        {formatStatus(order.status)}
                      </p>
                    </div>

                    <strong>{formatPrice(order.total)}</strong>
                  </div>

                  <div className="order-items">
                    {(order.items || []).map((item, index) => (
                      <div className="order-item" key={index}>
                        <span>
                          {item.productName || `Produto #${item.productId}`}
                        </span>

                        <small>
                          {item.quantity}x — {formatPrice(item.unitPrice)}
                        </small>
                      </div>
                    ))}
                  </div>

                  {canCancelOrder(order.status) && (
                    <button
                      className="btn-outline"
                      disabled={cancelingOrderId === order.id}
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      {cancelingOrderId === order.id
                        ? "Cancelando..."
                        : "Cancelar pedido"}
                    </button>
                  )}
                </article>
              ))}

              {!filteredOrders.length && (
                <div className="empty-box">
                  <h3>
                    {orders.length
                      ? "Nenhum pedido encontrado."
                      : "Nenhum pedido cadastrado."}
                  </h3>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}