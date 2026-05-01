import { Navigate } from "react-router-dom";
import { getToken, getUser } from "@/utils/auth";
import { ROLES } from "@/utils/roles";

export function PublicRoute({ children }) {
  const token = getToken();
  const user = getUser();

  if (token && user) {
    if (user.role === ROLES.ADMIN) {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === ROLES.CLIENT) {
      return <Navigate to="/client" replace />;
    }
  }

  return children;
}