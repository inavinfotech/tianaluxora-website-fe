import { useEffect, useState, useRef, lazy, Suspense } from "react";
import Lenis from "lenis";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import SilkWaveBackground from "./components/SilkWaveBackground";
import Footer from "./components/Footer";
import DevAccessGate from "./components/DevAccessGate";
import LuxuryLoader from "./components/LuxuryLoader";
import { useAuth } from "./contexts/AuthContext";
import { useProducts } from "./contexts/ProductContext";
import { getPath } from "./utils/paths";

// Direct Storefront Page Imports (Preloaded upfront)
import Home from "./pages/Home";
import Products from "./pages/Products";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import StoryPage from "./pages/StoryPage";

// Lazy-loaded Admin Pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));

import CartDrawer from "./components/CartDrawer";

const LoadingFallback = () => <LuxuryLoader fullscreen={false} />;


function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const { loading: authLoading } = useAuth();
  const { products, loading: productsLoading } = useProducts();
  const [initialReady, setInitialReady] = useState(false);

  // Comprehensive upfront preloading before rendering storefront
  useEffect(() => {
    if (isAdminRoute) return;

    if (!authLoading && !productsLoading) {
      // Preload critical images and assets before revealing site
      const imagesToPreload = [
        "/images/big-bottle.webp",
        "/images/women-empowermwnt.webp",
        "/images/backgrounds/about-purpose.webp",
        ...(products || [])
          .slice(0, 8)
          .map((p) => p.image)
          .filter(Boolean),
      ];

      const preloadPromises = imagesToPreload.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      });

      Promise.race([
        Promise.all(preloadPromises),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]).then(() => {
        setTimeout(() => {
          setInitialReady(true);
        }, 150);
      });
    }
  }, [authLoading, productsLoading, products, isAdminRoute]);

  const lenisRef = useRef(null);

  // Scroll to top of window on every route change (synchronized with Lenis)
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true, force: true });
      } else if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true, force: true });
      }
    };

    // Immediate scroll reset
    scrollToTop();

    // Secondary reset on next animation frame and after microtasks to catch dynamic content mounts
    const frameId = requestAnimationFrame(scrollToTop);
    const timerId = setTimeout(scrollToTop, 60);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timerId);
    };
  }, [location.pathname, location.search]);

  // Lenis smooth scrolling (Initialized ONCE on mount)
  useEffect(() => {
    if (isAdminRoute) return;

    // Prevent browser from restoring scroll position on navigation
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      lenis.destroy();
      lenisRef.current = null;
      window.lenis = null;
    };
  }, [isAdminRoute]);

  // Admin routes bypass storefront layout
  if (isAdminRoute) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
            <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (!isAdminRoute && !initialReady) {
    return <LuxuryLoader fullscreen={true} />;
  }

  const isHomePage =
    location.pathname === "/" ||
    location.pathname === getPath("/") ||
    location.pathname === "";

  return (
    <ErrorBoundary>
      <DevAccessGate>
        {/* Silk Wave & CSS Gradient Background ONLY on Home Screen */}
        {isHomePage && (
          <>
            <div
              className="fixed inset-0 pointer-events-none -z-10"
              style={{ background: "var(--bg-gradient)" }}
            />
            <SilkWaveBackground
              fullscreen
              animated={true}
              opacity="0.3"
              showShimmer={true}
            />
          </>
        )}

        <div
          className={`min-h-screen min-h-[100dvh] flex flex-col justify-between w-full ${
            isHomePage ? "bg-transparent" : "bg-white"
          }`}
        >
          <Navbar />
          <CartDrawer />
          <main className="w-full flex-1">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Products />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                  path="/profile/*"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/story" element={<StoryPage />} />
                <Route path="/our-story" element={<StoryPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  }
                />


                {/* Global catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </DevAccessGate>
    </ErrorBoundary>
  );
}

export default App;


