import { useEffect } from "react";
import Lenis from "lenis";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import CollectionsPage from "./pages/CollectionsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import UnderMaintenance from "./pages/UnderMaintenance";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

// Admin Imports
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";

function App() {
  const isUnderDevelopment = import.meta.env.VITE_UNDER_DEVELOPMENT === "true";
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Scroll to top of window on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    if (isAdminRoute) return;

    // Only initialize Lenis if we are not on the maintenance page
    const shouldShowMaintenance = isUnderDevelopment && !location.pathname.startsWith("/dev");
    if (shouldShowMaintenance) return;

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
    };
  }, [isUnderDevelopment, location.pathname, isAdminRoute]);

  // Admin routes bypass under maintenance check and default storefront layout
  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // Logic for Under Development mode for storefront
  if (isUnderDevelopment) {
    if (!location.pathname.startsWith("/dev")) {
      return <UnderMaintenance />;
    }
  } else {
    if (location.pathname.startsWith("/dev")) {
      return <Navigate to="/" replace />;
    }
  }

  const routePrefix = isUnderDevelopment ? "/dev" : "";

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_10%_20%,var(--accent)_0%,transparent_40%),radial-gradient(circle_at_90%_80%,var(--accent)_0%,transparent_40%)] blur-[80px]"></div>
      <Navbar />
      <main>
        <Routes>
          <Route path={`${routePrefix}/`} element={<Home />} />
          <Route path={`${routePrefix}/shop`} element={<Products />} />
          <Route
            path={`${routePrefix}/collections`}
            element={<CollectionsPage />}
          />
          <Route path={`${routePrefix}/login`} element={<LoginPage />} />
          <Route path={`${routePrefix}/signup`} element={<SignupPage />} />
          <Route path={`${routePrefix}/profile/*`} element={<ProfilePage />} />
          <Route path={`${routePrefix}/about`} element={<AboutPage />} />
          <Route path={`${routePrefix}/contact`} element={<ContactPage />} />
          <Route
            path={`${routePrefix}/product/:productId`}
            element={<ProductDetail />}
          />
          <Route path={`${routePrefix}/cart`} element={<CartPage />} />
          <Route path={`${routePrefix}/orders`} element={<OrdersPage />} />
          <Route path={`${routePrefix}/order/:orderId`} element={<OrderDetailPage />} />

          {/* Catch all for invalid routes within the app context prefix */}
          <Route
            path={`${routePrefix}/*`}
            element={<Navigate to={isUnderDevelopment ? "/dev" : "/"} replace />}
          />

          {/* Global catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
