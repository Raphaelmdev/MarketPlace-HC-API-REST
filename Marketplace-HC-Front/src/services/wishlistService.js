const API_URL = import.meta.env.VITE_API_URL;

function getHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getWishlist() {
  const response = await fetch(`${API_URL}/client/wishlist`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao buscar wishlist");

  return response.json();
}

export async function addToWishlist(productId) {
  const response = await fetch(
    `${API_URL}/client/wishlist/items/${productId}`,
    {
      method: "POST",
      headers: getHeaders(),
    }
  );

  if (!response.ok) throw new Error("Erro ao adicionar");
}

export async function removeFromWishlist(productId) {
  const response = await fetch(
    `${API_URL}/client/wishlist/items/${productId}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  if (!response.ok) throw new Error("Erro ao remover");
}