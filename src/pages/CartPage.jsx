import React from "react";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import { getPath } from "../utils/paths";
import AddressForm from "../components/AddressForm";
import { useCheckout } from "../hooks/useCheckout";
import { ShoppingBag, ArrowLeft, Trash2, ShieldCheck, Truck, Sparkles, Check, AlertCircle } from "lucide-react";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

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
  } = useCheckout();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        <div className="w-20 h-20 bg-[#f7d7c4]/30 rounded-full flex items-center justify-center text-primary mb-6 shadow-sm border border-white/50">
          <ShoppingBag size={36} className="text-primary/70" />
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-3">
          Your Cart is Empty
        </h1>
        <p className="text-primary/60 mb-8 max-w-md text-sm md:text-base leading-relaxed">
          Explore our signature fragrance collections and find your next unforgettable scent.
        </p>
        <Link
          to={getPath("/shop")}
          className="bg-primary text-white px-9 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-accent transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
        >
          <span>Explore Collection</span>
          <span>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-16 pt-4 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6">
      {/* Page Header */}
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-primary/10 pb-6">
        <div>
          <span className="text-accent text-xs font-bold uppercase tracking-[0.25em]">
            Shopping Bag
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-1">
            Your Luxury Selection
          </h1>
        </div>

        {/* Desktop Progress Stepper */}
        <div className="hidden md:flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary/40">
          <span className="text-primary flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
            <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">1</span>
            Review Bag
          </span>
          <span>—</span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary/50 text-[10px] flex items-center justify-center">2</span>
            Address & Payment
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Cart Items List (8 Cols on Desktop) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-widest text-primary/70">
              Items ({cartItems.length})
            </span>
            <button
              onClick={clearCart}
              className="text-xs font-bold text-primary/40 hover:text-red-500 uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Clear Bag</span>
            </button>
          </div>

          {/* Items Header for Desktop */}
          <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 text-[10px] uppercase font-bold tracking-widest text-primary/40">
            <div className="col-span-6">Product Details</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-3 text-right">Subtotal</div>
          </div>

          {/* Cart Item Cards */}
          <div className="space-y-3 sm:space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.variant_id}`}
                className="bg-white/80 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-row items-center gap-3.5 sm:gap-6 group"
              >
                {/* Product Image */}
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-50 shrink-0 border border-neutral-100 relative group-hover:shadow-sm transition-all">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0 flex flex-col sm:grid sm:grid-cols-10 sm:gap-4 sm:items-center justify-between">
                  {/* Info: Col 5 on Desktop */}
                  <div className="sm:col-span-5 min-w-0">
                    <div className="flex items-center justify-between gap-2 sm:block">
                      {item.tag && (
                        <span className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-md inline-block mb-1">
                          {item.tag}
                        </span>
                      )}
                      {/* Mobile Delete Button */}
                      <button
                        onClick={() => removeFromCart(item.id, item.variant_id)}
                        className="sm:hidden p-1 text-primary/30 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <h3 className="text-sm sm:text-base font-serif font-bold text-primary truncate capitalize">
                      {item.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-primary/60 font-medium mt-0.5">
                      {item.selectedSize
                        ? item.selectedSize.toLowerCase().startsWith("size:")
                          ? item.selectedSize
                          : `Size: ${item.selectedSize}`
                        : "Standard"}
                    </p>
                  </div>

                  {/* Quantity Controls: Col 3 on Desktop */}
                  <div className="sm:col-span-3 flex items-center justify-between sm:justify-center mt-2.5 sm:mt-0">
                    {/* Mobile Price Display */}
                    <span className="sm:hidden text-sm font-bold text-primary">
                      ₹{parseFloat(String(item.price).replace(/[^0-9.]/g, "")).toLocaleString()}
                    </span>

                    <div className="flex items-center bg-neutral-100/80 rounded-full border border-neutral-200/60 p-0.5 shadow-xs">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.variant_id,
                            item.quantity - 1
                          )
                        }
                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-primary/70 hover:text-primary transition-colors text-xs sm:text-sm font-bold cursor-pointer hover:bg-white rounded-full"
                      >
                        -
                      </button>
                      <span className="w-6 sm:w-8 text-center font-bold text-primary text-xs">
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
                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-primary/70 hover:text-primary transition-colors text-xs sm:text-sm font-bold cursor-pointer hover:bg-white rounded-full"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Subtotal & Delete: Col 2 on Desktop */}
                  <div className="sm:col-span-2 hidden sm:flex items-center justify-end gap-3">
                    <div className="text-right">
                      <p className="text-sm font-serif font-bold text-primary">
                        ₹{(
                          parseFloat(String(item.price).replace(/[^0-9.]/g, "")) * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.variant_id)}
                      className="p-2 text-primary/30 hover:text-red-500 hover:bg-red-50 rounded-full transition-all cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to={getPath("/shop")}
              className="inline-flex items-center gap-2 text-primary/60 font-bold uppercase tracking-widest text-xs hover:text-accent transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Sidebar (4-5 Cols Sticky on Desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[32px] border border-white/80 shadow-lg sticky top-28 space-y-6">
            <h2 className="text-xl font-serif font-bold text-primary pb-4 border-b border-primary/10 flex items-center justify-between">
              <span>Order Summary</span>
              <Sparkles size={18} className="text-accent" />
            </h2>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center text-primary/70 font-medium">
                <span>Bag Subtotal</span>
                <span className="text-primary font-serif font-bold">
                  ₹{cartTotal.toLocaleString()}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between items-center text-emerald-700 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100 text-xs font-semibold">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{appliedCoupon.discount_amount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-primary/70 font-medium">
                <span>Express Delivery</span>
                <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest bg-emerald-50 px-2 py-0.5 rounded">
                  Free
                </span>
              </div>

              {/* Promo Code Accordion */}
              {user && (
                <div className="pt-4 border-t border-primary/10 flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-primary/60">
                    Promo Code
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="ENTER CODE"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      disabled={!!appliedCoupon}
                      className="bg-white border border-neutral-200 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-accent uppercase flex-1 min-w-0 transition-all disabled:opacity-60 shadow-xs"
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                        className="px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-sm hover:bg-red-700 active:scale-95 flex items-center justify-center gap-1"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon || !couponCode.trim()}
                        style={{
                          backgroundColor: applyingCoupon || !couponCode.trim() ? "#a65377" : "#83254e",
                          color: "#ffffff"
                        }}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer shrink-0 shadow-sm hover:opacity-90 active:scale-95 disabled:cursor-not-allowed flex items-center justify-center min-w-[75px]"
                      >
                        {applyingCoupon ? "..." : "Apply"}
                      </button>
                    )}
                  </div>
                  {couponError && (
                    <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl text-[11px] font-semibold animate-fade-in">
                      <AlertCircle size={14} />
                      <span>{couponError}</span>
                    </div>
                  )}
                  {couponSuccess && (
                    <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl text-[11px] font-semibold animate-fade-in">
                      <Check size={14} />
                      <span>{couponSuccess}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center text-primary font-bold pt-4 border-t border-primary/10">
                <span className="text-base font-serif">Total Amount</span>
                <span className="text-2xl font-bold text-accent font-serif">
                  ₹{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Delivery Address Card */}
            {user && (
              <div className="pt-4 border-t border-primary/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/60">
                    Delivery Address
                  </span>
                  {address && !showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="text-[10px] font-bold text-accent hover:underline uppercase cursor-pointer"
                    >
                      Change
                    </button>
                  )}
                </div>

                {isAddressLoading ? (
                  <div className="py-3 flex justify-center">
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
                  <div className="bg-neutral-50/80 p-3.5 rounded-2xl border border-neutral-200/60 text-left">
                    <p className="font-bold text-primary text-xs">
                      {address.full_name}
                    </p>
                    <p className="text-[11px] text-primary/70 mt-0.5 leading-snug">
                      {address.address_line}, {address.city}, {address.state} - {address.postal_code}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      {!isAddressConfirmed ? (
                        <button
                          onClick={() => setIsAddressConfirmed(true)}
                          className="bg-accent text-white px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-xs hover:scale-105 transition-transform cursor-pointer"
                        >
                          Confirm Address
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
                          <Check size={12} />
                          Address Confirmed
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full py-3.5 border-2 border-dashed border-neutral-200 rounded-2xl text-primary/50 font-bold text-[10px] uppercase tracking-widest hover:border-accent hover:text-accent transition-all cursor-pointer"
                  >
                    + Add Delivery Address
                  </button>
                )}
              </div>
            )}

            {orderStatus === "error" && errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between animate-fade-in">
                <span>{errorMessage}</span>
                <button
                  onClick={() => setOrderStatus(null)}
                  className="text-rose-500 hover:text-rose-700 font-bold ml-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Main Action Button */}
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
                        ? "#f5f5f5"
                        : "#83254e",
                color:
                  user && !isAddressConfirmed && !showAddressForm
                    ? "#a3a3a3"
                    : "white",
              }}
              className="w-full py-4 rounded-2xl font-bold tracking-widest uppercase transition-all duration-300 shadow-md disabled:cursor-not-allowed hover:shadow-lg active:scale-98 cursor-pointer relative overflow-hidden group text-xs"
            >
              <span className="relative z-10">
                {isProcessing
                  ? "Processing..."
                  : orderStatus === "success"
                    ? "Order Placed!"
                    : user
                      ? !isAddressConfirmed
                        ? "Confirm Address First"
                        : "Proceed to Checkout"
                      : "Login to Checkout"}
              </span>
              {!(isProcessing || orderStatus) && (
                <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              )}
            </button>

            {/* Desktop Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-primary/10">
              <div className="flex items-center gap-2 text-primary/70">
                <ShieldCheck size={18} className="text-accent shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider">100% Authentic</span>
              </div>
              <div className="flex items-center gap-2 text-primary/70">
                <Truck size={18} className="text-accent shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Express Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
