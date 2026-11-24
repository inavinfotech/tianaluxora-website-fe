import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { getPath } from "../utils/paths";
import {
  ShoppingBag,
  X,
  Trash2,
  Truck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const FREE_SHIPPING_THRESHOLD = 999;

const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const goToShop = () => {
    setIsCartOpen(false);
    navigate(getPath("/shop"));
  };

  const goToCheckout = () => {
    setIsCartOpen(false);
    if (user) navigate(getPath("/cart"));
    else navigate(getPath("/login"), { state: { from: getPath("/cart") } });
  };


  // Lock body scroll and listen for ESC key when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          setIsCartOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isCartOpen, setIsCartOpen]);

  const freeShippingProgress = Math.min(
    100,
    (cartTotal / FREE_SHIPPING_THRESHOLD) * 100
  );
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);

  return (
    <div
      className={`fixed inset-0 z-[200] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isCartOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
      }`}
      aria-hidden={!isCartOpen}
    >
      {/* Overlay Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div
          className={`w-screen max-w-md h-full flex flex-col bg-white shadow-[-20px_0_50px_rgba(131,37,78,0.18)] border-l border-primary/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-primary/10 bg-[#faf6f4] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag size={20} className="text-primary" />
              <h2 className="text-xl font-serif font-bold text-primary">
                Your Selection
              </h2>
              <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-9 h-9 rounded-full bg-white border border-primary/10 flex items-center justify-center text-primary/70 hover:text-primary hover:bg-neutral-100 transition-colors cursor-pointer shadow-xs"
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-[#f7ece8]/60 px-6 py-3 border-b border-primary/10">
            <div className="flex items-center justify-between text-xs font-semibold text-primary mb-1.5">
              <div className="flex items-center gap-1.5">
                <Truck size={14} className="text-primary" />
                <span>
                  {amountNeeded === 0 ? (
                    <strong className="text-emerald-700">
                      ✨ Unlocked Free Express Shipping!
                    </strong>
                  ) : (
                    <>
                      Add <strong>₹{amountNeeded}</strong> for Free Delivery
                    </>
                  )}
                </span>
              </div>
              <span className="text-[10px] font-bold text-primary/60">
                {Math.round(freeShippingProgress)}%
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-1.5 overflow-hidden shadow-inner border border-primary/10">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Body content */}
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-[#faf6f4] rounded-full flex items-center justify-center text-primary/50 mb-4 border border-primary/10 shadow-xs">
                  <ShoppingBag size={34} />
                </div>
                <h3 className="font-serif text-xl font-bold text-primary mb-2">
                  Your bag is empty
                </h3>
                <p className="text-xs text-primary/60 max-w-xs mb-6 leading-relaxed">
                  Explore our handcrafted fragrances and discover your signature scent.
                </p>
                <button
                  onClick={goToShop}
                  style={{ backgroundColor: "#83254e", color: "#ffffff" }}
                  className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  Explore Fragrances
                </button>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-primary/5">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}_${item.variant_id || "base"}`}
                    className="pt-4 first:pt-0 flex gap-4 group"
                  >
                    <div className="w-20 h-24 bg-[#faf6f4] rounded-xl shrink-0 overflow-hidden border border-primary/10 shadow-xs">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-serif font-bold text-sm text-primary truncate">
                            {item.name}
                          </h3>
                          <button
                            onClick={() =>
                              removeFromCart(item.id, item.variant_id)
                            }
                            className="text-primary/40 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <p className="text-[11px] text-primary/60 font-medium mt-0.5">
                          {item.selectedSize || "Standard Edition"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-primary/20 rounded-lg bg-white overflow-hidden shadow-xs">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.variant_id,
                                item.quantity - 1
                              )
                            }
                            className="px-2.5 py-1 text-xs font-bold hover:bg-neutral-100 text-primary transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 py-1 text-xs font-bold text-primary min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.variant_id,
                                item.quantity + 1
                              )
                            }
                            className="px-2.5 py-1 text-xs font-bold hover:bg-neutral-100 text-primary transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <span className="price font-bold text-base text-primary">
                          ₹{((parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0) * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}


          </div>

          {cartItems.length > 0 && (
            <div className="border-t border-primary/10 p-5 sm:p-6 bg-[#faf6f4] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-sm font-semibold text-primary/70">Subtotal</span>
                <span className="text-xl font-bold text-primary price">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-[11px] text-primary/55 mb-4">
                Coupons and delivery address on the next step.
              </p>

              <button
                type="button"
                onClick={goToCheckout}
                style={{ backgroundColor: "#83254e", color: "#ffffff" }}
                className="w-full py-4 rounded-xl font-bold tracking-widest uppercase shadow-md hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer text-xs flex items-center justify-center gap-2"
              >
                <span>{user ? "Checkout" : "Sign in & Checkout"}</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={goToShop}
                className="w-full mt-2.5 py-2.5 text-primary/70 hover:text-primary font-bold text-[11px] uppercase tracking-wider text-center transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>

              <div className="mt-3 pt-3 border-t border-primary/10 flex items-center justify-center gap-2 text-[10px] text-primary/60 font-semibold uppercase tracking-wider">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span>100% Authentic • Secure Razorpay Payment</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;

