import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import OrdersPage from './pages/OrdersPage';
import MenuPage from './pages/MenuPage';
import SalesPage from './pages/SalesPage';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * PUBLIC_INTERFACE
 * App
 * Root application component setting up the router and primary routes.
 */
function App() {
  return (
    <div className="App" style={{ minHeight: '100vh' }}>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<OrdersPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/sales" element={<SalesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
}

export default App;
