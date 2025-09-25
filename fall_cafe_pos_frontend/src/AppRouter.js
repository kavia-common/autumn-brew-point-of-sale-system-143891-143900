import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Layout/Header";
import Login from "./pages/Login";
import OrderTaking from "./pages/OrderTaking";
import MenuManagement from "./pages/MenuManagement";
import Payment from "./pages/Payment";
import SalesOverview from "./pages/SalesOverview";
import { useAuth } from "./context/AuthContext";

 // PUBLIC_INTERFACE
export default function AppRouter() {
  /**
   * App router with public (login) and protected routes.
   * Uses react-router-dom v6 with BrowserRouter as the top-level router.
   * Routes:
   * - /login (public)
   * - /orders, /menu, /payment, /sales (protected via RequireAuth)
   * Returns: JSX.Element
   */
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/orders" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/orders"
          element={
            <RequireAuth>
              <OrderTaking />
            </RequireAuth>
          }
        />
        <Route
          path="/menu"
          element={
            <RequireAuth>
              <MenuManagement />
            </RequireAuth>
          }
        />
        <Route
          path="/payment"
          element={
            <RequireAuth>
              <Payment />
            </RequireAuth>
          }
        />
        <Route
          path="/sales"
          element={
            <RequireAuth>
              <SalesOverview />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/orders" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
