function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("expiresAt");
}

export function logout() {
  clearSession();
  window.dispatchEvent(new Event("authChanged"));
}

export function isSessionValid() {
  const token = localStorage.getItem("token");
  const expiresAt = localStorage.getItem("expiresAt");

  if (!token || !expiresAt) {
    clearSession(); // ❌ não dispara evento aqui
    return false;
  }

  if (Date.now() > Number(expiresAt)) {
    clearSession(); // ❌ não dispara evento aqui
    return false;
  }

  return true;
}

export function getToken() {
  if (!isSessionValid()) return null;

  return localStorage.getItem("token");
}

export function getUser() {
  if (!isSessionValid()) return null;

  const user = localStorage.getItem("user");

  try {
    return user ? JSON.parse(user) : null;
  } catch {
    clearSession(); // ❌ sem evento
    return null;
  }
}