import React, { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api";
import { getPath } from "../utils/paths";
import { loadRazorpayScript } from "../utils/razorpay";
import AddressForm from "../components/AddressForm";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);

  // Address state
  const [address, setAddress] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAddress();
    }
  }, [user]);

  const fetchAddress = async () => {
    try {
      setIsAddressLoading(true);
      const res = await api.get("/api/users/address");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setAddress(data);
          setIsAddressConfirmed(true);
        }
      }
    } catch (err) {
      console.error("Error fetching address:", err);
    } finally {
      setIsAddressLoading(false);
    }
  };

  const handleAddressSave = async (addressData) => {
    try {
      setIsProcessing(true);
      const res = await api.post("/api/users/address", addressData);
      if (res.ok) {
        const data = await res.json();
        setAddress(data);
        setIsAddressConfirmed(true);
        setShowAddressForm(false);
      }
    } catch (err) {
      console.error("Error saving address:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate(getPath("/login"));
      return;
    }

    if (!isAddressConfirmed) {
      setShowAddressForm(true);
      return;
    }

    setIsProcessing(true);
    const resScript = await loadRazorpayScript();
    if (!resScript) {
      alert("Razorpay SDK failed to load.");
      setIsProcessing(false);
      return;
    }

    try {
      const orderData = {
        user_id: String(user.user_id),
        customer_name: user.full_name || user.email,
        product_name:
          cartItems.length > 1
            ? `${cartItems[0].name} & more`
            : cartItems[0].name,
        quantity: cartItems.reduce((acc, item) => acc + item.quantity, 0),
        total_amount: cartTotal,
        currency: "INR",
        image: cartItems[0]?.image,
        items: cartItems.map((item) => ({
          product_id: String(item.id),
          variant_id: item.variant_id ? String(item.variant_id) : null,
          variant_name: item.selectedSize,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: parseFloat(String(item.price).replace(/[^0-9.]/g, "")),
          sku: item.sku || `SKU-${item.id}`,
          image: item.image,
        })),
      };

      const response = await api.post("/api/orders/checkout", orderData);
      if (!response.ok) throw new Error("Checkout initiation failed");

      const { payment, reservation_ids } = await response.json();

      const options = {
        key: payment.key_id,
        amount: payment.amount,
        currency: payment.currency,
        name: "Tiana Luxora",
        order_id: payment.razorpay_order_id,
        handler: async function (response) {
          try {
            const verifyRes = await api.post("/api/orders/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_data: orderData,
              reservation_ids: reservation_ids,
            });

            if (verifyRes.ok) {
              setOrderStatus("success");
              clearCart();
              setTimeout(() => navigate(getPath("/profile")), 2000);
            } else {
              setOrderStatus("error");
            }
          } catch (e) {
            setOrderStatus("error");
          }
        },
        prefill: { name: user.full_name, email: user.email },
        theme: { color: "#5a3232" },
        modal: { ondismiss: () => setIsProcessing(false) },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error(error);
      setOrderStatus("error");
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">
          My Cart
        </h1>
        <p className="text-gray-500 mb-8 max-w-md">
          Your collection is currently empty. Discover our signature scents and
          find your next favorite.
        </p>
        <Link
          to={getPath("/shop")}
          className="bg-primary text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-accent transition-all"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-8 animate-fade-in max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-serif font-bold text-primary text-center mb-8">
        My Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-primary">
              Cart Items ({cartItems.length})
            </h2>
            <button
              onClick={clearCart}
              className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-2"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Clear Cart
            </button>
          </div>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.variant_id}`}
                className="flex gap-4 bg-white p-4 rounded-2xl border border-gray-50 shadow-sm relative group hover:shadow-md transition-shadow"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-serif font-bold text-primary truncate capitalize">
                        {item.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">
                        {item.tag || "Eau de Parfum"} •{" "}
                        {item.selectedSize || "N/A"}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-primary shrink-0 ml-2">
                      ₹
                      {parseFloat(
                        String(item.price).replace(/[^0-9.]/g, ""),
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="px-2 py-0.5 bg-neutral-50 text-[8px] font-bold text-primary/40 uppercase tracking-widest rounded border border-neutral-100">
                      Signature
                    </span>
                    <span className="px-2 py-0.5 bg-orange-50 text-[8px] font-bold text-orange-400 uppercase tracking-widest rounded border border-orange-100">
                      In Stock
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center bg-neutral-50 rounded-full border border-neutral-100 p-0.5">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.variant_id,
                            item.quantity - 1,
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary transition-colors text-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-primary text-xs">
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
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id, item.variant_id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-all"
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
                </div>
              </div>
            ))}
          </div>

          <Link
            to={getPath("/shop")}
            className="inline-flex items-center gap-2 text-primary/40 font-bold uppercase tracking-widest text-xs hover:text-accent transition-colors"
          >
            ← Continuous Shopping
          </Link>
        </div>

        {/* Right Column: Summary & Address */}
        <div className="space-y-6">
          {/* Order Summary Card */}
          <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-lg sticky top-32">
            <h2 className="text-xl font-serif font-bold text-primary mb-6 pb-3 border-b border-gray-100">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between items-center text-gray-400 font-medium">
                <span>Subtotal</span>
                <span className="text-primary">
                  ₹{cartTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-500 font-medium">
                <span>Shipping</span>
                <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest">
                  Free
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-500 font-medium pt-3 border-t border-gray-50">
                <span className="text-lg font-bold text-primary">Total</span>
                <span className="text-2xl font-bold text-accent font-serif">
                  ₹{cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Address Section on Page */}
            {user && (
              <div className="mb-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] uppercase font-black text-primary/30 tracking-[0.2em]">
                    Delivery Address
                  </h3>
                  {address && !showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="text-[10px] font-bold text-accent hover:underline uppercase"
                    >
                      Change
                    </button>
                  )}
                </div>

                {isAddressLoading ? (
                  <div className="py-2 flex justify-center">
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
                  <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
                    <p className="font-bold text-primary text-xs">
                      {address.full_name}
                    </p>
                    <p className="text-[10px] text-primary/60 mt-0.5">
                      {address.address_line}
                    </p>
                    <p className="text-[10px] text-primary/60">
                      {address.city}, {address.state} - {address.postal_code}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      {!isAddressConfirmed ? (
                        <button
                          onClick={() => setIsAddressConfirmed(true)}
                          className="bg-accent text-white px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-sm hover:scale-105 transition-transform"
                        >
                          Confirm
                        </button>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[9px] font-bold text-green-600 uppercase tracking-widest">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          Confirmed
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full py-4 border-2 border-dashed border-neutral-200 rounded-2xl text-primary/30 font-bold text-[9px] uppercase tracking-widest hover:border-accent/40 hover:text-accent transition-all"
                  >
                    + Add Address
                  </button>
                )}
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
                        ? "#f5f5f5"
                        : "#5a3232",
                color:
                  user && !isAddressConfirmed && !showAddressForm
                    ? "#a3a3a3"
                    : "white",
              }}
              className="w-full py-5 rounded-2xl font-bold max-md:tracking-[0.2em] uppercase transition-all duration-500 shadow-xl disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
            >
              {isProcessing
                ? "Processing..."
                : orderStatus === "success"
                  ? "Order Placed!"
                  : user
                    ? !isAddressConfirmed
                      ? "Confirm Address"
                      : "Proceed to Checkout"
                    : "Login to Checkout"}
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { icon: "🛡️", label: "Secure Payment" },
                { icon: "🚚", label: "Fast Shipping" },
                { icon: "🎁", label: "Premium Packing" },
              ].map((badge) => (
                <div key={badge.label} className="text-center">
                  <div className="text-lg mb-1">{badge.icon}</div>
                  <p className="text-[8px] font-bold text-primary/40 uppercase tracking-wider">
                    {badge.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Make It a Gift section */}
          <div className="bg-[#fffcf9] p-8 rounded-[40px] border border-[#f5e6d3] text-center">
            <h3 className="text-lg font-serif font-bold text-primary mb-2">
              Make It a Gift
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4 px-4">
              Add a personalized message and premium gift wrapping to make your
              purchase extra special.
            </p>
            <button className="text-[10px] font-black underline uppercase tracking-widest text-accent">
              Add Gift Wrap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
