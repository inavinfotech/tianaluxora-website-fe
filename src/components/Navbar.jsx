import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { navLinks } from "../data/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { setIsCartOpen, cartCount } = useCart();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
      navigate("/login");
    }
  };

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
      <nav className="flex justify-between items-center py-4 border-b border-[rgba(61,26,26,0.1)] mb-8 animate-fade-in relative z-100">
        <Link
          to="/"
          className="font-serif text-[1.4rem] md:text-[1.5rem] tracking-wider font-bold relative z-110"
        >
          Tiana Luxora<sup>TM</sup>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-base font-normal relative hover:after:w-full after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-custom group"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex gap-6">
            <button className="text-primary flex items-center justify-center hover:-translate-y-0.5 hover:text-accent transition-custom">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-primary flex items-center justify-center hover:-translate-y-0.5 hover:text-accent transition-custom relative"
            >
              <svg
                width="22"
                height="22"
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
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="relative group flex items-center">
              {user ? (
                <div className="flex flex-col items-center cursor-pointer relative">
                  <Link
                    to="/profile"
                    className="text-xs uppercase tracking-wider text-accent font-medium mb-1 hover:text-[#d49942] transition-colors"
                  >
                    {(user.full_name || user.email || "U").split(" ")[0]}
                  </Link>
                  <button
                    onClick={handleAuthClick}
                    className="text-[10px] uppercase text-primary/60 hover:text-red-400 absolute -bottom-4"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className="text-primary flex items-center justify-center hover:-translate-y-0.5 hover:text-accent transition-custom"
                  title="Login"
                >
                  <svg
                    width="22"
                    height="22"
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

          {/* Hamburger Menu Icon */}
          <button
            className="lg:hidden text-primary relative z-110"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <svg
              width="28"
              height="28"
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

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#fff5f0] z-90 transition-transform duration-500 lg:hidden flex flex-col items-center justify-center pt-12 gap-8 ${
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
        <div className="flex gap-8 mt-4">
          <button className="text-primary scale-125">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-primary scale-125 relative"
          >
            <svg
              width="24"
              height="24"
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
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[8px] font-bold rounded-full w-3 h-3 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              user ? navigate("/profile") : navigate("/login");
            }}
            className={`scale-125 ${user ? "text-accent" : "text-primary"}`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
