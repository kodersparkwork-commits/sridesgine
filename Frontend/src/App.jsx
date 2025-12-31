import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CartProvider } from './contexts/CartContext';
import { AdminProvider } from './contexts/AdminContext';
import WhatsAppFloatButton from './components/WhatsAppFloatButton';

import ScrollToTopButton from './components/ScrollToTopButton';
import React, { useState, useEffect } from 'react';
// import './App.css'; // Removed for Redesign


import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import Welcome from './pages/Welcome';
import Footer from './components/Footer';
import Login from './pages/Login';
import SearchResults from './pages/SearchResults';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Earrings from './pages/Earrings';
import Necklaces from './pages/Necklaces';
import Pendants from './pages/Pendants';
import Rings from './pages/Rings';
import TempleJewellery from './pages/TempleJewellery';
import Bangles from './pages/Bangles';
import Sarees from './pages/Sarees';
import Dresses from './pages/Dresses';
import BestSellers from './pages/BestSellers';
import UserOrders from './pages/UserOrders';
import UserPage from './pages/UserPage';
import Shop from './pages/Shop';
import RefundPolicy from './pages/RefundPolicy';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ShippingPolicy from './pages/ShippingPolicy';




function MainLayout() {
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  // Provide a global function to open login modal
  window.openLoginModal = () => setShowLoginModal(true);
  window.closeLoginModal = () => setShowLoginModal(false);

  // Scroll to top on route change (open new pages from top)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.search]);
  return (
    <>

      {location.pathname === '/' && <Welcome />}
      <Navbar />
      {location.pathname !== '/' && (
        <div className="app">
          <Routes>
            {/* Home is rendered above Navbar conditionally; do not render here */}
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/earrings" element={<Earrings />} />
            <Route path="/necklaces" element={<Necklaces />} />
            <Route path="/pendants" element={<Pendants />} />
            <Route path="/rings" element={<Rings />} />
            <Route path="/temple-jewellery" element={<TempleJewellery />} />
            <Route path="/bangles" element={<Bangles />} />
            <Route path="/sarees" element={<Sarees />} />
            <Route path="/dresses" element={<Dresses />} />
            <Route path="/best-sellers" element={<BestSellers />} />
            <Route path="/my-orders" element={<UserOrders />} />
            <Route path="/user" element={<UserPage openLoginModal={window.openLoginModal} />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/shipping" element={<ShippingPolicy />} />
          </Routes>
        </div>
      )}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      {/* Floating actions */}
      <ScrollToTopButton />
      <WhatsAppFloatButton phoneNumber="919346680372" />
      <Footer />
    </>
  );
}

function AppRoutes() {
  return (
    <>
      <Router>
        <Routes>
          {/* Admin Routes - No Navbar */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          {/* Regular Routes - With Navbar */}
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </Router>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <WishlistProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </WishlistProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
