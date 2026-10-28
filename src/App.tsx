import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { CartDrawer } from './components/cart/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, search]);
  return null;
};

// 404 Not Found Page
const NotFoundPage: React.FC = () => (
  <div className="max-w-xl mx-auto px-4 py-24 text-center">
    <h1 className="font-serif font-black text-5xl text-forest-950 mb-3">404</h1>
    <h2 className="font-serif font-bold text-2xl text-slate-800 mb-2">Page Not Found</h2>
    <p className="text-sm text-slate-500 mb-6">
      The traditional essential or page you are looking for does not exist.
    </p>
    <a
      href="/"
      className="px-6 py-3 bg-forest-900 text-white rounded-xl text-sm font-bold inline-flex items-center gap-2"
    >
      Return to Storefront
    </a>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-cream-100 text-slate-800">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <CartDrawer />
          <Toast />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
