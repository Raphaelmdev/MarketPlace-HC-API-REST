import { AdminHeader } from "@/components/AdminHeader";
import { useNavigate } from "react-router-dom";
import {
  MdInventory,
  MdCategory,
  MdPeople,
  MdReceiptLong,
  MdAdminPanelSettings,
  MdPerson // 🔥 NOVO
} from "react-icons/md";
import "@/styles/pages/AdminPages.css";

export function AdminArea() {
  const navigate = useNavigate();

  return (
    <>
      <AdminHeader />

      <main className="admin-page">
        <section className="admin-hero">
          <h1>Painel Administrativo</h1>
          <p>Gerencie produtos, categorias, usuários e pedidos da HazzeCury.</p>
        </section>

        <section className="admin-cards">

          {/* 🔥 PERFIL */}
          <button
            className="admin-card"
            onClick={() => navigate("/admin/profile")}
          >
            <MdPerson />
            <div>
              <h3>Seu perfil</h3>
              <p>Visualizar e atualizar seus dados.</p>
            </div>
          </button>

          <button
            className="admin-card"
            onClick={() => navigate("/admin/products")}
          >
            <MdInventory />
            <div>
              <h3>Produtos</h3>
              <p>Cadastrar, editar e remover produtos.</p>
            </div>
          </button>

          <button
            className="admin-card"
            onClick={() => navigate("/admin/categories")}
          >
            <MdCategory />
            <div>
              <h3>Categorias</h3>
              <p>Gerenciar categorias dos produtos.</p>
            </div>
          </button>

          <button
            className="admin-card"
            onClick={() => navigate("/admin/users")}
          >
            <MdPeople />
            <div>
              <h3>Usuários</h3>
              <p>Administrar contas e acessos.</p>
            </div>
          </button>

          <button
            className="admin-card"
            onClick={() => navigate("/admin/create-admin")}
          >
            <MdAdminPanelSettings />
            <div>
              <h3>Criar usuário administrador</h3>
              <p>Cadastrar uma nova conta com acesso administrativo.</p>
            </div>
          </button>

          <button
            className="admin-card"
            onClick={() => navigate("/admin/orders")}
          >
            <MdReceiptLong />
            <div>
              <h3>Pedidos</h3>
              <p>Acompanhar e atualizar pedidos.</p>
            </div>
          </button>

        </section>
      </main>
    </>
  );
}