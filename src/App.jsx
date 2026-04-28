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
import CartDrawer from "./components/CartDrawer";
import UnderMaintenance from "./pages/UnderMaintenance";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import AboutPage from "./pages/AboutPage";

function App() {
  const isUnderDevelopment = import.meta.env.VITE_UNDER_DEVELOPMENT === "true";
  const location = useLocation();

  useEffect(() => {
    // Only initialize Lenis if we are not on the maintenance page
    if (
      isUnderDevelopment &&
      (location.pathname === "/" || !location.pathname.startsWith("/dev"))
    )
      return;

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
  }, [isUnderDevelopment, location.pathname]);

  const routePrefix = isUnderDevelopment ? "/dev" : "";
  const getPath = (path) => `${routePrefix}${path === "/" ? "" : path}`;

  // Logic for Under Development mode
  if (isUnderDevelopment) {
    // If we are at the root or anywhere that isn't /dev, show UnderMaintenance
    if (location.pathname === "/" || !location.pathname.startsWith("/dev")) {
      return <UnderMaintenance />;
    }
  } else {
    // If NOT under development, but someone tries to access /dev, redirect them to root
    if (location.pathname.startsWith("/dev")) {
      return <Navigate to="/" replace />;
    }
  }

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
          <Route
            path={`${routePrefix}/product/:productId`}
            element={<ProductDetail />}
          />
          <Route path={`${routePrefix}/cart`} element={<CartPage />} />

          {/* Catch all for invalid routes within the app context prefix */}
          <Route
            path={`${routePrefix}/*`}
            element={<Navigate to={getPath("/")} replace />}
          />
          {/* Global catch all (redundant due to early return but good for safety) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
