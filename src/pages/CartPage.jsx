import React from "react";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import { getPath } from "../utils/paths";
import AddressForm from "../components/AddressForm";
import { useCheckout } from "../hooks/useCheckout";
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  ShieldCheck,
  Truck,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";

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
      <div className="min-h-[70dvh] flex flex-col items-center justify-center text-center px-4 animate-fade-in bg-white">
        <div className="w-24 h-24 bg-[#faf5f8] rounded-full flex items-center justify-center text-primary mb-6 border border-primary/10 shadow-xs">
          <ShoppingBag size={40} className="text-primary/70" />
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-3">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-primary/60 mb-8 max-w-md text-base leading-relaxed">
          Discover our curated collection of luxury fragrances crafted for timeless elegance.
        </p>
        <Link
          to={getPath("/shop")}
          style={{ backgroundColor: "#83254e", color: "#ffffff" }}
          className="bg-[#83254e] hover:bg-[#6c1d3f] text-white px-9 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all shadow-md active:scale-95 flex items-center justify-center"
        >
          <span>Explore Fragrances</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[100dvh] pb-24 pt-4 sm:pt-6 animate-fade-in w-full">
      {/* Full-width container with generous padding */}
      <div className="w-full max-w-[1440px] xl:max-w-[1536px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Page Title Header */}
        <div className="border-b border-primary/10 pb-5 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="text-accent text-xs font-bold uppercase tracking-[0.25em] block mb-1">
                Shopping Bag
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary">
                Your Luxury Selection
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-primary/70">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)} {cartItems.reduce((acc, item) => acc + item.quantity, 0) === 1 ? "item" : "items"} in selection
            </p>
          </div>
        </div>

        {/* Unified Full-Width 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start w-full">
          {/* Left Column: Professionally Aligned Items List */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 w-full">
            <div className="border border-primary/10 rounded-2xl bg-white overflow-hidden shadow-xs w-full">
              {/* Items Section Header */}
              <div className="px-5 sm:px-6 py-3.5 bg-[#faf5f8]/75 border-b border-primary/10 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-primary">
                  Selected Items ({cartItems.length})
                </span>
                <button
                  onClick={clearCart}
                  type="button"
                  className="text-xs font-bold text-primary/60 hover:text-red-600 uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Clear All</span>
                </button>
              </div>

              {/* Continuous List of Items */}
              <div className="divide-y divide-primary/10">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.variant_id}`}
                    className="p-4 sm:p-5 lg:p-6 flex items-center gap-4 sm:gap-6 hover:bg-[#faf5f8]/30 transition-colors w-full"
                  >
                    {/* Product Image */}
                    <Link
                      to={getPath(`/product/${item.id}`)}
                      className="w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 rounded-xl overflow-hidden bg-[#faf5f8] shrink-0 border border-primary/10 shadow-xs block group"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                      {/* Top Row: Title, Variant, and Desktop Columns / Mobile Delete */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <Link
                            to={getPath(`/product/${item.id}`)}
                            className="hover:text-accent transition-colors inline-block"
                          >
                            <h3 className="text-sm sm:text-base md:text-lg font-serif font-bold text-primary truncate capitalize leading-snug">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-xs sm:text-sm text-primary/60 font-medium mt-0.5">
                            {item.selectedSize
                              ? item.selectedSize.toLowerCase().startsWith("size:")
                                ? item.selectedSize
                                : `Size: ${item.selectedSize}`
                              : "Standard Edition"}
                          </p>
                        </div>

                        {/* Desktop Column Layout for Price, Counter, Total, Delete */}
                        <div className="hidden sm:flex items-center gap-5 md:gap-8 lg:gap-10 shrink-0">
                          {/* Unit Price */}
                          <div className="text-center min-w-[70px] lg:min-w-[85px]">
                            <span className="text-[10px] text-primary/40 uppercase font-bold tracking-wider block mb-0.5">
                              Price
                            </span>
                            <span className="text-sm font-bold text-primary font-serif">
                              ₹{parseFloat(String(item.price).replace(/[^0-9.]/g, "")).toLocaleString()}
                            </span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] text-primary/40 uppercase font-bold tracking-wider block mb-0.5">
                              Quantity
                            </span>
                            <div className="flex items-center bg-white rounded-full border border-primary/20 p-0.5 shadow-xs">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.variant_id,
                                    item.quantity - 1
                                  )
                                }
                                className="w-7 h-7 flex items-center justify-center text-primary/70 hover:text-primary hover:bg-[#faf5f8] rounded-full transition-colors text-sm font-bold cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-7 text-center font-bold text-primary text-xs sm:text-sm">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.variant_id,
                                    item.quantity + 1
                                  )
                                }
                                className="w-7 h-7 flex items-center justify-center text-primary/70 hover:text-primary hover:bg-[#faf5f8] rounded-full transition-colors text-sm font-bold cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Line Total */}
                          <div className="text-right min-w-[80px] lg:min-w-[95px]">
                            <span className="text-[10px] text-primary/40 uppercase font-bold tracking-wider block mb-0.5">
                              Total
                            </span>
                            <p className="text-base font-serif font-bold text-[#83254e]">
                              ₹{(
                                parseFloat(String(item.price).replace(/[^0-9.]/g, "")) * item.quantity
                              ).toLocaleString()}
                            </p>
                          </div>

                          {/* Desktop Delete Button */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id, item.variant_id)}
                            className="p-2 text-primary/30 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Mobile Delete Icon in Top-Right Corner */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id, item.variant_id)}
                          className="sm:hidden p-1.5 text-primary/30 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer -mt-1 -mr-1"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Mobile Bottom Row: Quantity on Left, Subtotal on Right */}
                      <div className="sm:hidden flex items-center justify-between mt-3 pt-2.5 border-t border-primary/5">
                        <div className="flex items-center bg-white rounded-full border border-primary/20 p-0.5 shadow-xs">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.variant_id,
                                item.quantity - 1
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center text-primary/70 hover:text-primary hover:bg-[#faf5f8] rounded-full transition-colors text-sm font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-7 text-center font-bold text-primary text-xs">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.variant_id,
                                item.quantity + 1
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center text-primary/70 hover:text-primary hover:bg-[#faf5f8] rounded-full transition-colors text-sm font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-serif font-bold text-[#83254e]">
                            ₹{(
                              parseFloat(String(item.price).replace(/[^0-9.]/g, "")) * item.quantity
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={getPath("/shop")}
                className="inline-flex items-center gap-2 text-primary/70 font-semibold text-xs sm:text-sm hover:text-primary transition-colors group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>Continue Browsing Fragrances</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Direct Checkout Panel */}
          <div className="lg:col-span-5 xl:col-span-4 w-full">
            <div className="bg-[#faf5f8]/80 border border-primary/10 rounded-2xl p-6 sm:p-7 space-y-6 lg:sticky lg:top-24 w-full shadow-xs">
              <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                <h2 className="text-lg sm:text-xl font-serif font-bold text-primary">
                  Order Summary
                </h2>
                <Sparkles size={18} className="text-accent" />
              </div>

              {/* Price Details */}
              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-primary/75">
                  <span>Bag Subtotal</span>
                  <span className="text-primary font-serif font-bold text-sm sm:text-base">
                    ₹{cartTotal.toLocaleString()}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-emerald-700 bg-emerald-50 px-3.5 py-2.5 rounded-xl border border-emerald-100 text-xs sm:text-sm font-semibold">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-₹{appliedCoupon.discount_amount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-primary/75">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-700 font-bold uppercase text-[10px] tracking-wider bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    Complimentary Free
                  </span>
                </div>

                {/* Promo Code Input */}
                {user && (
                  <div className="pt-3.5 border-t border-primary/10 space-y-2">
                    <label className="text-[11px] uppercase font-bold tracking-wider text-primary/75 block">
                      Promotional Coupon
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="ENTER CODE"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={!!appliedCoupon}
                        className="bg-white border border-primary/20 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-primary uppercase flex-1 min-w-0 disabled:opacity-60"
                      />
                      {appliedCoupon ? (
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer shrink-0 hover:bg-red-700 active:scale-95"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={applyingCoupon || !couponCode.trim()}
                          style={{
                            backgroundColor:
                              applyingCoupon || !couponCode.trim()
                                ? "#a65377"
                                : "#83254e",
                            color: "#ffffff",
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shrink-0 disabled:cursor-not-allowed transition-all"
                        >
                          {applyingCoupon ? "..." : "Apply"}
                        </button>
                      )}
                    </div>
                    {couponError && (
                      <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg text-xs font-semibold">
                        <AlertCircle size={13} />
                        <span>{couponError}</span>
                      </div>
                    )}
                    {couponSuccess && (
                      <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg text-xs font-semibold">
                        <Check size={13} />
                        <span>{couponSuccess}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Final Total Row */}
                <div className="flex justify-between items-baseline text-primary font-bold pt-3.5 border-t border-primary/10">
                  <span className="text-sm sm:text-base font-serif">Total Payable</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#83254e] font-serif">
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Delivery Address Details for Logged In User */}
              {user && (
                <div className="pt-3.5 border-t border-primary/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-primary/75">
                      Shipping Address
                    </span>
                    {address && !showAddressForm && (
                      <button
                        onClick={() => setShowAddressForm(true)}
                        type="button"
                        className="text-[11px] font-bold text-accent hover:underline uppercase cursor-pointer"
                      >
                        Edit
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
                    <div className="bg-white p-3 rounded-xl border border-primary/10 text-left">
                      <p className="font-bold text-primary text-xs">
                        {address.full_name}
                      </p>
                      <p className="text-[11px] text-primary/70 mt-0.5 leading-snug">
                        {address.address_line}, {address.city}, {address.state} - {address.postal_code}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between">
                        {!isAddressConfirmed ? (
                          <button
                            type="button"
                            onClick={() => setIsAddressConfirmed(true)}
                            className="bg-accent text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:opacity-90"
                          >
                            Confirm Address
                          </button>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                            <Check size={12} strokeWidth={3} />
                            Address Verified
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(true)}
                      className="w-full py-3 border border-dashed border-primary/30 rounded-xl text-primary font-bold text-xs uppercase tracking-wider hover:border-primary transition-all cursor-pointer bg-white"
                    >
                      + Add Delivery Address
                    </button>
                  )}
                </div>
              )}

              {/* Order Error Alert */}
              {orderStatus === "error" && errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between">
                  <span>{errorMessage}</span>
                  <button
                    type="button"
                    onClick={() => setOrderStatus(null)}
                    className="text-rose-600 hover:text-rose-800 font-bold ml-2 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Checkout Action Button */}
              <button
                type="button"
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
                      ? "#e5e7eb"
                      : "#83254e",
                  color:
                    user && !isAddressConfirmed && !showAddressForm
                      ? "#9ca3af"
                      : "#ffffff",
                }}
                className="w-full py-3.5 sm:py-4 rounded-xl font-bold tracking-widest uppercase transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer text-xs"
              >
                {isProcessing
                  ? "Processing..."
                  : orderStatus === "success"
                  ? "Order Placed!"
                  : user
                  ? !isAddressConfirmed
                    ? "Confirm Address First"
                    : "Proceed to Payment"
                  : "Login to Checkout"}
              </button>

              {/* Connected Trust Badges */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-primary/10 text-primary/70">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-accent shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">100% Authentic</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck size={16} className="text-accent shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Express Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
