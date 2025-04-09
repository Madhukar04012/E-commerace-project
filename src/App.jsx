import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import { ReviewProvider } from "./context/ReviewContext";
import { AdminProvider } from "./context/AdminContext";
import mockProducts from "./data/mockProducts";

// Initialize Google Analytics
ReactGA.initialize("G-MEASUREMENT-ID"); // Replace with your actual Google Analytics ID

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

// Admin pages
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/Admin/Products"));
const AdminOrders = lazy(() => import("./pages/Admin/Orders"));
const AdminUsers = lazy(() => import("./pages/Admin/Users"));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  const location = useLocation();

  // Track page views when the location changes
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return (
    <AuthProvider>
      <CartProvider>
        <ReviewProvider>
          <AdminProvider>
            <SearchProvider products={mockProducts}>
              <div className="min-h-screen bg-gray-100">
                <Navbar />
                <main className="container mx-auto px-4 py-8 pt-20">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<Landing />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/confirmation" element={<Confirmation />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/search" element={<SearchResults />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      
                      {/* Admin Routes */}
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/products" element={<AdminProducts />} />
                      <Route path="/admin/orders" element={<AdminOrders />} />
                      <Route path="/admin/users" element={<AdminUsers />} />
                    </Routes>
                  </Suspense>
                </main>
              </div>
            </SearchProvider>
          </AdminProvider>
        </ReviewProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
