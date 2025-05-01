import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import { ReviewProvider } from "./context/ReviewContext";
import { AdminProvider } from "./context/AdminContext";
import { ToastProvider } from "./context/ToastContext";
import mockProducts from "./data/mockProducts";

// Initialize Google Analytics with a try-catch block
try {
  ReactGA.initialize("G-MEASUREMENT-ID");
} catch (error) {
  console.error("Failed to initialize Google Analytics:", error);
}

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Confirmation = lazy(() => import("./pages/Confirmation"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Landing = lazy(() => import("./pages/Landing"));
const Profile = lazy(() => import("./pages/Profile"));

// Category pages
const Electronics = lazy(() => import("./pages/Electronics"));
const Furniture = lazy(() => import("./pages/Furniture"));
const Kitchen = lazy(() => import("./pages/Kitchen"));
const Accessories = lazy(() => import("./pages/Accessories"));
const Clothing = lazy(() => import("./pages/Clothing"));
const Fitness = lazy(() => import("./pages/Fitness"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/Admin/Products"));
const AdminOrders = lazy(() => import("./pages/Admin/Orders"));
const AdminUsers = lazy(() => import("./pages/Admin/Users"));

// Loading fallback with error handling
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  const location = useLocation();

  // Track page views when the location changes
  useEffect(() => {
    try {
      ReactGA.send({ hitType: "pageview", page: location.pathname });
    } catch (error) {
      console.error("Failed to send pageview to Google Analytics:", error);
    }
  }, [location]);

  // Auto-scroll to top on page change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <ReviewProvider>
            <AdminProvider>
              <SearchProvider products={mockProducts}>
                <ToastProvider>
                  <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
                    <ErrorBoundary>
                      <Navbar />
                    </ErrorBoundary>
                    <main className="flex-grow pt-16">
                      <ErrorBoundary>
                        <Suspense fallback={<LoadingFallback />}>
                          <div className="container mx-auto px-4 py-8">
                            <Routes>
                              <Route path="/" element={<Landing />} />
                              <Route path="/home" element={<Home />} />
                              <Route path="/shop" element={<Shop />} />
                              <Route path="/about" element={<About />} />
                              <Route path="/contact" element={<Contact />} />
                              <Route path="/cart" element={<Cart />} />
                              <Route path="/profile" element={
                                <ProtectedRoute>
                                  <Profile />
                                </ProtectedRoute>
                              } />
                              <Route path="/checkout" element={
                                <ProtectedRoute>
                                  <Checkout />
                                </ProtectedRoute>
                              } />
                              <Route path="/confirmation" element={
                                <ProtectedRoute>
                                  <Confirmation />
                                </ProtectedRoute>
                              } />
                              <Route path="/login" element={<Login />} />
                              <Route path="/signup" element={<Signup />} />
                              <Route path="/product/:id" element={<ProductDetail />} />
                              <Route path="/search" element={<SearchResults />} />
                              <Route path="/wishlist" element={
                                <ProtectedRoute>
                                  <Wishlist />
                                </ProtectedRoute>
                              } />
                              
                              {/* Category Routes */}
                              <Route path="/category/electronics" element={<Electronics />} />
                              <Route path="/category/furniture" element={<Furniture />} />
                              <Route path="/category/kitchen" element={<Kitchen />} />
                              <Route path="/category/accessories" element={<Accessories />} />
                              <Route path="/category/clothing" element={<Clothing />} />
                              <Route path="/category/fitness" element={<Fitness />} />
                              
                              {/* Admin Routes */}
                              <Route path="/admin" element={
                                <ProtectedRoute>
                                  <AdminDashboard />
                                </ProtectedRoute>
                              } />
                              <Route path="/admin/products" element={
                                <ProtectedRoute>
                                  <AdminProducts />
                                </ProtectedRoute>
                              } />
                              <Route path="/admin/orders" element={
                                <ProtectedRoute>
                                  <AdminOrders />
                                </ProtectedRoute>
                              } />
                              <Route path="/admin/users" element={
                                <ProtectedRoute>
                                  <AdminUsers />
                                </ProtectedRoute>
                              } />
                            </Routes>
                          </div>
                        </Suspense>
                      </ErrorBoundary>
                    </main>
                    <ErrorBoundary>
                      <Footer />
                    </ErrorBoundary>
                    <ScrollToTop />
                  </div>
                </ToastProvider>
              </SearchProvider>
            </AdminProvider>
          </ReviewProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
