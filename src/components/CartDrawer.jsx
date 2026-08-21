import React from "react";
import { useCart } from "../contexts/CartContext";
import AddressForm from "./AddressForm";
import { useCheckout } from "../hooks/useCheckout";

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

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-200 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md flex flex-col bg-white shadow-2xl animate-slide-left">
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary">
                Your Collection
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <p className="text-lg text-gray-500 mb-6">Your cart is empty</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-8 py-3 bg-primary text-white font-medium hover:bg-accent transition-all duration-300"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}_${item.variant_id || "base"}`}
                    className="flex gap-4 p-4 border border-gray-100 rounded-lg group hover:border-accent/30 transition-colors"
                  >
                    <div className="w-20 h-24 bg-gray-50 rounded shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-medium text-primary">
                          {item.name}
                        </h3>
                        <button
                          onClick={() =>
                            removeFromCart(item.id, item.variant_id)
                          }
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        {item.selectedSize || item.tag || "Eau de Parfum"}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.variant_id,
                                item.quantity - 1,
                              )
                            }
                            className="p-1 px-2 hover:bg-gray-50 text-gray-500"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.variant_id,
                                item.quantity + 1,
                              )
                            }
                            className="p-1 px-2 hover:bg-gray-50 text-gray-500"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-semibold text-accent">
                          ₹{item.price}
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
                              backgroundColor: "#d48c6a",
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
                          backgroundColor: applyingCoupon || !couponCode.trim() ? "#8c6b6b" : "#5a3232",
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
                          : "#5a3232",
                  color:
                    user && !isAddressConfirmed && !showAddressForm
                      ? "#737373"
                      : "white",
                }}
                className={`w-full py-4 font-bold tracking-widest uppercase transition-all duration-500 relative overflow-hidden group shadow-lg disabled:cursor-not-allowed`}
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
                            : "Punch Order"
                          : "Login to Checkout"}
                </span>
                {!(isProcessing || orderStatus) && (
                  <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                )}
              </button>

              {orderStatus === "success" && (
                <p className="text-center text-green-600 mt-4 text-sm font-medium animate-pulse">
                  Redirecting to your profile...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
