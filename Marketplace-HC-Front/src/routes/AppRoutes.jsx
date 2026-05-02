import { BrowserRouter, Navigate, Route, Routes, Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { PublicRoute } from "@/routes/PublicRoute";
import { ROLES } from "@/utils/roles";
import { getUser } from "@/utils/auth";

/* HEADERS */
import { ClientHeader } from "@/components/ClientHeader";
import { AdminHeader } from "@/components/AdminHeader";
import { StoreHeader } from "@/components/StoreHeader";

/* PÚBLICAS */
import { Home } from "@/pages/public/Home";
import { Login } from "@/pages/public/Login";
import { Register } from "@/pages/public/Register";
import { ForgotPassword } from "@/pages/public/ForgotPassword";
import { ResetPassword } from "@/pages/public/ResetPassword";
import { IdentifyAccount } from "@/pages/public/IdentifyAccount";

/* LOJA */
import { Products } from "@/pages/shop/Products";
import { ProductDetail } from "@/pages/shop/ProductDetail";
import { Cart } from "@/pages/shop/Cart";

/* CLIENTE */
import { ClientAccount } from "@/pages/client/ClientAccount";
import { ClientProfile } from "@/pages/client/ClientProfile";
import { ClientAddress } from "@/pages/client/ClientAddress";
import { ClientOrders } from "@/pages/client/ClientOrders";
import { ClientWishlist } from "@/pages/client/ClientWishlist";

/* ADMIN */
import { AdminArea } from "@/pages/admin/AdminArea";
import { AdminProfile } from "@/pages/admin/AdminProfile";
import { AdminProducts } from "@/pages/admin/AdminProducts";
import { AdminCategories } from "@/pages/admin/AdminCategories";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import { AdminOrders } from "@/pages/admin/AdminOrders";
import { AdminCreateUser } from "@/pages/admin/AdminCreateAdmin";
function ClientLayout() {
  return (
    <>
      <ClientHeader />
      <Outlet />
    </>
  );
}

function AdminLayout() {
  return (
    <>
      <AdminHeader />
      <Outlet />
    </>
  );
}

function CartLayout() {
  const user = getUser();

  if (user?.role === ROLES.ADMIN) {
    return <Navigate to="/admin" replace />;
  }

  const isClient = user?.role === ROLES.CLIENT;

  return (
    <>
      {isClient ? <ClientHeader /> : <StoreHeader />}
      <Cart />
    </>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartLayout />} />

        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/auth/identify" element={<IdentifyAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ClientAccount />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="address" element={<ClientAddress />} />
          <Route path="orders" element={<ClientOrders />} />
          <Route path="wishlist" element={<ClientWishlist />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminArea />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="create-admin" element={<AdminCreateUser />} />
        </Route>

        <Route path="/unauthorized" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}