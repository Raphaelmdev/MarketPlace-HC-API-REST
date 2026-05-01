export const ROLES = {
  ADMIN:  "ADMIN",
  CLIENT: "CLIENT",
};

export const ROLE_LABELS = {
  ADMIN:  "Administrador",
  CLIENT: "Cliente",
};

export function getRoleLabel(role) {
  return ROLE_LABELS[role] ?? role;
}

export function isAdmin(user) {
  return user?.role === ROLES.ADMIN;
}

export function isClient(user) {
  return user?.role === ROLES.CLIENT;
}