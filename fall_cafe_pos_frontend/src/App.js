import React from 'react';
import './App.css';
import './theme.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import OrdersPage from './pages/OrdersPage';
import MenuPage from './pages/MenuPage';
import PaymentsPage from './pages/PaymentsPage';
import { OrderProvider } from './context/OrderContext';

/**
 * Root application shell following the classic layout:
 * - Header with navigation
 * - Left Sidebar for categories
 * - Main content: order tickets and menu
 * - Footer: order summary and payment actions
 */
function App() {
  return (
    <BrowserRouter>
      <OrderProvider>
        <div className="app-root">
          <Header />
          <div className="app-body">
            <Sidebar />
            <main id="main" className="app-main" role="main" aria-label="Content">
              <Routes>
                <Route path="/" element={<Navigate to="/orders" replace />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </OrderProvider>
    </BrowserRouter>
  );
}

export default App;
