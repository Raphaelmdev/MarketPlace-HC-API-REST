import { useEffect, useState, useCallback } from "react";
import { cancelMyOrder, getMyOrders } from "@/services/clientService";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/utils/format";
import { usePolling } from "@/utils/usePolling";

import "@/styles/pages/ClientPages.css";

export function ClientOrders() {
  const { showSuccess, showError } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingOrderId, setCancelingOrderId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  function normalizeStatus(status) {
    return String(status || "").toUpperCase();
  }

  function formatStatus(status) {
    const map = {
      PENDING: "Pendente",
      PAID: "Pago",
      SHIPPED: "Enviado",
      DELIVERED: "Entregue",
      CANCELED: "Cancelado",
    };

    return map[normalizeStatus(status)] || "Pendente";
  }

  function getStatusClass(status) {
    const map = {
      PENDING: "pending",
      PAID: "paid",
      SHIPPED: "shipped",
      DELIVERED: "delivered",
      CANCELED: "canceled",
    };

    return map[normalizeStatus(status)] || "pending";
  }

  function canCancelOrder(status) {
    return ["PENDING", "PAID"].includes(normalizeStatus(status));
  }

  async function loadOrders() {
    try {
      setLoading(true);

      const data = await getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      showError(err.message || "Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  }

  // 🔥 POLLING
  const fetchOrdersSilently = useCallback(async () => {
    const data = await getMyOrders();
    return Array.isArray(data) ? data : [];
  }, []);

  const updateOrdersSilently = useCallback((data) => {
    setOrders(data);
  }, []);

  usePolling({
    fetchData: fetchOrdersSilently,
    onUpdate: updateOrdersSilently,
    interval: 3000,
    enabled: !loading,
  });

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

  const filteredOrders = orders.filter((order) => {
    const searchText = search.trim().toLowerCase();
    const orderId = String(order.id || "");

    const products = (order.items || [])
      .map((item) => item.productName || `Produto #${item.productId}`)
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !searchText ||
      orderId.includes(searchText) ||
      products.includes(searchText);

    const matchesStatus =
      !statusFilter ||
      normalizeStatus(order.status) === normalizeStatus(statusFilter);

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="client-page">
      <section className="client-hero">
        <div className="client-hero-inner">
          <h1>Seus pedidos</h1>
          <p>Visualize e acompanhe seus pedidos realizados na HazzeCury.</p>
        </div>
      </section>

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
              <option value="SHIPPED">Enviado</option>
              <option value="DELIVERED">Entregue</option>
              <option value="CANCELED">Cancelado</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="empty-box">
            <h3>Carregando pedidos...</h3>
          </div>
        ) : !orders.length ? (
          <div className="empty-box">
            <h3>Nenhum pedido cadastrado.</h3>
          </div>
        ) : !filteredOrders.length ? (
          <div className="empty-box">
            <h3>Nenhum pedido encontrado.</h3>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-card-header">
                  <div>
                    <h3>Pedido #{order.id}</h3>

                    <p
                      className={`order-status ${getStatusClass(order.status)}`}
                    >
                      {formatStatus(order.status)}
                    </p>
                  </div>

                  <strong>{formatPrice(order.total || 0)}</strong>
                </div>

                <div className="order-items">
                  {(order.items || []).map((item, index) => (
                    <div className="order-item" key={index}>
                      <span>
                        {item.productName || `Produto #${item.productId}`}
                      </span>

                      <small>
                        {item.quantity || 1}x —{" "}
                        {formatPrice(item.unitPrice || item.price || 0)}
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
          </div>
        )}
      </section>
    </main>
  );
}