import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProfilePage = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && showOrderHistory) {
      fetchOrders();
    }
  }, [user, showOrderHistory]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8003/orders/?user_id=${user.user_id}`,
        {
          headers: {
            "X-API-KEY": "tiana_web_key_12345",
            "X-API-SECRET": "tiana_web_secret_67890",
          },
        },
      );
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

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-(--accent) border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-12 pb-12 px-4 sm:px-6">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-(--accent)/20 border-2 border-(--accent) flex items-center justify-center text-4xl font-serif text-(--accent)">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="px-6 py-2 text-sm border border-red-500/30 text-red-400 rounded-full hover:bg-red-500/10 transition-colors"
            >
              Sign Out
            </button>
            <button
              onClick={() => setShowOrderHistory(!showOrderHistory)}
              className={`w-full px-6 py-2 text-sm rounded-full transition-colors ${showOrderHistory ? "bg-(--accent) text-white" : "border border-(--accent)/30 text-(--accent) hover:bg-(--accent)/10"}`}
            >
              {showOrderHistory ? "View Account" : "Order History"}
            </button>
          </div>

          {/* Details Section */}
          <div className="flex-1 w-full space-y-6">
            {!showOrderHistory ? (
              <>
                <div>
                  <h2 className="text-3xl font-light mb-1 text-primary">
                    My Profile
                  </h2>
                  <p className="text-sm text-primary/60">
                    Manage your Tiana Luxora account
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                    <label className="block text-xs uppercase tracking-wider text-primary/50 mb-1">
                      Full Name
                    </label>
                    <div className="text-lg text-white">
                      {user.full_name || "Not provided"}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                    <label className="block text-xs uppercase tracking-wider text-primary/50 mb-1">
                      Email Address
                    </label>
                    <div className="text-lg text-white">
                      {user.email || user.username || "Not provided"}
                    </div>
                  </div>

                  {user.user_id && (
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                      <label className="block text-xs uppercase tracking-wider text-primary/50 mb-1">
                        User ID
                      </label>
                      <div className="text-sm text-white/70 font-mono break-all">
                        {user.user_id}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-light mb-1 text-primary">
                    Order History
                  </h2>
                  <p className="text-sm text-primary/60">
                    Manage and track your orders
                  </p>
                </div>

                {ordersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-24 rounded-xl bg-white/5 animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-20 bg-black/10 rounded-2xl border border-dashed border-white/10">
                    <p className="text-primary/40 italic">
                      You haven't placed any orders yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 rounded-xl bg-black/20 border border-white/5 flex flex-col sm:flex-row justify-between gap-4"
                      >
                        <div>
                          <div className="text-xs text-primary/40 mb-1">
                            Order ID: {order.id.split("-")[0].toUpperCase()}
                          </div>
                          <div className="text-lg text-white">
                            {order.product_name}
                          </div>
                          <div className="text-sm text-primary/60">
                            {new Date(order.created_at).toLocaleDateString()} •{" "}
                            {order.quantity}{" "}
                            {order.quantity > 1 ? "items" : "item"}
                          </div>
                        </div>
                        <div className="flex flex-col items-start sm:items-end justify-between">
                          <div className="text-lg font-bold text-(--accent)">
                            {order.currency} {order.total_amount.toFixed(2)}
                          </div>
                          <div className="px-3 py-1 rounded-full bg-white/5 text-xs border border-white/10 text-(--accent) uppercase tracking-widest">
                            {order.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
