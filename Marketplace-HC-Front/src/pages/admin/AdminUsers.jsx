import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import {
  deleteUser,
  getUsers,
  updateUserStatus
} from "@/services/adminService";
import { useToast } from "@/context/ToastContext";
import { formatCPF, formatPhone } from "@/utils/format";
import "@/styles/pages/AdminPages.css";

export function AdminUsers() {
  const { showSuccess, showError } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  function formatRole(role) {
    if (role === "ADMIN") return "ADMIN";
    if (role === "CLIENT") return "CLIENTE";
    return role || "-";
  }

  async function loadUsers() {
    try {
      setLoading(true);

      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      showError(err.message || "Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(user) {
    if (user.id === loggedUser?.id && user.active) {
      showError("Você não pode desativar sua própria conta.");
      return;
    }

    try {
      setUpdatingUserId(user.id);

      await updateUserStatus(user.id, !user.active);

      showSuccess(
        user.active
          ? "Usuário desativado com sucesso."
          : "Usuário ativado com sucesso."
      );

      await loadUsers();
    } catch (err) {
      showError(err.message || "Erro ao atualizar status do usuário.");
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function handleDelete(user) {
    if (user.id === loggedUser?.id) {
      showError("Você não pode remover sua própria conta.");
      return;
    }

    const confirmed = window.confirm("Deseja realmente remover este usuário?");
    if (!confirmed) return;

    try {
      setDeletingUserId(user.id);

      await deleteUser(user.id);

      showSuccess("Usuário removido com sucesso.");
      await loadUsers();
    } catch (err) {
      showError(err.message || "Erro ao remover usuário.");
    } finally {
      setDeletingUserId(null);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <>
        <AdminHeader />

        <main className="admin-page">
          <p className="admin-loading">Carregando usuários...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminHeader />

      <main className="admin-page">
        <section className="admin-hero">
          <h1>Gerenciar Usuários</h1>
          <p>Visualize clientes, administradores e gerencie o status das contas.</p>
        </section>

        <section className="admin-panel">
          <h2>Usuários cadastrados</h2>

          {!users.length ? (
            <p className="admin-empty">Nenhum usuário cadastrado.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>CPF</th>
                    <th>Perfil</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    const isLoggedUser = user.id === loggedUser?.id;

                    return (
                      <tr key={user.id}>
                        <td>{user.name || "-"}</td>
                        <td>{user.email || "-"}</td>
                        <td>{user.phone ? formatPhone(user.phone) : "-"}</td>
                        <td>{user.cpf ? formatCPF(user.cpf) : "-"}</td>
                        <td>{formatRole(user.role)}</td>
                        <td>
                          <span
                            className={`admin-status ${
                              user.active ? "active" : "inactive"
                            }`}
                          >
                            {user.active ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              onClick={() => handleToggleStatus(user)}
                              disabled={
                                updatingUserId === user.id ||
                                (isLoggedUser && user.active)
                              }
                              title={
                                isLoggedUser
                                  ? "Você não pode desativar sua própria conta."
                                  : ""
                              }
                            >
                              {updatingUserId === user.id
                                ? "Atualizando..."
                                : user.active
                                  ? "Desativar"
                                  : "Ativar"}
                            </button>

                            <button
                              className="danger"
                              onClick={() => handleDelete(user)}
                              disabled={deletingUserId === user.id || isLoggedUser}
                              title={
                                isLoggedUser
                                  ? "Você não pode remover sua própria conta."
                                  : ""
                              }
                            >
                              {deletingUserId === user.id
                                ? "Removendo..."
                                : "Remover"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}