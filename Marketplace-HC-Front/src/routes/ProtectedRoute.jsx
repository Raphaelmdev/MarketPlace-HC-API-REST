import { Navigate, useLocation } from "react-router-dom";
import { getToken, getUser } from "@/utils/auth";

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const token    = getToken();
  const user     = getUser();

  if (!token || !user) {
    return (
      <Navigate
        to="/auth/identify"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}