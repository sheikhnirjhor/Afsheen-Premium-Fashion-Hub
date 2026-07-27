import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import ChatWidget from './components/chat/ChatWidget';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import OrderHistory from './pages/OrderHistory';
import OrderTracking from './pages/OrderTracking';
import BookingGuidelines from './pages/BookingGuidelines';
import ReturnPolicy from './pages/ReturnPolicy';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ModeratorLogin from './pages/moderator/ModeratorLogin';
import ModeratorDashboard from './pages/moderator/ModeratorDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#1E3A5F',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              },
              success: {
                iconTheme: { primary: '#C9A84C', secondary: '#fff' },
              },
            }}
          />

          <Routes>
            {/* Public Routes with Layout */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/products" element={<Layout><Products /></Layout>} />
            <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
            <Route path="/cart" element={<Layout><Cart /></Layout>} />
            <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
            <Route path="/orders" element={<Layout><OrderHistory /></Layout>} />
            <Route path="/orders/:id" element={<Layout><OrderTracking /></Layout>} />
            <Route path="/booking-guidelines" element={<Layout><BookingGuidelines /></Layout>} />
            <Route path="/return-policy" element={<Layout><ReturnPolicy /></Layout>} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />

            {/* Moderator Routes */}
            <Route path="/moderator/login" element={<ModeratorLogin />} />
            <Route path="/moderator/dashboard" element={<ModeratorDashboard />} />
            <Route path="/moderator/*" element={<ModeratorDashboard />} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global Chat Widget */}
          <ChatWidget />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
