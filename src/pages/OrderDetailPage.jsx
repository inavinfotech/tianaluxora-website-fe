import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";
import { getPath } from "../utils/paths";
import "../styles/OrderDetail.css";
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  Wallet,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Hash,
  Download,
} from "lucide-react";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate(getPath("/login"));
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && orderId) fetchOrderDetails();
  }, [user, orderId]);

  const fetchOrderDetails = async () => {
    setOrderLoading(true);
    try {
      // Note: Endpoint might differ based on backend implementation
      const response = await api.get(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading || orderLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <h2 className="text-2xl font-serif font-bold">Order not found</h2>
        <button
          onClick={() => navigate(getPath("/profile/orders"))}
          className="text-accent underline flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to My Orders
        </button>
      </div>
    );
  }

  const steps = [
    { status: "PENDING", icon: Clock, label: "Order Placed" },
    { status: "CONFIRMED", icon: CheckCircle2, label: "Confirmed" },
    { status: "SHIPPED", icon: Truck, label: "Shipped" },
    { status: "DELIVERED", icon: Package, label: "Delivered" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.status === order.status);

  return (
    <div className="order-detail-container">
      {/* Header */}
      <div className="order-header">
        <div className="header-left">
          <button
            onClick={() => navigate(getPath("/profile/orders"))}
            className="back-button"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="title-tag-group">
            <div className="title-status-row">
              <h1 className="order-title">Order Details</h1>
              <span className="status-badge">{order.status}</span>
            </div>
            <p className="order-id-label">
              <Hash size={10} /> {order.id}
            </p>
          </div>
        </div>

        <button className="download-button">
          <Download size={14} /> Download Invoice
        </button>
      </div>

      <div className="order-content-grid">
        {/* Main Details */}
        <div className="main-column">
          {/* Progress Tracker */}
          <div className="glass-card">
            <div className="progress-container">
              <div className="progress-line-bg" />
              <div
                className="progress-line-active"
                style={{
                  width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%`,
                }}
              />

              {steps.map((step, idx) => {
                const isActive = idx <= currentStepIndex;
                const isCancelled = order.status === "CANCELLED";
                return (
                  <div
                    key={idx}
                    className={`step-item ${isActive ? "active" : ""} ${isCancelled ? "cancelled" : ""}`}
                  >
                    <div className="step-icon-wrapper">
                      <step.icon size={18} />
                    </div>
                    <span className="step-label">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product Info */}
          <div className="glass-card">
            <h3 className="section-title">Order Items</h3>
            <div className="items-list-container">
              {(order.items && order.items.length > 0
                ? order.items
                : [
                    {
                      product_name: order.product_name,
                      quantity: order.quantity,
                      unit_price: order.total_amount / (order.quantity || 1),
                      image: order.image,
                      variant_name: order.variant_name,
                    },
                  ]
              ).map((item, idx) => (
                <div key={idx} className="item-card">
                  <div className="item-image-wrapper">
                    <img
                      src={
                        item.image || "https://placehold.co/100x100?text=Order"
                      }
                      alt={item.product_name}
                      className="item-image"
                    />
                  </div>
                  <div className="item-details">
                    <h4 className="item-name">{item.product_name}</h4>
                    <div className="item-meta">
                      <span>Qty: {item.quantity}</span>
                      {item.variant_name && (
                        <span>Variant: {item.variant_name}</span>
                      )}
                    </div>
                    <div className="item-price">
                      ₹
                      {(
                        item.unit_price * item.quantity || order.total_amount
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="sidebar-column">
          {/* Customer Info */}
          <div className="customer-info-card">
            <h3 className="sidebar-section-title">
              <MapPin size={12} /> Shipping Details
            </h3>
            <div className="info-content">
              <div>
                <p className="shipping-name">
                  {order.shipping_name || user.full_name}
                </p>
                <p className="shipping-address">
                  {order.shipping_address || "Address details not available"}
                </p>
              </div>
              <div className="contact-info">
                <p className="time-label">Contact</p>
                <p className="time-value">{user.email}</p>
                <p className="time-value">
                  {order.phone || "No phone provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="glass-card payment-summary-card">
            <h3 className="sidebar-section-title">
              <Wallet size={12} /> Payment Summary
            </h3>
            <div className="summary-list">
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">
                  ₹{order.total_amount.toLocaleString()}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Shipping</span>
                <span className="summary-value" style={{ color: "#10b981" }}>
                  Free
                </span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>₹{order.total_amount.toLocaleString()}</span>
              </div>
              <div className="paid-badge">
                <CheckCircle2 size={10} /> Paid via Online Transaction
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="order-time-card">
            <div className="time-row">
              <Calendar size={14} style={{ opacity: 0.4 }} />
              <div>
                <p className="time-label">Ordered On</p>
                <p className="time-value">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            {order.delivered_at && (
              <div className="time-row">
                <Package size={14} style={{ color: "#10b981" }} />
                <div>
                  <p className="time-label" style={{ color: "#10b981" }}>
                    Delivered On
                  </p>
                  <p className="time-value">
                    {new Date(order.delivered_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
