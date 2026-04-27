import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import {
  deleteOrder,
  getAllOrders,
  updateOrderStatus
} from "@/services/adminService";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/utils/format";
import "@/styles/pages/AdminPages.css";

const ORDER_STATUSES = [
  { value: "PENDING", label: "Pendente" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELED", label: "Cancelado" }
];

export function AdminOrders() {
  const { showSuccess, showError } = useToast();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  function formatStatus(status) {
    const found = ORDER_STATUSES.find((item) => item.value === status);
    return found?.label || status || "Pendente";
  }

  function isValidStatus(status) {
    return ORDER_STATUSES.some((item) => item.value === status);
  }

  async function loadOrders() {
    try {
      setLoading(true);

      const data = await getAllOrders(search.trim());
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      showError(err.message || "Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleChangeStatus(orderId, status) {
    if (!isValidStatus(status)) {
      showError("Status de pedido inválido.");
      return;
    }

    try {
      setUpdatingOrderId(orderId);

      await updateOrderStatus(orderId, status);

      showSuccess("Status do pedido atualizado com sucesso.");
      await loadOrders();
    } catch (err) {
      showError(err.message || "Erro ao atualizar status do pedido.");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  async function handleDelete(orderId) {
    const confirmed = window.confirm("Deseja realmente remover este pedido?");
    if (!confirmed) return;

    try {
      setDeletingOrderId(orderId);

      await deleteOrder(orderId);

      showSuccess("Pedido removido com sucesso.");
      await loadOrders();
    } catch (err) {
      showError(err.message || "Erro ao remover pedido.");
    } finally {
      setDeletingOrderId(null);
    }
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      loadOrders();
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <>
      <AdminHeader />

      <main className="admin-page">
        <section className="admin-hero">
          <h1>Gerenciar Pedidos</h1>
          <p>Acompanhe pedidos realizados e atualize o status de entrega.</p>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Pedidos cadastrados</h2>

            <input
              className="admin-search-input"
              type="text"
              placeholder="Buscar por nome, email ou CPF..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="admin-loading">Carregando pedidos...</p>
          ) : !orders.length ? (
            <p className="admin-empty">
              {search
                ? "Nenhum pedido encontrado para essa busca."
                : "Nenhum pedido cadastrado."}
            </p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Cliente</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Itens</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>

                      <td>
                        {order.userName ||
                          order.clientName ||
                          order.user?.name ||
                          order.userEmail ||
                          "-"}
                      </td>

                      <td>
                        <span
                          className={`admin-status status-${order.status?.toLowerCase()}`}
                        >
                          {formatStatus(order.status)}
                        </span>
                      </td>

                      <td>{formatPrice(order.total)}</td>

                      <td>
                        {(order.items || []).length > 0 ? (
                          <div className="admin-order-items">
                            {(order.items || []).map((item, index) => (
                              <span key={index}>
                                {item.productName || `Produto #${item.productId}`} —{" "}
                                {item.quantity}x
                              </span>
                            ))}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>
                        <div className="table-actions">
                          <select
                            value={order.status || "PENDING"}
                            disabled={updatingOrderId === order.id}
                            onChange={(e) =>
                              handleChangeStatus(order.id, e.target.value)
                            }
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>

                          <button
                            className="danger"
                            onClick={() => handleDelete(order.id)}
                            disabled={deletingOrderId === order.id}
                          >
                            {deletingOrderId === order.id
                              ? "Removendo..."
                              : "Remover"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}