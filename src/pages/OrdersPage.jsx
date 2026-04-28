import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";
import { getPath } from "../utils/paths";
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import "../styles/Profile.css";

const OrdersPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate(getPath("/login"));
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await api.get(`/api/orders/?user_id=${user.user_id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle size={16} className="text-emerald-500" />;
      case "shipped":
        return <Truck size={16} className="text-blue-500" />;
      case "pending":
        return <Clock size={16} className="text-amber-500" />;
      case "cancelled":
        return <XCircle size={16} className="text-rose-500" />;
      default:
        return <Package size={16} className="text-primary/40" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "status-delivered";
      case "shipped":
        return "status-shipped";
      case "pending":
        return "status-pending";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="orders-page-container animate-fade-in">
      <div className="orders-page-header">
        <div className="header-left">
          <button
            onClick={() => navigate(getPath("/profile"))}
            className="back-button"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="orders-title">My Orders</h1>
            <p className="orders-subtitle">Track and manage your purchases</p>
          </div>
        </div>
      </div>

      {ordersLoading ? (
        <div className="orders-list">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="order-list-item animate-pulse"
              style={{ height: "120px" }}
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-orders-card">
          <div className="empty-icon-box">
            <Package size={40} />
          </div>
          <div>
            <h3 className="section-title">No orders found</h3>
            <p className="order-qty-label">
              You haven't placed any orders yet.
            </p>
          </div>
          <button
            onClick={() => navigate(getPath("/shop"))}
            className="start-shopping-btn"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(getPath(`/profile/orders/${order.id}`))}
              className="order-list-item"
            >
              <div className="order-item-left">
                <div className="order-item-image-box">
                  <img
                    src={
                      order.image || "https://placehold.co/100x100?text=Order"
                    }
                    alt={order.product_name}
                    className="order-item-image"
                  />
                </div>

                <div className="order-item-info">
                  <div className="order-meta-info">
                    <span>#{order.id.split("-")[0].toUpperCase()}</span>
                    <span>•</span>
                    <span>
                      {new Date(order.created_at).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "short", day: "numeric" },
                      )}
                    </span>
                  </div>
                  <h3 className="order-item-title">{order.product_name}</h3>
                  <div className="order-item-pricing">
                    <span className="order-price-val">
                      ₹{order.total_amount.toLocaleString()}
                    </span>
                    <span className="order-qty-label">
                      • {order.quantity} {order.quantity > 1 ? "items" : "item"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="order-item-right">
                <div className={`status-pill ${getStatusClass(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>

                <div className="view-detail-link">
                  View Detail <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
