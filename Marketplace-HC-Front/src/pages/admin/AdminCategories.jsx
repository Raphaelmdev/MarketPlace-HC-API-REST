import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory
} from "@/services/adminService";
import { useToast } from "@/context/ToastContext";
import { validateCategoryForm } from "@/utils/validations";
import "@/styles/pages/AdminPages.css";

const initialForm = {
  name: "",
  description: ""
};

export function AdminCategories() {
  const { showSuccess, showError } = useToast();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  async function loadCategories() {
    try {
      setLoading(true);

      const data = await getAdminCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      showError(err.message || "Erro ao carregar categorias.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function handleEdit(category) {
    setEditingId(category.id);

    setForm({
      name: category.name || "",
      description: category.description || ""
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = validateCategoryForm(form);
    const firstError = Object.values(errors)[0];

    if (firstError) {
      showError(firstError);
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim()
    };

    try {
      setSaving(true);

      if (editingId) {
        await updateCategory(editingId, payload);
        showSuccess("Categoria atualizada com sucesso.");
      } else {
        await createCategory(payload);
        showSuccess("Categoria cadastrada com sucesso.");
      }

      resetForm();
      await loadCategories();
    } catch (err) {
      showError(err.message || "Erro ao salvar categoria.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(categoryId) {
    const confirmed = window.confirm("Deseja realmente remover esta categoria?");
    if (!confirmed) return;

    try {
      await deleteCategory(categoryId);
      showSuccess("Categoria removida com sucesso.");
      await loadCategories();
    } catch (err) {
      showError(err.message || "Erro ao remover categoria.");
    }
  }

  const filteredCategories = categories.filter((category) => {
    const term = search.toLowerCase().trim();

    if (!term) return true;

    const name = category.name?.toLowerCase() || "";
    const description = category.description?.toLowerCase() || "";

    return name.includes(term) || description.includes(term);
  });

  if (loading) {
    return (
      <>
        <AdminHeader />

        <main className="admin-page">
          <p className="admin-loading">Carregando categorias...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminHeader />

      <main className="admin-page">
        <section className="admin-hero">
          <h1>Gerenciar Categorias</h1>
          <p>Cadastre, edite e remova categorias usadas nos produtos.</p>
        </section>

        <section className="admin-panel">
          <h2>{editingId ? "Editar categoria" : "Nova categoria"}</h2>

          <form className="admin-form" onSubmit={handleSubmit}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nome da categoria"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descrição da categoria"
              className="admin-full"
            />

            <div className="admin-actions admin-full">
              <button type="submit" disabled={saving}>
                {saving
                  ? "Salvando..."
                  : editingId
                    ? "Atualizar categoria"
                    : "Cadastrar categoria"}
              </button>

              {editingId && (
                <button type="button" className="secondary" onClick={resetForm}>
                  Cancelar edição
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Categorias cadastradas</h2>

            <div className="admin-filters">
              <input
                type="text"
                placeholder="Buscar categoria..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {!filteredCategories.length ? (
            <p className="admin-empty">
              {search
                ? "Nenhuma categoria encontrada para essa busca."
                : "Nenhuma categoria cadastrada."}
            </p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.description || "-"}</td>
                      <td>
                        <div className="table-actions">
                          <button onClick={() => handleEdit(category)}>
                            Editar
                          </button>

                          <button
                            className="danger"
                            onClick={() => handleDelete(category.id)}
                          >
                            Remover
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