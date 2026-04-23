import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store';

// Pages
import LandingPage from './pages/LandingPage';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/seller/SellerDashboard'
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import ShopPage from './pages/ShopPage';
import SellerProducts from './pages/seller/SellerProducts';
import SellerOrders from './pages/seller/SellerOrders';
import SellerAddProduct from './pages/seller/SellerAddProduct';
import SellerProfile from './pages/seller/SellerProfile';

// Guards
const BuyerRoute = ({ children }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== 'buyer') return <Navigate to="/seller/dashboard" replace />;
  return children;
};

const SellerRoute = ({ children }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== 'seller') return <Navigate to="/shop" replace />;
  return children;
};

export default function App() {
  const { token, fetchMe } = useAuthStore();
  useEffect(() => { if (token) fetchMe(); }, [token]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Buyer */}
      <Route path="/shop" element={<BuyerRoute><BuyerDashboard /></BuyerRoute>} />
      <Route path="/product/:id" element={<BuyerRoute><ProductPage /></BuyerRoute>} />
      <Route path="/cart" element={<BuyerRoute><CartPage /></BuyerRoute>} />
      <Route path="/checkout" element={<BuyerRoute><CheckoutPage /></BuyerRoute>} />
      <Route path="/orders" element={<BuyerRoute><OrdersPage /></BuyerRoute>} />
      <Route path="/wishlist" element={<BuyerRoute><WishlistPage /></BuyerRoute>} />

      {/* Seller */}
      <Route path="/seller/dashboard" element={<SellerRoute><SellerDashboard /></SellerRoute>} />
      <Route path="/seller/products" element={<SellerRoute><SellerProducts /></SellerRoute>} />
      <Route path="/seller/products/add" element={<SellerRoute><SellerAddProduct /></SellerRoute>} />
      <Route path="/seller/products/edit/:id" element={<SellerRoute><SellerAddProduct /></SellerRoute>} />
      <Route path="/seller/orders" element={<SellerRoute><SellerOrders /></SellerRoute>} />
      <Route path="/seller/profile" element={<SellerRoute><SellerProfile /></SellerRoute>} />

      {/* Public shop page */}
      <Route path="/store/:id" element={<ShopPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
