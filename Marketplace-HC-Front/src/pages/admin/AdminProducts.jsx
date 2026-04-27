import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import {
  createProduct,
  deleteProduct,
  getAdminCategories,
  getAdminProducts,
  updateProduct
} from "@/services/adminService";
import { useToast } from "@/context/ToastContext";
import { formatPrice, onlyNumbers } from "@/utils/format";
import { validateProductForm } from "@/utils/validations";
import "@/styles/pages/AdminPages.css";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  categoryId: "",
  active: true
};

export function AdminProducts() {
  const { showSuccess, showError } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    try {
      setLoading(true);

      const [productsData, categoriesData] = await Promise.all([
        getAdminProducts(),
        getAdminCategories()
      ]);

      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      showError(err.message || "Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handlePriceChange(e) {
    const numbers = onlyNumbers(e.target.value);

    setForm((prev) => ({
      ...prev,
      price: numbers ? formatPrice(Number(numbers) / 100) : ""
    }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function handleEdit(product) {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ? formatPrice(product.price) : "",
      stock: product.stock || "",
      imageUrl: product.imageUrl || "",
      categoryId: product.categoryId || product.category?.id || "",
      active: product.active ?? true
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = validateProductForm({
      ...form,
      price: Number(onlyNumbers(form.price)) / 100
    });

    const firstError = Object.values(errors)[0];

    if (firstError) {
      showError(firstError);
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(onlyNumbers(form.price)) / 100,
      stock: Number(form.stock || 0),
      imageUrl: form.imageUrl.trim(),
      categoryId: Number(form.categoryId),
      active: form.active
    };

    try {
      setSaving(true);

      if (editingId) {
        await updateProduct(editingId, payload);
        showSuccess("Produto atualizado com sucesso.");
      } else {
        await createProduct(payload);
        showSuccess("Produto cadastrado com sucesso.");
      }

      resetForm();
      await loadData();
    } catch (err) {
      showError(err.message || "Erro ao salvar produto.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(productId) {
    const confirmed = window.confirm("Deseja realmente remover este produto?");
    if (!confirmed) return;

    try {
      await deleteProduct(productId);
      showSuccess("Produto removido com sucesso.");
      await loadData();
    } catch (err) {
      showError(err.message || "Erro ao remover produto.");
    }
  }

  if (loading) {
    return (
      <>
        <AdminHeader />

        <main className="admin-page">
          <p className="admin-loading">Carregando produtos...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminHeader />

      <main className="admin-page">
        <section className="admin-hero">
          <h1>Gerenciar Produtos</h1>
          <p>Cadastre, edite e remova produtos da vitrine HazzeCury.</p>
        </section>

        <section className="admin-panel">
          <h2>{editingId ? "Editar produto" : "Novo produto"}</h2>

          <form className="admin-form" onSubmit={handleSubmit}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nome do produto"
            />

            <input
              name="price"
              value={form.price}
              onChange={handlePriceChange}
              placeholder="Preço"
              inputMode="numeric"
            />

            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              placeholder="Estoque"
            />

            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
            >
              <option value="">Selecione uma categoria</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              name="active"
              value={String(form.active)}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  active: e.target.value === "true"
                }))
              }
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>

            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="URL da imagem"
              className="admin-full"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descrição"
              className="admin-full"
            />

            <div className="admin-actions admin-full">
              <button type="submit" disabled={saving}>
                {saving
                  ? "Salvando..."
                  : editingId
                    ? "Atualizar produto"
                    : "Cadastrar produto"}
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
          <h2>Produtos cadastrados</h2>

          {!products.length ? (
            <p className="admin-empty">Nenhum produto cadastrado.</p>
          ) : (
            <div className="admin-table-wrapper products-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Preço</th>
                    <th>Estoque</th>
                    <th>Categoria</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{formatPrice(product.price)}</td>
                      <td>{product.stock ?? 0}</td>
                      <td>{product.categoryName || product.category?.name || "-"}</td>
                      <td>
                        <span
                          className={`admin-status ${
                            product.active ? "active" : "inactive"
                          }`}
                        >
                          {product.active ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button onClick={() => handleEdit(product)}>
                            Editar
                          </button>

                          <button
                            className="danger"
                            onClick={() => handleDelete(product.id)}
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