const API_URL = "http://localhost:8080";

function getHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

async function handleResponse(response) {
  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Erro na requisição.");
  }

  return data;
}

// PRODUCTS
export async function getAdminProducts() {
  const response = await fetch(`${API_URL}/products/admin`, {
    headers: getHeaders()
  });

  return handleResponse(response);
}

export async function createProduct(data) {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });

  return handleResponse(response);
}

export async function updateProduct(productId, data) {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });

  return handleResponse(response);
}

export async function deleteProduct(productId) {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "DELETE",
    headers: getHeaders()
  });

  return handleResponse(response);
}

// CATEGORIES
export async function getAdminCategories() {
  const response = await fetch(`${API_URL}/categories`, {
    headers: getHeaders()
  });

  return handleResponse(response);
}

export async function createCategory(data) {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });

  return handleResponse(response);
}

export async function updateCategory(categoryId, data) {
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });

  return handleResponse(response);
}

export async function deleteCategory(categoryId) {
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: "DELETE",
    headers: getHeaders()
  });

  return handleResponse(response);
}

// USERS
export async function getUsers() {
  const response = await fetch(`${API_URL}/users`, {
    headers: getHeaders()
  });

  return handleResponse(response);
}

export async function getUserById(userId) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    headers: getHeaders()
  });

  return handleResponse(response);
}

export async function createAdminUser(data) {
  const response = await fetch(`${API_URL}/users/admin`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });

  return handleResponse(response);
}

export async function updateUserStatus(userId, active) {
  const response = await fetch(`${API_URL}/users/${userId}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ active })
  });

  return handleResponse(response);
}

export async function deleteUser(userId) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers: getHeaders()
  });

  return handleResponse(response);
}

// ORDERS
export async function getAllOrders(customer = "") {
  const query = customer.trim()
    ? `?customer=${encodeURIComponent(customer.trim())}`
    : "";

  const response = await fetch(`${API_URL}/orders${query}`, {
    headers: getHeaders()
  });

  return handleResponse(response);
}

export async function updateOrderStatus(orderId, status) {
  const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ status })
  });

  return handleResponse(response);
}

export async function deleteOrder(orderId) {
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    method: "DELETE",
    headers: getHeaders()
  });

  return handleResponse(response);
}