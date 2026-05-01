const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse(response, defaultMessage = "Erro na requisição.") {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || defaultMessage);
  }

  return data;
}

export async function getProducts(filters = {}) {
  const params = new URLSearchParams();

  if (filters.name) params.append("name", filters.name);
  if (filters.categoryId) params.append("categoryId", filters.categoryId);
  if (filters.minPrice) params.append("minPrice", filters.minPrice);
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
  if (filters.sort) params.append("sort", filters.sort);

  const query = params.toString();

  const url = query
    ? `${API_URL}/products/filter?${query}`
    : `${API_URL}/products/filter`;

  const response = await fetch(url);

  return handleResponse(response, "Erro ao buscar produtos.");
}

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`);

  return handleResponse(response, "Erro ao buscar categorias.");
}