import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FloatingWhatsApp from './components/layout/FloatingWhatsApp';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import DealersPage from './pages/DealersPage';
import DashboardPage from './pages/DashboardPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MaintenanceTrackerPage from './pages/MaintenanceTrackerPage';
import WarrantyActivationPage from './pages/WarrantyActivationPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import OffersPage from './pages/OffersPage';
import AgenciesPage from './pages/AgenciesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Admin Imports
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminDealersPage from './pages/admin/AdminDealersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminWarrantiesPage from './pages/admin/AdminWarrantiesPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AdminAgenciesPage from './pages/admin/AdminAgenciesPage';
import AdminOffersPage from './pages/admin/AdminOffersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminHomePage from './pages/admin/AdminHomePage';

import DealerLayout from './components/layout/DealerLayout';
import DealerDashboardPage from './pages/dealer/DealerDashboardPage';
import DealerOrdersPage from './pages/dealer/DealerOrdersPage';
import DealerWarrantiesPage from './pages/dealer/DealerWarrantiesPage';

import LoginPage from './pages/LoginPage';

import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedAdminRoute = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  if (!user || user.role !== 'ADMIN') return <Navigate to="/login" replace />;
  return <Outlet />;
};

const ProtectedDealerRoute = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  if (!user || user.role !== 'DEALER') return <Navigate to="/login" replace />;
  return <Outlet />;
};

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
            {/* Unified Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes (Protected) */}
          <Route path="/admin" element={<ProtectedAdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="dealers" element={<AdminDealersPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="warranties" element={<AdminWarrantiesPage />} />
              <Route path="blog" element={<AdminBlogPage />} />
              <Route path="agencies" element={<AdminAgenciesPage />} />
              <Route path="offers" element={<AdminOffersPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="homepage" element={<AdminHomePage />} />
            </Route>
          </Route>

          {/* Dealer Routes (Protected) */}
          <Route path="/dealer" element={<ProtectedDealerRoute />}>
            <Route element={<DealerLayout />}>
              <Route index element={<DealerDashboardPage />} />
              <Route path="orders" element={<DealerOrdersPage />} />
              <Route path="warranties" element={<DealerWarrantiesPage />} />
            </Route>
          </Route>

          {/* Public Routes */}
          <Route path="/*" element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-1">
                <Suspense fallback={<Loader />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/dealers" element={<DealersPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-success" element={<OrderSuccessPage />} />
                    <Route path="/maintenance" element={<MaintenanceTrackerPage />} />
                    <Route path="/warranty" element={<WarrantyActivationPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:id" element={<BlogPostPage />} />
                    <Route path="/offers" element={<OffersPage />} />
                    <Route path="/agencies" element={<AgenciesPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                  </Routes>
                </Suspense>
              </div>
              <Footer />
              <FloatingWhatsApp />
            </div>
          } />
          </Routes>
        </BrowserRouter>
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
