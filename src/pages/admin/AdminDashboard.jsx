import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  AlertTriangle,
  ChevronRight,
  Plus,
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

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTrendTab, setActiveTrendTab] = useState("revenue");
  const [actionSearch, setActionSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to fetch admin stats:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Store Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#5a3232] tracking-tight">Admin Dashboard</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Manage luxury catalog, order fulfillment, sales, and inventory stock
        </p>
      </div>

      {/* ── Store KPI Stat Cards (4 Columns) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white h-28 rounded-2xl border border-slate-100 animate-pulse"
            />
          ))
        ) : (
          <>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL REVENUE</p>
              <h3 className="text-3xl font-extrabold text-[#5a3232] mt-1.5">
                ₹{(stats?.total_revenue ?? 0).toLocaleString("en-IN")}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Processed earnings</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL ORDERS</p>
              <h3 className="text-3xl font-extrabold text-[#5a3232] mt-1.5">
                {stats?.total_orders ?? 0}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Lifetime customer orders</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CATALOG PRODUCTS</p>
              <h3 className="text-3xl font-extrabold text-[#5a3232] mt-1.5">
                {stats?.total_products ?? 0}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Active items</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PENDING FULFILLMENT</p>
              <h3 className="text-3xl font-extrabold text-[#5a3232] mt-1.5">
                {stats?.pending_orders ?? 0}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Orders awaiting shipping</p>
            </div>
          </>
        )}
      </div>

      {/* ── Middle Section: Store Trends Overview & Actions Panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store Trends Overview (Span 2) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-[#5a3232]">Store Performance</h3>
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
              <button
                onClick={() => setActiveTrendTab("revenue")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeTrendTab === "revenue"
                    ? "bg-white text-slate-800 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setActiveTrendTab("orders")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeTrendTab === "orders"
                    ? "bg-white text-slate-800 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Orders
              </button>
            </div>
          </div>

          <div className="bg-[#faf7f5] rounded-xl p-12 text-center border border-slate-100 flex-1 min-h-[180px] flex flex-col items-center justify-center">
            {stats && stats.total_orders > 0 ? (
              <div className="space-y-1">
                <p className="text-2xl font-extrabold text-[#5a3232]">
                  {activeTrendTab === "revenue"
                    ? `₹${(stats.total_revenue || 0).toLocaleString("en-IN")}`
                    : `${stats.total_orders} Total Orders`}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {activeTrendTab === "revenue"
                    ? "Total gross revenue generated across all completed purchases"
                    : "Total purchase transactions placed by customers"}
                </p>
              </div>
            ) : (
              <p className="text-slate-400 text-sm italic">No recorded sales stats yet</p>
            )}
          </div>
        </div>

        {/* Store Quick Actions Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between space-y-4">
          <h3 className="text-base font-bold text-[#5a3232]">Quick Actions Panel</h3>

          <div className="bg-[#faf7f5] p-4 rounded-xl border border-slate-100 space-y-3">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              SEARCH CATALOG
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search items or orders..."
                value={actionSearch}
                onChange={(e) => setActionSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs placeholder:text-slate-400 font-medium outline-none focus:border-[#5a3232]"
              />
            </div>
            <Link
              to="/admin/products"
              style={{ backgroundColor: "#5a3232", color: "#ffffff" }}
              className="w-full flex items-center justify-center gap-1.5 font-bold rounded-xl py-2.5 text-xs transition-all shadow-xs hover:opacity-95"
            >
              <Plus size={15} /> Add New Product
            </Link>
          </div>

          <div>
            <Link
              to="/admin/orders"
              style={{ backgroundColor: "#2b1616", color: "#ffffff" }}
              className="w-full flex items-center justify-center gap-1.5 font-bold rounded-xl py-2.5 text-xs transition-all shadow-xs hover:opacity-95"
            >
              <ShoppingBag size={15} /> Manage Orders & Status
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom Section: Recent Store Orders & Low Stock Alerts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Customer Orders */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-[#5a3232] flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#5a3232]" />
              Recent Customer Orders
            </h3>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-[#5a3232] hover:underline flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="bg-[#faf7f5] rounded-xl p-4 border border-slate-100 flex-1 min-h-[140px]">
            {stats?.recent_orders && stats.recent_orders.length > 0 ? (
              <div className="space-y-2.5">
                {stats.recent_orders.map((o) => {
                  const st = (o.status || "pending").toLowerCase();
                  return (
                    <div
                      key={o.id || o.order_id}
                      className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-center justify-between hover:border-slate-300 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#5a3232]">
                          Order #{String(o.id || o.order_id).slice(-8).toUpperCase()}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {o.created_at ? new Date(o.created_at).toLocaleDateString() : "Recent"} • {o.items?.length || o.quantity || 1} item(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-[#5a3232]">
                          ₹{(o.total_amount || 0).toLocaleString("en-IN")}
                        </p>
                        <span
                          className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mt-0.5 ${
                            STATUS_BADGES[st] || STATUS_BADGES.pending
                          }`}
                        >
                          {st}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs italic">
                No recent customer orders found
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Warnings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-[#5a3232] flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              Inventory Stock Warnings
            </h3>
            <Link
              to="/admin/products"
              className="text-xs font-bold text-[#5a3232] hover:underline flex items-center gap-1"
            >
              Inventory <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-2.5 flex-1">
            {stats?.low_stock_products && stats.low_stock_products.length > 0 ? (
              stats.low_stock_products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-[#5a3232]">{p.name || p.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">SKU: {p.sku || "N/A"}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
                    {p.stock} remaining
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-[#faf7f5] rounded-xl p-8 text-center border border-slate-100 flex-1 flex items-center justify-center">
                <p className="text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                  ✓ All products have adequate inventory stock.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
