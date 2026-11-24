import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { navLinks } from "../data/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { getPath } from "../utils/paths";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage =
    location.pathname === "/" ||
    location.pathname === getPath("/") ||
    location.pathname === "";

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
      navigate(getPath("/login"));
    }
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-100 transition-all duration-300 ${
          isHomePage
            ? scrolled
              ? "bg-[#faf6f4]/95 backdrop-blur-md shadow-xs border-b border-[rgba(131,37,78,0.1)]"
              : "bg-[#faf6f4]/85 backdrop-blur-sm border-b border-[rgba(131,37,78,0.06)]"
            : scrolled
            ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-[rgba(131,37,78,0.1)]"
            : "bg-white/90 backdrop-blur-sm border-b border-[rgba(131,37,78,0.06)]"
        }`}
      >
        {/* Luxury Top Announcement Bar */}
        <div className="bg-[#83254e] text-[#f7ece8] text-[10px] sm:text-[11px] py-1.5 px-4 text-center font-medium tracking-wider flex items-center justify-center gap-2 border-b border-white/10">
          <span>✨ Complimentary Luxury Vial with Every Order</span>
          <span className="hidden sm:inline">• Free Express Pan-India Delivery Above ₹999</span>
        </div>

        <nav className="max-w-[1400px] mx-auto px-4 md:px-8 py-3.5 md:py-4 flex justify-between items-center relative z-100">
          <Link
            to={getPath("/")}
            className="font-serif text-[1.4rem] md:text-[1.55rem] tracking-wider font-bold text-primary relative z-110 flex items-center"
          >
            <span>Tiana Luxora</span>
            <sup className="text-[0.55em] ml-1 text-primary/70 font-sans font-medium">TM</sup>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-9">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm tracking-wide font-medium relative hover:text-accent transition-colors hover:after:w-full after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-custom group"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions & Hamburger Row */}
          <div className="flex items-center gap-3.5 sm:gap-5 md:gap-6">
            {/* Cart, Profile Icons */}
            <div className="flex items-center gap-3.5 sm:gap-5 md:gap-6">
              {/* Cart Button -> Opens CartDrawer */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-primary flex items-center justify-center hover:-translate-y-0.5 hover:text-accent transition-custom relative cursor-pointer"
                aria-label="Open Cart"
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] sm:text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile / Auth Button */}
              <div className="relative group flex items-center">
                {user ? (
                  <div className="flex flex-col items-center cursor-pointer relative">
                    <Link
                      to={getPath("/profile")}
                      className="text-xs uppercase tracking-wider text-accent font-medium mb-0.5 hover:text-[#d49942] transition-colors max-w-[65px] truncate"
                    >
                      {(user.full_name || user.email || "U").split(" ")[0]}
                    </Link>
                    <button
                      onClick={handleAuthClick}
                      className="text-[9px] uppercase text-primary/60 hover:text-red-400"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAuthClick}
                    className="text-primary flex items-center justify-center hover:-translate-y-0.5 hover:text-accent transition-custom cursor-pointer"
                    title="Login"
                    aria-label="Account"
                  >
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Hamburger Menu Icon (Toggles side menu for pages only) */}
            <button
              className="lg:hidden text-primary relative z-110 p-1 flex items-center justify-center cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Spacer to prevent page content overlap under fixed header */}
      <div className="h-20 md:h-24" />


      {/* Mobile Menu Overlay (Dedicated for Pages Navigation Only) */}
      <div
        className={`fixed inset-0 bg-[#fff0f5] z-90 transition-transform duration-500 lg:hidden flex flex-col items-center justify-center pt-12 gap-8 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={() => setIsOpen(false)}
            className="text-[1.8rem] font-serif font-bold text-primary hover:text-accent transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </>
  );
};

export default Navbar;
