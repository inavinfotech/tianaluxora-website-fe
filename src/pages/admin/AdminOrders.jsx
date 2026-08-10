import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  ChevronRight,
  X,
  CheckCircle,
  AlertCircle,
  Truck,
  Package,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const STATUS_BADGES = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  created: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.items || []);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ to_status: newStatus }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: `Order updated to ${newStatus}` });
        setSelectedOrder(null);
        fetchOrders();
      } else {
        const err = await res.json();
        setMessage({ type: "error", text: err.detail || "Status update failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    const id = String(o.id || o.order_id || "").toLowerCase();
    const customer = (o.customer_name || o.user_id || "").toLowerCase();
    const status = (o.status || "").toLowerCase();
    return id.includes(q) || customer.includes(q) || status.includes(q);
  });

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#5a3232]">Customer Orders</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Track customer purchases, update fulfillment status & view details
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search orders by Order ID, customer, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs font-medium outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <div className="w-8 h-8 border-3 border-[#5a3232]/20 border-t-[#5a3232] rounded-full animate-spin mx-auto mb-2" />
            Loading store orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs italic">
            No orders found matching "{search}"
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#faf7f5] border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredOrders.map((o) => {
                  const idStr = String(o.id || o.order_id || "");
                  const st = (o.status || "pending").toLowerCase();
                  return (
                    <tr key={idStr} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#5a3232]">
                        #{idStr.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4">{o.customer_name || o.user_id || "Customer"}</td>
                      <td className="py-3.5 px-4 font-bold text-[#5a3232]">
                        ₹{(o.total_amount || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            STATUS_BADGES[st] || STATUS_BADGES.pending
                          }`}
                        >
                          {st}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {o.created_at ? new Date(o.created_at).toLocaleDateString() : "Recent"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-[#5a3232] hover:text-white rounded-xl text-slate-600 font-bold transition-all text-[11px] cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 border border-slate-100 shadow-2xl space-y-5 relative">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#5a3232]">
                  Order #{String(selectedOrder.id || selectedOrder.order_id).slice(-8).toUpperCase()}
                </h3>
                <p className="text-[10px] text-slate-400">
                  Placed on {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : "Recent"}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#faf7f5] p-3.5 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer</p>
                  <p className="font-bold text-[#5a3232] mt-0.5">
                    {selectedOrder.customer_name || selectedOrder.user_id || "Customer"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Amount</p>
                  <p className="text-base font-extrabold text-[#5a3232]">
                    ₹{(selectedOrder.total_amount || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Status transition actions */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Update Fulfillment Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {["processing", "shipped", "delivered", "cancelled"].map((st) => (
                    <button
                      key={st}
                      disabled={updating || selectedOrder.status === st}
                      onClick={() => handleStatusChange(selectedOrder.id || selectedOrder.order_id, st)}
                      className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all border ${
                        selectedOrder.status === st
                          ? "bg-[#5a3232] text-white border-[#5a3232]"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
