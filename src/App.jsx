import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { SearchModal } from './components/common/SearchModal';
import { QuickViewModal } from './components/common/QuickViewModal';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { WishlistPage } from './pages/WishlistPage';
import { AuthPage } from './pages/AuthPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';

const AppContent = () => {
  const { currentPage } = useShop();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'auth':
        return <AuthPage />;
      case 'about':
        return <AboutPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF8] text-slate-900 font-sans">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Page Body */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Global Modals & Notifications */}
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <ToastContainer />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
