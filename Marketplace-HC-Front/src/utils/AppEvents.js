export const APP_EVENTS = {
  AUTH_CHANGED: "authChanged",
  CART_CHANGED: "cartChanged",
  ORDERS_CHANGED: "ordersChanged",
  PRODUCTS_CHANGED: "productsChanged",
  USERS_CHANGED: "usersChanged",
  CATEGORIES_CHANGED: "categoriesChanged",
};

export function emitAppEvent(eventName, detail = null) {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

export function listenAppEvent(eventName, callback) {
  window.addEventListener(eventName, callback);

  return () => {
    window.removeEventListener(eventName, callback);
  };
}