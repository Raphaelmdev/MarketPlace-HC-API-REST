import { useEffect, useState } from "react";
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

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

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

    if (user.role === "ADMIN") {
      showError("Não é permitido remover usuários administradores.");
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

  const filteredUsers = users.filter((user) => {
    const term = search.toLowerCase().trim();
    const numericTerm = search.replace(/\D/g, "");

    const userName = user.name?.toLowerCase() || "";
    const userEmail = user.email?.toLowerCase() || "";
    const userCpf = user.cpf?.replace(/\D/g, "") || "";
    const userPhone = user.phone?.replace(/\D/g, "") || "";

    const matchesSearch =
      !term ||
      userName.includes(term) ||
      userEmail.includes(term) ||
      (numericTerm && userCpf.includes(numericTerm)) ||
      (numericTerm && userPhone.includes(numericTerm));

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && user.active === true) ||
      (statusFilter === "INACTIVE" && user.active === false);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <>

        <main className="admin-page">
          <p className="admin-loading">Carregando usuários...</p>
        </main>
      </>
    );
  }

  return (
    <>

      <main className="admin-page">
        <section className="admin-hero">
          <h1>Gerenciar Usuários</h1>
          <p>Visualize clientes, administradores e gerencie o status das contas.</p>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Usuários cadastrados</h2>

            <div className="admin-filters">
              <input
                type="text"
                placeholder="Buscar Usuários..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Todos</option>
                <option value="ACTIVE">Ativos</option>
                <option value="INACTIVE">Inativos</option>
              </select>
            </div>
          </div>

          {!filteredUsers.length ? (
            <p className="admin-empty">Nenhum usuário encontrado.</p>
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
                    {filteredUsers.map((user) => {
                      const isLoggedUser = user.id === loggedUser?.id;
                      const isAdmin = user.role === "ADMIN";

                      return (
                        <tr key={user.id}>
                          
                          {/* NOME LIMPO */}
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

                          {/* AÇÕES */}
                          <td>
                            <div className="table-actions">

                              {/* ATIVAR/DESATIVAR */}
                              {!(isLoggedUser && user.active) && (
                                <button
                                  onClick={() => handleToggleStatus(user)}
                                  disabled={updatingUserId === user.id}
                                >
                                  {updatingUserId === user.id
                                    ? "Atualizando..."
                                    : user.active
                                    ? "Desativar"
                                    : "Ativar"}
                                </button>
                              )}

                              {/* REMOVER */}
                              {!isLoggedUser && !isAdmin && (
                                <button
                                  className="danger"
                                  onClick={() => handleDelete(user)}
                                  disabled={deletingUserId === user.id}
                                >
                                  {deletingUserId === user.id
                                    ? "Removendo..."
                                    : "Remover"}
                                </button>
                              )}

                              {/* 🔥 VOCÊ NA DIREITA */}
                              {isLoggedUser && (
                                <span className="self-badge right">Você</span>
                              )}

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