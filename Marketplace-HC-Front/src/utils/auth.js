export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return !!getToken() && !!getUser();
}

export function hasRole(role) {
  const user = getUser();
  return user?.role === role;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}