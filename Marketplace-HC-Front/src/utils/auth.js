export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function isAuthenticated() {
  return !!getToken() && !!getUser();
}

export function hasRole(role) {
  const user = getUser();
  return user?.role === role;
}

export function hasAnyRole(...roles) {
  const user = getUser();
  return roles.includes(user?.role);
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.dispatchEvent(new Event("authChanged"));
}