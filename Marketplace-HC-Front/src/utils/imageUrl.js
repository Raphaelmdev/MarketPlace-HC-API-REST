const API_URL = import.meta.env.VITE_API_URL;

export function getImageUrl(imageUrl) {
  if (!imageUrl) return null;

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${API_URL}${imageUrl}`;
}