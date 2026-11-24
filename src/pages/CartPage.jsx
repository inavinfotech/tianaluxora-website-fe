import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { getPath } from "../utils/paths";
import AddressForm from "../components/AddressForm";
import { useCheckout, formatAddress } from "../hooks/useCheckout";
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  ShieldCheck,
  Truck,
  Check,
  AlertCircle,
  MapPin,
  Tag,
  Lock,
  Pencil,
} from "lucide-react";

const toPrice = (p) => parseFloat(String(p).replace(/[^0-9.]/g, "")) || 0;
const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const QtyStepper = ({ item, onChange }) => {
  const max = Number(item.stock) > 0 ? Number(item.stock) : Infinity;
  return (
    <div className="flex items-center bg-white rounded-full border border-primary/20 p-0.5 shadow-xs">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={item.quantity <= 1}
        onClick={() => onChange(item.quantity - 1)}
        className="w-8 h-8 flex items-center justify-center text-primary/70 hover:text-primary hover:bg-[#faf5f8] rounded-full transition-colors text-sm font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
      >
        −
      </button>
      <span className="w-7 text-center font-bold text-primary text-sm">{item.quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={item.quantity >= max}
        onClick={() => onChange(item.quantity + 1)}
        className="w-8 h-8 flex items-center justify-center text-primary/70 hover:text-primary hover:bg-[#faf5f8] rounded-full transition-colors text-sm font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );
};

const StepHeader = ({ n, title, done, action }) => (
  <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-primary/10 bg-[#faf5f8]/75">
    <div className="flex items-center gap-3">
      <span
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
          done ? "bg-emerald-600 text-white" : "bg-primary text-white"
        }`}
      >
        {done ? <Check size={14} strokeWidth={3} /> : n}
      </span>
      <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-primary">{title}</h2>
    </div>
    {action}
  </div>
);

const CartPage = () => {
  const { removeFromCart, updateQuantity } = useCart();
  const {
    user,
    cartItems,
    cartTotal,
    discount,
    appliedCoupon,
    finalTotal,
    address,
    isAddressLoading,
    isSavingAddress,
    addressError,
    showAddressForm,
    setShowAddressForm,
    handleAddressSave,
    couponCode,
    setCouponCode,
    applyingCoupon,
    couponError,
    handleApplyCoupon,
    handleRemoveCoupon,
    isProcessing,
    errorMessage,
    setErrorMessage,
    handleCheckout,
  } = useCheckout();

  const [showCoupon, setShowCoupon] = useState(false);
  const addressRef = useRef(null);
  const itemCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  // Bring the address step into view when the user is asked to fill it in
  useEffect(() => {
    if (errorMessage && !address && addressRef.current) {
      addressRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errorMessage, address]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70dvh] flex flex-col items-center justify-center text-center px-4 animate-fade-in bg-white">
        <div className="w-24 h-24 bg-[#faf5f8] rounded-full flex items-center justify-center text-primary mb-6 border border-primary/10 shadow-xs">
          <ShoppingBag size={40} className="text-primary/70" />
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-3">Your Bag is Empty</h1>
        <p className="text-primary/60 mb-8 max-w-md text-base leading-relaxed">
          Discover our curated collection of luxury fragrances crafted for timeless elegance.
        </p>
        <Link
          to={getPath("/shop")}
          style={{ backgroundColor: "#83254e", color: "#ffffff" }}
          className="px-9 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all shadow-md active:scale-95"
        >
          Explore Fragrances
        </Link>
      </div>
    );
  }

  const payLabel = isProcessing
    ? "Processing..."
    : !user
    ? "Sign in to Checkout"
    : !address
    ? "Add Delivery Address"
    : `Pay ${inr(finalTotal)} Securely`;

  const PayButton = ({ className = "" }) => (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={isProcessing || isSavingAddress}
      style={{ backgroundColor: "#83254e", color: "#ffffff" }}
      className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase transition-all shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer text-xs flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait ${className}`}
    >
      {user && address && !isProcessing && <Lock size={14} />}
      <span>{payLabel}</span>
    </button>
  );

  return (
    <div className="bg-white min-h-[100dvh] pb-32 lg:pb-24 pt-4 sm:pt-6 animate-fade-in w-full">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-3 border-b border-primary/10 pb-4 mb-6">
          <div>
            <span className="text-accent text-xs font-bold uppercase tracking-[0.25em] block mb-1">Secure Checkout</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary">Checkout</h1>
          </div>
          <Link
            to={getPath("/shop")}
            className="inline-flex items-center gap-1.5 text-primary/70 font-semibold text-xs sm:text-sm hover:text-primary transition-colors group shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Left: Steps */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Step 1: Address */}
            <section ref={addressRef} className="border border-primary/10 rounded-2xl bg-white overflow-hidden shadow-xs">
              <StepHeader
                n={1}
                title="Delivery Address"
                done={Boolean(user && address && !showAddressForm)}
                action={
                  user && address && !showAddressForm ? (
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(true)}
                      className="text-xs font-bold text-accent hover:underline uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Pencil size={12} /> Change
                    </button>
                  ) : null
                }
              />
              <div className="p-5 sm:p-6">
                {!user ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-sm text-primary/70">Sign in to use your saved address and complete your order.</p>
                    <Link
                      to={getPath("/login")}
                      state={{ from: getPath("/cart") }}
                      style={{ backgroundColor: "#83254e", color: "#ffffff" }}
                      className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center shadow-md shrink-0"
                    >
                      Sign In
                    </Link>
                  </div>
                ) : isAddressLoading ? (
                  <div className="py-4 flex justify-center">
                    <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : showAddressForm || !address ? (
                  <AddressForm
                    initialData={address || {}}
                    defaultName={user.full_name}
                    onSave={async (data) => {
                      const ok = await handleAddressSave(data);
                      if (ok) setErrorMessage("");
                    }}
                    onCancel={address ? () => setShowAddressForm(false) : null}
                    isProcessing={isSavingAddress}
                    serverError={addressError}
                  />
                ) : (
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-bold text-primary">{address.full_name}</p>
                      <p className="text-primary/70 mt-0.5 leading-snug">{formatAddress(address)}</p>
                      {address.phone_number && (
                        <p className="text-primary/60 mt-1 font-medium">+91 {address.phone_number}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Step 2: Items */}
            <section className="border border-primary/10 rounded-2xl bg-white overflow-hidden shadow-xs">
              <StepHeader n={2} title={`Review Items (${itemCount})`} />
              <div className="divide-y divide-primary/10">
                {cartItems.map((item) => {
                  const lineTotal = toPrice(item.price) * item.quantity;
                  return (
                    <div key={`${item.id}-${item.variant_id}`} className="p-4 sm:p-5 flex gap-4">
                      <Link
                        to={getPath(item.variant_id ? `/product/${item.id}?variant=${item.variant_id}` : `/product/${item.id}`)}
                        className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-[#faf5f8] shrink-0 border border-primary/10 block"
                      >
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-sm sm:text-base font-serif font-bold text-primary truncate capitalize">{item.name}</h3>
                            <p className="text-xs text-primary/60 font-medium mt-0.5">{item.selectedSize || "Standard Edition"}</p>
                            <p className="text-xs text-primary/60 mt-0.5">{inr(toPrice(item.price))} each</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id, item.variant_id)}
                            className="p-1.5 text-primary/40 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer -mt-1 -mr-1"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <QtyStepper item={item} onChange={(q) => updateQuantity(item.id, item.variant_id, q)} />
                          <span className="text-base price font-bold text-primary">{inr(lineTotal)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right: Summary */}
          <aside className="lg:col-span-5 xl:col-span-4 w-full">
            <div className="bg-[#faf5f8]/80 border border-primary/10 rounded-2xl p-5 sm:p-6 space-y-4 lg:sticky lg:top-28 shadow-xs">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-primary border-b border-primary/10 pb-3">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-primary/75">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                  <span className="text-primary font-bold">{inr(cartTotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center text-emerald-700 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Tag size={13} /> {appliedCoupon.code}
                      <button type="button" onClick={handleRemoveCoupon} className="text-[11px] text-primary/50 hover:text-red-600 underline ml-1 cursor-pointer">
                        remove
                      </button>
                    </span>
                    <span>−{inr(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-primary/75">
                  <span>Delivery</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>
              </div>

              {/* Coupon (collapsed by default) */}
              {user && !appliedCoupon && (
                <div className="border-t border-primary/10 pt-3">
                  {!showCoupon ? (
                    <button
                      type="button"
                      onClick={() => setShowCoupon(true)}
                      className="text-xs font-bold text-accent hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <Tag size={13} /> Have a coupon code?
                    </button>
                  ) : (
                    <form
                      className="space-y-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleApplyCoupon();
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          autoFocus
                          placeholder="ENTER CODE"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="bg-white border border-primary/20 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary uppercase flex-1 min-w-0"
                        />
                        <button
                          type="submit"
                          disabled={applyingCoupon || !couponCode.trim()}
                          style={{ backgroundColor: "#83254e", color: "#ffffff" }}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {applyingCoupon ? "..." : "Apply"}
                        </button>
                      </div>
                      {couponError && (
                        <p className="flex items-center gap-1.5 text-rose-700 text-xs font-semibold">
                          <AlertCircle size={13} /> {couponError}
                        </p>
                      )}
                    </form>
                  )}
                </div>
              )}

              <div className="flex justify-between items-baseline text-primary font-bold pt-3 border-t border-primary/10">
                <span className="text-base font-serif">Total</span>
                <span className="text-2xl font-bold text-[#83254e] price">{inr(finalTotal)}</span>
              </div>
              <p className="text-[11px] text-primary/50 -mt-2">Inclusive of all taxes</p>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start justify-between gap-2" role="alert">
                  <span>{errorMessage}</span>
                  <button type="button" onClick={() => setErrorMessage("")} className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer" aria-label="Dismiss">
                    ✕
                  </button>
                </div>
              )}

              <PayButton className="hidden lg:flex" />

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-primary/10 text-primary/70">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-accent shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">100% Authentic</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck size={16} className="text-accent shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Free Express Delivery</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky pay bar */}
      <div className="mobile-sticky-bar lg:hidden fixed bottom-0 inset-x-0 z-90 bg-white/95 backdrop-blur-md border-t border-primary/10 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(131,37,78,0.08)]">
        <div className="flex items-center gap-3 max-w-[1280px] mx-auto">
          <div className="shrink-0">
            <p className="text-[10px] uppercase tracking-wider text-primary/60 font-bold">Total</p>
            <p className="text-lg price font-bold text-primary leading-tight">{inr(finalTotal)}</p>
          </div>
          <PayButton className="flex-1" />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
