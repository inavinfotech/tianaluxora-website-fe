import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { loadRazorpayScript } from "../utils/razorpay";
import { getPath } from "../utils/paths";
import THEME_COLORS from "../styles/theme";

export const useCheckout = (onSuccessClose) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [address, setAddress] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const discount = appliedCoupon?.discount_amount || 0;
  const finalTotal = Math.max(0, cartTotal - discount);

  const fetchAddress = useCallback(async () => {
    if (!user) return;
    try {
      setIsAddressLoading(true);
      const res = await api.get("/api/auth/me/address");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setAddress(data);
          setIsAddressConfirmed(true);
        } else {
          setAddress(null);
          setIsAddressConfirmed(false);
        }
      } else {
        setAddress(null);
        setIsAddressConfirmed(false);
      }
    } catch (err) {
      console.error("Error fetching address:", err);
    } finally {
      setIsAddressLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAddress();
    }
  }, [user, fetchAddress]);

  const handleAddressSave = async (addressData) => {
    try {
      setIsProcessing(true);
      const res = await api.post("/api/auth/me/address", addressData);
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

  const handleApplyCoupon = async () => {
    const formattedCode = couponCode.trim().toUpperCase();
    if (!formattedCode) return;
    setApplyingCoupon(true);
    setCouponError("");
    setCouponSuccess("");
    try {
      const res = await api.post("/api/coupons/validate", {
        code: formattedCode,
        subtotal: cartTotal,
        items: cartItems.map((item) => {
          const itemPrice = parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
          return {
            id: String(item.id),
            price: itemPrice,
            quantity: item.quantity,
          };
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.valid) {
          setAppliedCoupon({
            id: data.coupon_id,
            code: formattedCode,
            discount_amount: data.discount_amount,
          });
          setCouponSuccess(`Coupon '${formattedCode}' applied!`);
        } else {
          setCouponError(data.message || "Invalid coupon code");
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setCouponError(data.detail || "Invalid coupon code");
      }
    } catch (err) {
      console.error("Coupon validation error:", err);
      setCouponError("Failed to validate coupon");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponSuccess("");
    setCouponError("");
  };

  const handleCheckout = async () => {
    if (!user) {
      if (onSuccessClose) onSuccessClose();
      navigate(getPath("/login"), { state: { from: getPath("/cart") } });
      return;
    }

    if (!isAddressConfirmed) {
      setShowAddressForm(true);
      return;
    }

    setIsProcessing(true);
    setOrderStatus(null);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
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
            : cartItems[0]?.name || "Luxury Item",
        quantity: cartItems.reduce((acc, item) => acc + item.quantity, 0),
        total_amount: finalTotal,
        currency: "INR",
        image: cartItems[0]?.image,
        coupon_code: appliedCoupon?.code || null,
        coupon_id: appliedCoupon?.id || null,
        items: cartItems.map((item) => {
          const itemPrice = parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
          return {
            product_id: String(item.id),
            variant_id: item.variant_id ? String(item.variant_id) : null,
            variant_name: item.selectedSize || item.tag || "Standard",
            product_name: item.name,
            name: item.name,
            quantity: item.quantity,
            unit_price: itemPrice,
            price: itemPrice,
            sku: item.sku || `SKU-${item.id}`,
            image: item.image,
          };
        }),
      };

      setErrorMessage("");
      const response = await api.post("/api/orders/checkout", orderData);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to initiate checkout");
      }

      const { payment, reservation_ids } = await response.json();

      const options = {
        key: payment.key_id,
        amount: payment.amount,
        currency: payment.currency,
        name: "Tiana Luxora",
        description: "Order Payment",
        image: "https://tianaluxora.com/logo.png",
        order_id: payment.razorpay_order_id,
        handler: async function (res) {
          try {
            const verifyRes = await api.post("/api/orders/verify-payment", {
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
              order_data: orderData,
              reservation_ids: reservation_ids,
              coupon_id: appliedCoupon?.id || null,
              coupon_code: appliedCoupon?.code || null,
            });

            if (verifyRes.ok) {
              setOrderStatus("success");
              clearCart();
              setTimeout(() => {
                if (onSuccessClose) onSuccessClose();
                setOrderStatus(null);
                navigate(getPath("/profile"), { replace: true });
              }, 2000);
            } else {
              setOrderStatus("error");
              setErrorMessage("Payment verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            setOrderStatus("error");
            setErrorMessage("Payment verification failed");
          }
        },
        prefill: {
          name: user.full_name,
          email: user.email,
        },
        theme: { color: THEME_COLORS.primary },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Checkout error:", error);
      setOrderStatus("error");
      setErrorMessage(error.message || "Failed to initiate checkout");
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
    showAddressForm,
    setShowAddressForm,
    isAddressConfirmed,
    setIsAddressConfirmed,
    handleAddressSave,
    couponCode,
    setCouponCode,
    appliedCoupon,
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
  };
};
