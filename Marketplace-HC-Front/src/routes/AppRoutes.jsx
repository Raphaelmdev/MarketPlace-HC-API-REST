import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { PublicRoute } from "@/routes/PublicRoute";
import { ROLES } from "@/constants/roles";

/* ROTAS PÚBLICAS */
import { Login } from "@/pages/public/Login";
import { Register } from "@/pages/public/Register";
import { Home } from "@/pages/public/Home";
import { ForgotPassword } from "@/pages/public/ForgotPassword";
import { ResetPassword } from "@/pages/public/ResetPassword";
import { IdentifyAccount } from "@/pages/public/IdentifyAccount";

/* ROTAS DE LOJA */
import { ClientCart } from "@/pages/shop/Cart";

/* ROTAS DO CLIENTE */
import { ClientAccount } from "@/pages/client/ClientAccount";
import { ClientOrders } from "@/pages/client/ClientOrders";
import { ClientProfile } from "@/pages/client/ClientProfile";
import { ClientAddress } from "@/pages/client/ClientAddress";
import { ClientWishlist } from "@/pages/client/ClientWishlist";

/* ROTAS ADMIN */
import { AdminProfile } from "@/pages/admin/AdminProfile";
import { AdminArea } from "@/pages/admin/AdminArea";
import { AdminProducts } from "@/pages/admin/AdminProducts";
import { AdminCategories } from "@/pages/admin/AdminCategories";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import { AdminOrders } from "@/pages/admin/AdminOrders";
import { AdminCreateUser } from "@/pages/admin/AdminCreateAdmin";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/home" element={<Home />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route path="/auth/identify" element={<IdentifyAccount />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/cart" element={<ClientCart />} />

        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
              <ClientAccount />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/orders"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
              <ClientOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/profile"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
              <ClientProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/address"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
              <ClientAddress />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/wishlist"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
              <ClientWishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminArea />
            </ProtectedRoute>
          }
        />
        <Route
           path="/admin/profile"
            element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminProfile />
            </ProtectedRoute>
         }
       />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminCategories />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create-admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminCreateUser />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}