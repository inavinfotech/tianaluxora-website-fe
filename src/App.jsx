import { useEffect } from 'react';
import Lenis from 'lenis';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import CollectionsPage from './pages/CollectionsPage';

function App() {
  useEffect(() => {
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
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_10%_20%,var(--accent)_0%,transparent_40%),radial-gradient(circle_at_90%_80%,var(--accent)_0%,transparent_40%)] blur-[80px]"></div>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/collections" element={<CollectionsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
