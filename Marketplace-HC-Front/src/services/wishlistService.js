const API_URL = import.meta.env.VITE_API_URL;

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

export async function getWishlist() {
  const response = await fetch(`${API_URL}/client/wishlist`, {
    headers: getHeaders()
  });

  return handleResponse(response);
}

export async function addToWishlist(productId) {
  const response = await fetch(
    `${API_URL}/client/wishlist/items/${productId}`,
    {
      method: "POST",
      headers: getHeaders()
    }
  );

  return handleResponse(response);
}

export async function removeFromWishlist(productId) {
  const response = await fetch(
    `${API_URL}/client/wishlist/items/${productId}`,
    {
      method: "DELETE",
      headers: getHeaders()
    }
  );

  return handleResponse(response);
}