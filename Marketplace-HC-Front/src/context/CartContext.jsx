import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getToken, getUser } from "@/utils/auth";
import {
  getMyCartItems,
  addMyCartItem,
  updateCartItem,
  removeCartItem,
  clearMyCart,
} from "@/services/clientService";

const CartContext = createContext(null);

const GUEST_CART_KEY = "cart_guest";

function getGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveGuestCart(items) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cartUpdated"));
}

function buildGuestCart(items) {
  const total = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  return {
    id: null,
    total,
    status: "GUEST",
    userId: null,
    items,
  };
}

function isAdminUser(user, token) {
  return !!token && user?.role === "ADMIN";
}

function isClientUser(user, token) {
  return !!token && user?.role === "CLIENT";
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loadingCart, setLoadingCart] = useState(false);

  const user = getUser();
  const isLogged = !!getToken() && !!user;

  async function loadCart() {
    const currentUser = getUser();
    const token = getToken();

    if (isAdminUser(currentUser, token)) {
      setCart(null);
      return;
    }

    if (!token || !currentUser) {
      setCart(buildGuestCart(getGuestCart()));
      return;
    }

    if (!isClientUser(currentUser, token)) {
      setCart(null);
      return;
    }

    try {
      setLoadingCart(true);

      const data = await getMyCartItems();

      const normalizedCart = Array.isArray(data)
        ? buildGuestCart(data)
        : {
            id: data?.id ?? null,
            total: Number(data?.total || 0),
            status: data?.status ?? "ACTIVE",
            userId: data?.userId ?? currentUser.id ?? null,
            items: data?.items || [],
          };

      setCart(normalizedCart);
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      setCart({
        id: null,
        total: 0,
        status: "ACTIVE",
        userId: currentUser?.id ?? null,
        items: [],
      });
    } finally {
      setLoadingCart(false);
    }
  }

  useEffect(() => {
    loadCart();

    function syncCart() {
      loadCart();
    }

    window.addEventListener("cartUpdated", syncCart);
    window.addEventListener("storage", syncCart);
    window.addEventListener("authChanged", syncCart);

    return () => {
      window.removeEventListener("cartUpdated", syncCart);
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("authChanged", syncCart);
    };
  }, []);

  async function addToCart(product) {
    const currentUser = getUser();
    const token = getToken();

    if (isAdminUser(currentUser, token)) {
      setCart(null);
      return false;
    }

    if (isClientUser(currentUser, token)) {
      try {
        await addMyCartItem(product.id, 1);
        await loadCart();
        window.dispatchEvent(new Event("cartUpdated"));
        return true;
      } catch (error) {
        console.error("Erro ao adicionar item ao carrinho:", error);
        return false;
      }
    }

    const currentItems = getGuestCart();
    const existingItem = currentItems.find((item) => item.id === product.id);
    const maxQty = product.stock ?? Infinity;

    let updatedItems;

    if (existingItem) {
      const nextQty = Number(existingItem.quantity || 1) + 1;

      if (nextQty > maxQty) return false;

      updatedItems = currentItems.map((item) =>
        item.id === product.id ? { ...item, quantity: nextQty } : item
      );
    } else {
      if (maxQty < 1) return false;

      updatedItems = [
        ...currentItems,
        {
          id: product.id,
          productId: product.id,
          name: product.name,
          productName: product.name,
          price: product.price,
          unitPrice: product.price,
          subTotal: product.price,
          imageUrl: product.imageUrl || product.image || "",
          stock: product.stock ?? null,
          quantity: 1,
        },
      ];
    }

    saveGuestCart(updatedItems);
    setCart(buildGuestCart(updatedItems));
    return true;
  }

  async function removeFromCart(productId) {
    const currentUser = getUser();
    const token = getToken();

    if (isAdminUser(currentUser, token)) {
      setCart(null);
      return false;
    }

    if (isClientUser(currentUser, token)) {
      const item = cart?.items?.find((i) => i.productId === productId || i.id === productId);

      if (!item?.id) return false;

      try {
        await removeCartItem(item.id);
        await loadCart();
        window.dispatchEvent(new Event("cartUpdated"));
        return true;
      } catch (error) {
        console.error("Erro ao remover item do carrinho:", error);
        return false;
      }
    }

    const updatedItems = getGuestCart().filter((item) => item.id !== productId);

    saveGuestCart(updatedItems);
    setCart(buildGuestCart(updatedItems));
    return true;
  }

  async function updateQuantity(productId, quantity) {
    if (quantity < 1) return false;

    const currentUser = getUser();
    const token = getToken();

    if (isAdminUser(currentUser, token)) {
      setCart(null);
      return false;
    }

    if (isClientUser(currentUser, token)) {
      const item = cart?.items?.find((i) => i.productId === productId || i.id === productId);

      if (!item?.id) return false;

      try {
        await updateCartItem(item.id, productId, quantity);
        await loadCart();
        window.dispatchEvent(new Event("cartUpdated"));
        return true;
      } catch (error) {
        console.error("Erro ao atualizar quantidade:", error);
        return false;
      }
    }

    const currentItems = getGuestCart();

    const updatedItems = currentItems.map((item) => {
      if (item.id !== productId) return item;

      return {
        ...item,
        quantity,
        subTotal: Number(item.price || item.unitPrice || 0) * quantity,
      };
    });

    saveGuestCart(updatedItems);
    setCart(buildGuestCart(updatedItems));
    return true;
  }

  async function clearCart() {
    const currentUser = getUser();
    const token = getToken();

    if (isAdminUser(currentUser, token)) {
      setCart(null);
      return false;
    }

    if (isClientUser(currentUser, token)) {
      try {
        await clearMyCart();
        await loadCart();
        window.dispatchEvent(new Event("cartUpdated"));
        return true;
      } catch (error) {
        console.error("Erro ao limpar carrinho:", error);
        return false;
      }
    }

    localStorage.removeItem(GUEST_CART_KEY);
    setCart(buildGuestCart([]));
    window.dispatchEvent(new Event("cartUpdated"));
    return true;
  }

  function clearGuestCart() {
    localStorage.removeItem(GUEST_CART_KEY);
    setCart(buildGuestCart([]));
    window.dispatchEvent(new Event("cartUpdated"));
  }

  async function migrateGuestCartToUserCart() {
    const currentUser = getUser();
    const token = getToken();

    if (!isClientUser(currentUser, token)) return false;

    const guestItems = getGuestCart();

    if (!guestItems.length) {
      await loadCart();
      return true;
    }

    try {
      for (const item of guestItems) {
        await addMyCartItem(item.id || item.productId, item.quantity || 1);
      }

      localStorage.removeItem(GUEST_CART_KEY);
      await loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
      return true;
    } catch (error) {
      console.error("Erro ao migrar carrinho visitante:", error);
      return false;
    }
  }

  function isInCart(productId) {
    return (cart?.items || []).some(
      (item) => item.productId === productId || item.id === productId
    );
  }

  function getItemQuantity(productId) {
    return (
      (cart?.items || []).find(
        (item) => item.productId === productId || item.id === productId
      )?.quantity ?? 0
    );
  }

  const cartCount = useMemo(
    () =>
      (cart?.items || []).reduce(
        (total, item) => total + Number(item.quantity || 1),
        0
      ),
    [cart]
  );

  const cartTotal = useMemo(() => Number(cart?.total || 0), [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        loadingCart,
        isLogged,
        user,
        loadCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearGuestCart,
        migrateGuestCartToUserCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider.");
  }

  return context;
}