import React, { useState } from "react";
import { api } from "../utils/api";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { loadRazorpayScript } from "../utils/razorpay";

const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null); // 'success', 'error', null

  const handleCheckout = async () => {
    if (!user) {
      setIsCartOpen(false);
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    setOrderStatus(null);

    // 1. Load Razorpay Script
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
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
        items: cartItems.map((item) => ({
          product_id: String(item.id),
          product_name: item.name,
          quantity: item.quantity,
          unit_price: parseFloat(String(item.price).replace(/[^0-9.]/g, "")),
          sku: item.sku || `SKU-${item.id}`,
        })),
      };

      // 2. Create Order & Payment Request
      const response = await api.post("/api/orders/checkout", orderData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to initiate checkout");
      }
      const { order, payment } = await response.json();

      // 3. Razorpay Options
      const options = {
        key: payment.key_id,
        amount: payment.amount,
        currency: payment.currency,
        name: "Tiana Luxora",
        description: `Order #${order.id}`,
        image: "https://tianaluxora.com/logo.png",
        order_id: payment.razorpay_order_id,
        handler: async function (response) {
          // 4. Verify Payment after success
          try {
            const verifyRes = await api.post("/api/orders/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order.id,
            });

            if (verifyRes.ok) {
              setOrderStatus("success");
              clearCart();
              setTimeout(() => {
                setIsCartOpen(false);
                setOrderStatus(null);
                navigate("/profile");
              }, 2000);
            } else {
              setOrderStatus("error");
            }
          } catch (err) {
            setOrderStatus("error");
          }
        },
        prefill: {
          name: user.full_name,
          email: user.email,
        },
        theme: {
          color: "#3d1a1a",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Checkout error:", error);
      setOrderStatus("error");
      setIsProcessing(false);
    }
  };

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
                    key={item.id}
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
                          onClick={() => removeFromCart(item.id)}
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
                        {item.tag || "Eau de Parfum"}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
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
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 px-2 hover:bg-gray-50 text-gray-500"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-semibold text-accent">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-primary">
                  Rs {cartTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600 font-medium">
                  Calculated at next step
                </span>
              </div>
              <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-200">
                <span className="text-lg font-bold text-primary">Total</span>
                <span className="text-2xl font-bold text-accent font-serif">
                  Rs {cartTotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing || orderStatus === "success"}
                className={`w-full py-4 font-bold tracking-widest uppercase transition-all duration-500 relative overflow-hidden group shadow-lg ${
                  orderStatus === "success"
                    ? "bg-green-700 text-white"
                    : orderStatus === "error"
                      ? "bg-[#8b2d2d] text-white hover:bg-[#a83a3a]"
                      : "bg-primary text-white hover:bg-accent"
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                <span className="relative z-10">
                  {isProcessing
                    ? "Processing..."
                    : orderStatus === "success"
                      ? "Order Placed!"
                      : orderStatus === "error"
                        ? "Retry Checkout"
                        : user
                          ? "Punch Order"
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
