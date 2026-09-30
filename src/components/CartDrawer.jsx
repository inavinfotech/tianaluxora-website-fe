import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import AddressForm from "./AddressForm";
import { useCheckout } from "../hooks/useCheckout";
import THEME_COLORS from "../styles/theme";
import { getPath } from "../utils/paths";
import {
  ShoppingBag,
  X,
  Trash2,
  Truck,
  Sparkles,
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
  } = useCart();

  const {
    user,
    cartTotal,
    appliedCoupon,
    finalTotal,
    address,
    isAddressLoading,
    showAddressForm,
    setShowAddressForm,
    isAddressConfirmed,
    setIsAddressConfirmed,
    handleAddressSave,
    couponCode,
    setCouponCode,
    applyingCoupon,
    couponError,
    couponSuccess,
    handleApplyCoupon,
    handleRemoveCoupon,
    isProcessing,
    orderStatus,
    setOrderStatus,
    errorMessage,
    handleCheckout,
  } = useCheckout(() => setIsCartOpen(false));

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
          className={`w-screen max-w-md flex flex-col bg-white shadow-[-20px_0_50px_rgba(131,37,78,0.18)] border-l border-primary/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
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
                  onClick={() => {
                    setIsCartOpen(false);
                  }}
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
                        <span className="font-serif font-bold text-base text-primary">
                          ₹{typeof item.price === "number" ? item.price * item.quantity : item.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}


            {/* Address Section */}
            {user && (
              <div className="mt-6 border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs uppercase font-black text-primary/40 tracking-widest">
                    Delivery Address
                  </h3>
                  {address && !showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="text-[10px] font-bold text-accent hover:underline"
                    >
                      Change
                    </button>
                  )}
                </div>

                {isAddressLoading ? (
                  <div className="py-4 flex justify-center">
                    <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : showAddressForm ? (
                  <AddressForm
                    initialData={address || {}}
                    onSave={handleAddressSave}
                    onCancel={address ? () => setShowAddressForm(false) : null}
                    isProcessing={isProcessing}
                  />
                ) : address ? (
                  <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 relative group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-primary text-sm">
                          {address.full_name}
                        </p>
                        <p className="text-xs text-primary/60 mt-1">
                          {address.address_line}
                        </p>
                        <p className="text-xs text-primary/60">
                          {address.city}, {address.state} -{" "}
                          {address.postal_code}
                        </p>
                        <p className="text-xs text-primary/60 mt-1 font-medium">
                          {address.phone_number}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {!isAddressConfirmed ? (
                          <button
                            onClick={() => setIsAddressConfirmed(true)}
                            style={{
                              backgroundColor: "#d97398",
                              color: "white",
                            }}
                            className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm hover:scale-105 transition-transform"
                          >
                            Confirm
                          </button>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase tracking-widest">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                            Confirmed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full py-4 border-2 border-dashed border-neutral-200 rounded-2xl text-primary/40 font-bold text-[10px] uppercase tracking-widest hover:border-accent/40 hover:text-accent transition-all"
                  >
                    + Add Delivery Address
                  </button>
                )}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-primary">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex items-center justify-between mb-2 text-green-600 font-medium text-sm">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{appliedCoupon.discount_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600 font-medium">
                  Calculated at next step
                </span>
              </div>

              {/* Promo code input field */}
              {user && (
                <div className="mb-4 pt-3 border-t border-gray-200 flex flex-col gap-2 w-full">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/50">Promo Code</label>
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      placeholder="Promo Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      disabled={!!appliedCoupon}
                      className="bg-white border border-gray-200 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-accent uppercase flex-1 min-w-0 transition-all disabled:opacity-60"
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                        className="px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-sm hover:bg-red-700 active:scale-95 flex items-center justify-center gap-1 min-w-[70px]"
                      >
                        <span>✕</span>
                        <span>Remove</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon || !couponCode.trim()}
                        style={{
                          backgroundColor: applyingCoupon || !couponCode.trim() ? THEME_COLORS.disabled : THEME_COLORS.primary,
                          color: "#ffffff"
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer shrink-0 shadow-sm hover:opacity-90 active:scale-95 disabled:cursor-not-allowed flex items-center justify-center min-w-[70px]"
                      >
                        {applyingCoupon ? "..." : "Apply"}
                      </button>
                    )}
                  </div>
                  {couponError && (
                    <div className="flex items-center gap-1 text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-md text-[10px] font-semibold animate-fade-in">
                      <span>⚠️</span>
                      <span>{couponError}</span>
                    </div>
                  )}
                  {couponSuccess && (
                    <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md text-[10px] font-semibold animate-fade-in">
                      <span>✓</span>
                      <span>{couponSuccess}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-200">
                <span className="text-lg font-bold text-primary">Total</span>
                <span className="text-2xl font-bold text-accent font-serif">
                  ₹{finalTotal.toFixed(2)}
                </span>
              </div>

              {orderStatus === "error" && errorMessage && (
                <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between animate-fade-in">
                  <span>{errorMessage}</span>
                  <button
                    onClick={() => setOrderStatus(null)}
                    className="text-red-500 hover:text-red-700 font-bold ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleCheckout}
                  disabled={
                    isProcessing ||
                    orderStatus === "success" ||
                    (user && !isAddressConfirmed && !showAddressForm)
                  }
                  style={{
                    backgroundColor:
                      orderStatus === "success"
                        ? "#15803d"
                        : orderStatus === "error"
                          ? "#812d2d"
                          : user && !isAddressConfirmed && !showAddressForm
                            ? "#e5e5e5"
                            : THEME_COLORS.primary,
                    color:
                      user && !isAddressConfirmed && !showAddressForm
                        ? "#737373"
                        : "white",
                  }}
                  className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase transition-all duration-300 relative overflow-hidden group shadow-md disabled:cursor-not-allowed cursor-pointer text-xs`}
                >
                  <span className="relative z-10">
                    {isProcessing
                      ? "Processing..."
                      : orderStatus === "success"
                        ? "Order Placed!"
                        : orderStatus === "error"
                          ? "Retry Checkout"
                          : user
                            ? !isAddressConfirmed
                              ? "Confirm Address First"
                              : "Instant Checkout"
                            : "Login to Checkout"}
                  </span>
                  {!(isProcessing || orderStatus) && (
                    <div className="absolute inset-0 bg-white/15 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  )}
                </button>

                <Link
                  to={getPath("/cart")}
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 rounded-xl border border-primary/20 text-primary hover:bg-[#faf6f4] font-bold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Full Bag</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {orderStatus === "success" && (
                <p className="text-center text-green-600 mt-4 text-sm font-medium animate-pulse">
                  Redirecting to your profile...
                </p>
              )}

              <div className="mt-4 pt-3 border-t border-primary/10 flex items-center justify-center gap-2 text-[10px] text-primary/60 font-semibold uppercase tracking-wider">
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

