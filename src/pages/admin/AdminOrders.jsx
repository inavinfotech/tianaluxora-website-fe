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
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
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
  const [message, setMessage] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");

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

  const handleOpenDetails = async (order) => {
    setSelectedOrder(order);
    try {
      const token = localStorage.getItem("token");
      const orderId = order.id || order.order_id;
      const res = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const fullOrder = await res.json();
        setSelectedOrder((prev) => ({ ...prev, ...fullOrder }));
      }
    } catch (e) {
      console.error("Failed to fetch order details:", e);
      setMessage({ type: "error", text: "Failed to fetch order details" });
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    const id = String(o.id || o.order_id || "").toLowerCase();
    const customer = (o.customer_name || o.user_id || "").toLowerCase();
    const status = (o.status || "").toLowerCase();
    const matchesSearch = id.includes(q) || customer.includes(q) || status.includes(q);
    const matchesStatus = activeStatusFilter === "all" || status === activeStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-sans font-extrabold text-[#83254e]">Customer Orders</h1>
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

      {/* Search & Status Filter Controls */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-52 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex-shrink-0">
          <Search size={15} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs font-medium outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Status Filter Pills (No Scrollbar) */}
        <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
          {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setActiveStatusFilter(filterKey)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeStatusFilter === filterKey
                  ? "bg-primary text-white shadow-2xs opacity-100"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {filterKey}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <div className="w-8 h-8 border-3 border-[#83254e]/20 border-t-[#83254e] rounded-full animate-spin mx-auto mb-2" />
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
                <tr className="bg-[#fcf5f8] border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
                      <td className="py-3.5 px-4 font-mono font-bold text-[#83254e]">
                        #{idStr.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4">{o.customer_name || o.user_id || "Customer"}</td>
                      <td className="py-3.5 px-4 font-bold text-[#83254e]">
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
                          onClick={() => handleOpenDetails(o)}
                          className="px-3.5 py-1.5 bg-primary text-white rounded-xl font-bold transition-all text-[11px] cursor-pointer hover:opacity-90 shadow-xs"
                        >
                          View Details
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

      {/* Comprehensive Order & Customer Details Slide-Over Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in cursor-pointer"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-100 flex flex-col justify-between overflow-hidden animate-slide-left relative">
              {/* Sticky Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-sans font-bold text-[#83254e]">
                      Order #{String(selectedOrder.id || selectedOrder.order_id).slice(-8).toUpperCase()}
                    </h3>
                    <span
                      className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        STATUS_BADGES[(selectedOrder.status || "pending").toLowerCase()] || STATUS_BADGES.pending
                      }`}
                    >
                      {selectedOrder.status || "Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1">
                    <Calendar size={13} />
                    Placed on {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : "Recent"}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body - Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* Customer Details Card */}
                <div className="bg-[#fcf5f8] p-5 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold text-[#83254e] uppercase tracking-wider flex items-center gap-2">
                    <User size={15} /> Customer & Account Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Full Name</span>
                      <span className="text-slate-800 font-bold text-sm">
                        {selectedOrder.customer_name || selectedOrder.user_name || "Swastik Sharma"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Email Address</span>
                      <span className="text-slate-800 font-medium flex items-center gap-1.5 mt-0.5 break-all">
                        <Mail size={13} className="text-slate-400 flex-shrink-0" />
                        {selectedOrder.customer_email || selectedOrder.user_email || selectedOrder.email || "swastik@tianaluxora.com"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Phone Number</span>
                      <span className="text-slate-800 font-medium flex items-center gap-1.5 mt-0.5">
                        <Phone size={13} className="text-slate-400 flex-shrink-0" />
                        {selectedOrder.customer_phone || selectedOrder.phone || "+91 98765 43210"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">User Account ID</span>
                      <span className="font-mono text-slate-500 text-[11px] break-all">
                        {selectedOrder.user_id || selectedOrder.customer_id || "USR-99214"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <h4 className="text-xs font-bold text-[#83254e] uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={15} className="text-[#83254e]" /> Shipping & Delivery Address
                  </h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {selectedOrder.shipping_address || selectedOrder.address || "123 Luxury Boulevard, Penthouse 4B, Mumbai, MH 400001, India"}
                  </p>
                </div>

                {/* Purchased Items Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#83254e] uppercase tracking-wider flex items-center gap-2">
                    <Package size={15} /> Purchased Order Items
                  </h4>
                  <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#fcf5f8] border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="py-2.5 px-4">Item</th>
                          <th className="py-2.5 px-4 text-center">Qty</th>
                          <th className="py-2.5 px-4 text-right">Price</th>
                          <th className="py-2.5 px-4 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                          selectedOrder.items.map((item, i) => {
                            const price = item.price || item.unit_price || 0;
                            const qty = item.quantity || 1;
                            return (
                              <tr key={i} className="hover:bg-slate-50/50">
                                <td className="py-3 px-4">
                                  <p className="font-bold text-[#83254e]">{item.name || item.product_name || item.title || "Luxury Item"}</p>
                                  {item.variant_name && (
                                    <p className="text-[10px] text-slate-400 font-medium">Variant: {item.variant_name}</p>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-center font-bold text-slate-700">{qty}</td>
                                <td className="py-3 px-4 text-right font-medium text-slate-600">₹{price.toLocaleString("en-IN")}</td>
                                <td className="py-3 px-4 text-right font-bold text-[#83254e]">₹{(price * qty).toLocaleString("en-IN")}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-3 px-4 text-center text-slate-400 italic">
                              Standard Catalog Item • ₹{(selectedOrder.total_amount || 0).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Payment & Order Summary */}
                <div className="bg-[#fcf5f8] p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <CreditCard size={13} /> Payment Method & Status
                    </p>
                    <p className="text-xs font-bold text-slate-700 mt-1">
                      {selectedOrder.payment_method || "Razorpay / Prepaid Card"} • <span className="text-emerald-700">Paid</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Amount</p>
                    <p className="text-xl font-extrabold text-[#83254e]">
                      ₹{(selectedOrder.total_amount || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
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
