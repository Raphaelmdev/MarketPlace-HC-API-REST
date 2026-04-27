import { Navigate } from "react-router-dom";
import { getToken, getUser } from "@/utils/auth";

export function PublicRoute({ children }) {
   const token = getToken();
   const user = getUser();

   if (token && user) {
     if (user.role === "ADMIN") {
       return <Navigate to="/admin" replace />;
     }

     return <Navigate to="/home" replace />;
   }

  return children;
}