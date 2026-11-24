import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { loadRazorpayScript } from "../utils/razorpay";
import { getPath } from "../utils/paths";
import THEME_COLORS from "../styles/theme";

const toPrice = (price) =>
  parseFloat(String(price).replace(/[^0-9.]/g, "")) || 0;

export const formatAddress = (a) =>
  a
    ? [a.address_line, a.city, `${a.state || ""} - ${a.postal_code || ""}`]
        .filter(Boolean)
        .join(", ")
    : "";

export const useCheckout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [address, setAddress] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  const discount = appliedCoupon?.discount_amount || 0;
  const finalTotal = Math.max(0, cartTotal - discount);

  const fetchAddress = useCallback(async () => {
    if (!user) return;
    setIsAddressLoading(true);
    try {
      const res = await api.get("/api/auth/me/address");
      const data = res.ok ? await res.json() : null;
      const hasAddress = data && data.address_line;
      setAddress(hasAddress ? data : null);
      // No saved address yet: open the form straight away
      setShowAddressForm(!hasAddress);
    } catch (err) {
      console.error("Error fetching address:", err);
      setShowAddressForm(true);
    } finally {
      setIsAddressLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  const handleAddressSave = async (addressData) => {
    setIsSavingAddress(true);
    setAddressError("");
    try {
      const res = await api.post("/api/auth/me/address", addressData);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof data.detail === "string" ? data.detail : "Couldn't save your address. Please try again."
        );
      }
      const data = await res.json().catch(() => addressData);
      setAddress(data && data.address_line ? data : addressData);
      setShowAddressForm(false);
      return true;
    } catch (err) {
      console.error("Error saving address:", err);
      setAddressError(err.message || "Couldn't save your address. Please try again.");
      return false;
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleApplyCoupon = async () => {
    const formattedCode = couponCode.trim().toUpperCase();
    if (!formattedCode) return;
    setApplyingCoupon(true);
    setCouponError("");
    try {
      const res = await api.post("/api/coupons/validate", {
        code: formattedCode,
        subtotal: cartTotal,
        items: cartItems.map((item) => ({
          id: String(item.id),
          price: toPrice(item.price),
          quantity: item.quantity,
        })),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.valid) {
        setAppliedCoupon({
          id: data.coupon_id,
          code: formattedCode,
          discount_amount: data.discount_amount,
        });
      } else {
        setCouponError(data.message || data.detail || "Invalid coupon code");
      }
    } catch (err) {
      console.error("Coupon validation error:", err);
      setCouponError("Couldn't check this coupon. Please try again.");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleCheckout = async () => {
    setErrorMessage("");

    if (!user) {
      navigate(getPath("/login"), { state: { from: getPath("/cart") } });
      return;
    }
    if (!address) {
      setShowAddressForm(true);
      setErrorMessage("Please add a delivery address to continue.");
      return;
    }
    if (cartItems.length === 0) return;

    setIsProcessing(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setErrorMessage(
        "Couldn't load the secure payment window. Check your connection or disable ad-blockers, then try again."
      );
      setIsProcessing(false);
      return;
    }

    const items = cartItems.map((item) => {
      const unitPrice = toPrice(item.price);
      return {
        product_id: String(item.id),
        variant_id: item.variant_id ? String(item.variant_id) : null,
        variant_name: item.selectedSize || item.tag || "Standard",
        product_name: item.name,
        name: item.name,
        quantity: item.quantity,
        unit_price: unitPrice,
        price: unitPrice,
        sku: item.sku || `SKU-${item.id}`,
        image: item.image,
      };
    });

    const orderData = {
      user_id: String(user.user_id),
      customer_name: user.full_name || user.email,
      product_name:
        cartItems.length > 1
          ? `${cartItems[0].name} & more`
          : cartItems[0]?.name || "Luxury Item",
      quantity: cartItems.reduce((acc, item) => acc + item.quantity, 0),
      total_amount: finalTotal,
      currency: "INR",
      image: cartItems[0]?.image,
      coupon_code: appliedCoupon?.code || null,
      coupon_id: appliedCoupon?.id || null,
      shipping_name: address.full_name,
      shipping_phone: address.phone_number,
      shipping_address: formatAddress(address),
      items,
    };

    try {
      const response = await api.post("/api/orders/checkout", orderData);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          typeof errorData.detail === "string"
            ? errorData.detail
            : "Couldn't start checkout. Please try again."
        );
      }

      const { payment, reservation_ids } = await response.json();

      const rzp = new window.Razorpay({
        key: payment.key_id,
        amount: payment.amount,
        currency: payment.currency,
        name: "Tiana Luxora",
        description: "Order Payment",
        order_id: payment.razorpay_order_id,
        prefill: {
          name: address.full_name || user.full_name,
          email: user.email,
          contact: address.phone_number,
        },
        theme: { color: THEME_COLORS.primary },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
        handler: async (res) => {
          try {
            const verifyRes = await api.post("/api/orders/verify-payment", {
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
              order_data: orderData,
              reservation_ids,
              coupon_id: appliedCoupon?.id || null,
              coupon_code: appliedCoupon?.code || null,
            });
            if (!verifyRes.ok) throw new Error("verify failed");

            const data = await verifyRes.json().catch(() => ({}));
            const order = data.order || {};
            clearCart();
            navigate(getPath("/order-success"), {
              replace: true,
              state: {
                orderId: order.id || order._id || null,
                paymentId: res.razorpay_payment_id,
                items,
                total: finalTotal,
                discount,
                address,
              },
            });
          } catch (err) {
            console.error("Verification error:", err);
            setErrorMessage(
              `Payment received but we couldn't confirm your order automatically. Please contact support with payment ID ${res.razorpay_payment_id}.`
            );
          } finally {
            setIsProcessing(false);
          }
        },
      });

      rzp.on("payment.failed", (resp) => {
        setErrorMessage(
          resp?.error?.description || "Payment failed. Please try again or choose another payment method."
        );
        setIsProcessing(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Checkout error:", error);
      setErrorMessage(error.message || "Couldn't start checkout. Please try again.");
      setIsProcessing(false);
    }
  };

  return {
    user,
    cartItems,
    cartTotal,
    discount,
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
    appliedCoupon,
    applyingCoupon,
    couponError,
    handleApplyCoupon,
    handleRemoveCoupon,
    isProcessing,
    errorMessage,
    setErrorMessage,
    handleCheckout,
  };
};
