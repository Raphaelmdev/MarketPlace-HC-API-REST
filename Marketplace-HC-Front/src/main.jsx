import React from "react";
import ReactDOM from "react-dom/client";
import { AppRoutes } from "@/routes/AppRoutes";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import "@/styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </ToastProvider>
  </React.StrictMode>
);