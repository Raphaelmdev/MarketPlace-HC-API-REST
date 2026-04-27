import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const CART_KEY = "cart";

function getStoredCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getStoredCart());

    function syncCart() {
      setCart(getStoredCart());
    }

    window.addEventListener("cartUpdated", syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("cartUpdated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  function addToCart(product) {
    const currentCart = getStoredCart();

    const existingItem = currentCart.find((item) => item.id === product.id);

    let updatedCart;

    if (existingItem) {
      updatedCart = currentCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...currentCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl || product.image || "",
          quantity: 1
        }
      ];
    }

    setCart(updatedCart);
    saveCart(updatedCart);
  }

  function removeFromCart(productId) {
    const updatedCart = getStoredCart().filter((item) => item.id !== productId);

    setCart(updatedCart);
    saveCart(updatedCart);
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) return;

    const updatedCart = getStoredCart().map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );

    setCart(updatedCart);
    saveCart(updatedCart);
  }

  function clearCart() {
    setCart([]);
    saveCart([]);
  }

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      return total + Number(item.price || 0) * (item.quantity || 1);
    }, 0);
  }, [cart]);

  const value = {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider.");
  }

  return context;
}