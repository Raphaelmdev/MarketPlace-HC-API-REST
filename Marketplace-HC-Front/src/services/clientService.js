const API_URL = import.meta.env.VITE_API_URL;

function getHeaders() {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function handleResponse(response) {
  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Erro na requisição.");
  }

  return data;
}

/* ==============================
   PRODUCTS
================================= */

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
  return handleResponse(response);
}

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`);
  return handleResponse(response);
}

/* ==============================
   PROFILE
================================= */

export async function getMyProfile() {
  const response = await fetch(`${API_URL}/users/me`, {
    headers: getHeaders(),
  });

  return handleResponse(response);
}

export async function updateMyProfile(data) {
  const response = await fetch(`${API_URL}/users/me/profile`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function updateMyAddress(data) {
  const response = await fetch(`${API_URL}/users/me/address`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

/* ==============================
   CART
================================= */

export async function createCart() {
  const response = await fetch(`${API_URL}/carts`, {
    method: "POST",
    headers: getHeaders(),
  });

  return handleResponse(response);
}

export async function getMyCart() {
  const response = await fetch(`${API_URL}/carts/me`, {
    headers: getHeaders(),
  });

  return handleResponse(response);
}

export async function getMyCartItems() {
  const response = await fetch(`${API_URL}/carts/me/items`, {
    headers: getHeaders(),
  });

  return handleResponse(response);
}

export async function addMyCartItem(productId, quantity = 1) {
  const response = await fetch(`${API_URL}/carts/me/items`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });

  return handleResponse(response);
}

export async function updateCartItem(cartItemId, productId, quantity) {
  const response = await fetch(`${API_URL}/carts/items/${cartItemId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });

  return handleResponse(response);
}

export async function removeCartItem(cartItemId) {
  const response = await fetch(`${API_URL}/carts/items/${cartItemId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  return handleResponse(response);
}

export async function clearMyCart() {
  const response = await fetch(`${API_URL}/carts/me/items`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  return handleResponse(response);
}

/* ==============================
   ORDERS
================================= */

export async function createOrderFromCart() {
  const response = await fetch(`${API_URL}/orders/from-cart`, {
    method: "POST",
    headers: getHeaders(),
  });

  return handleResponse(response);
}

export async function getMyOrders() {
  const response = await fetch(`${API_URL}/orders/me`, {
    headers: getHeaders(),
  });

  return handleResponse(response);
}

export async function getMyOrderById(orderId) {
  const response = await fetch(`${API_URL}/orders/me/${orderId}`, {
    headers: getHeaders(),
  });

  return handleResponse(response);
}

export async function cancelMyOrder(orderId) {
  const response = await fetch(`${API_URL}/orders/me/${orderId}/cancel`, {
    method: "PATCH",
    headers: getHeaders(),
  });

  return handleResponse(response);
}