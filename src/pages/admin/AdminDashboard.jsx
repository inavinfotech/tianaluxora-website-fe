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
  const [timeframe, setTimeframe] = useState("weekly");

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
        <h1 className="text-2xl font-sans font-extrabold text-[#5a3232] tracking-tight">Admin Dashboard</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Manage luxury catalog, order fulfillment, sales, and inventory stock
        </p>
      </div>

      {/* ── Store KPI Stat Cards (5 Columns, 2 per row on Mobile) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white h-28 rounded-2xl border border-slate-100 animate-pulse"
            />
          ))
        ) : (
          <>
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL REVENUE</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#5a3232] mt-1.5">
                ₹{(stats?.total_revenue ?? 0).toLocaleString("en-IN")}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1">Gross sales earnings</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL ORDERS</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#5a3232] mt-1.5">
                {stats?.total_orders ?? 0}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1">Customer transactions</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CATALOG ITEMS</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#5a3232] mt-1.5">
                {stats?.total_products ?? 0}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1">Active inventory products</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PENDING SHIPPING</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#5a3232] mt-1.5">
                {stats?.pending_orders ?? 0}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1">Awaiting fulfillment</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs col-span-2 lg:col-span-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CUSTOMERS</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#5a3232] mt-1.5">
                {stats?.total_users ?? 0}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1">Registered accounts</p>
            </div>
          </>
        )}
      </div>

      {/* ── Middle Section: Store Performance Trends Chart (Full Width) ── */}
      <div className="w-full">
        {/* Store Trends Overview with Interactive Bar Chart */}
        <div className="w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-[#5a3232]">Store Performance Trends</h3>
              <p className="text-xs text-slate-400 font-medium">
                {timeframe === "weekly" ? "Weekly activity breakdown" : "Monthly activity breakdown"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Timeframe Toggle: Weekly / Monthly */}
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                <button
                  type="button"
                  onClick={() => setTimeframe("weekly")}
                  style={{
                    backgroundColor: timeframe === "weekly" ? "#5a3232" : "transparent",
                    color: timeframe === "weekly" ? "#ffffff" : "#475569"
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  Weekly
                </button>
                <button
                  type="button"
                  onClick={() => setTimeframe("monthly")}
                  style={{
                    backgroundColor: timeframe === "monthly" ? "#5a3232" : "transparent",
                    color: timeframe === "monthly" ? "#ffffff" : "#475569"
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  Monthly
                </button>
              </div>

              {/* Metric Toggle: Revenue / Orders */}
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTrendTab("revenue")}
                  style={{
                    backgroundColor: activeTrendTab === "revenue" ? "#5a3232" : "transparent",
                    color: activeTrendTab === "revenue" ? "#ffffff" : "#475569"
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  Revenue
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTrendTab("orders")}
                  style={{
                    backgroundColor: activeTrendTab === "orders" ? "#5a3232" : "transparent",
                    color: activeTrendTab === "orders" ? "#ffffff" : "#475569"
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  Orders
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Bar Chart */}
          <div className="bg-[#faf7f5] rounded-2xl p-6 border border-slate-100 flex flex-col justify-end min-h-[220px]">
            {stats ? (
              <div className="space-y-4">
                <div className="flex items-end justify-between gap-2 sm:gap-3 h-36 pt-4">
                  {(() => {
                    const trendData = stats.trends?.[timeframe] || (timeframe === "weekly" ? {
                      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                      revenue: [0, 0, 0, 0, 0, 0, 0],
                      orders: [0, 0, 0, 0, 0, 0, 0]
                    } : {
                      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                      revenue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      orders: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    });

                    const labels = trendData.labels || [];
                    const dataList = activeTrendTab === "revenue"
                      ? (trendData.revenue || [])
                      : (trendData.orders || []);
                    const maxVal = Math.max(...dataList, 1);

                    return labels.map((label, idx) => {
                      const val = dataList[idx] || 0;
                      const heightPercent = val > 0 ? Math.max(18, Math.round((val / maxVal) * 100)) : 0;

                      return (
                        <div key={label} className="flex-1 flex flex-col items-center gap-2 group relative">
                          {/* Tooltip */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md pointer-events-none z-10 whitespace-nowrap">
                            {activeTrendTab === "revenue" ? `₹${val.toLocaleString("en-IN")}` : `${val} orders`}
                          </div>

                          {/* Bar Container */}
                          <div className="w-full max-w-[36px] bg-slate-200/80 rounded-t-xl flex items-end h-28 overflow-hidden">
                            {val > 0 ? (
                              <div
                                style={{
                                  height: `${heightPercent}%`,
                                  minHeight: "14px",
                                  backgroundColor: activeTrendTab === "revenue" ? "#5a3232" : "#d48c6a"
                                }}
                                className="w-full rounded-t-xl transition-all duration-700 hover:brightness-125 shadow-sm"
                              />
                            ) : (
                              <div className="w-full h-1 bg-slate-300/50 rounded-full my-1" />
                            )}
                          </div>

                          <span className="text-[10px] font-bold text-slate-400 uppercase">{label}</span>
                        </div>
                      );
                    });
                  })()}
                </div>

                <div className="flex justify-between items-center border-t border-slate-200/60 pt-3 text-xs font-semibold text-slate-500">
                  <span>{timeframe === "weekly" ? "Gross Weekly Volume" : "Gross Monthly Volume"}</span>
                  <span className="font-extrabold text-[#5a3232]">
                    {activeTrendTab === "revenue"
                      ? `₹${(stats.total_revenue || 0).toLocaleString("en-IN")}`
                      : `${stats.total_orders || 0} Total Orders`}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs italic">Loading performance metrics...</div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Section: Recent Store Orders & Low Stock Alerts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Customer Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-2">
            <h3 className="text-sm font-bold text-[#5a3232] flex items-center gap-2">
              <ShoppingBag size={17} className="text-[#5a3232]" />
              Recent Customer Orders
            </h3>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-[#5a3232] hover:underline flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {stats?.recent_orders && stats.recent_orders.length > 0 ? (
              stats.recent_orders.map((o) => {
                const st = (o.status || "pending").toLowerCase();
                return (
                  <div
                    key={o.id || o.order_id}
                    className="py-3 flex items-center justify-between hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
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
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs italic">
                No recent customer orders found
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Warnings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-2">
            <h3 className="text-sm font-bold text-[#5a3232] flex items-center gap-2">
              <AlertTriangle size={17} className="text-amber-500" />
              Inventory Stock Warnings
            </h3>
            <Link
              to="/admin/products"
              className="text-xs font-bold text-[#5a3232] hover:underline flex items-center gap-1"
            >
              Inventory <ChevronRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {stats?.low_stock_products && stats.low_stock_products.length > 0 ? (
              stats.low_stock_products.map((p) => (
                <div
                  key={p.id}
                  className="py-3 flex items-center justify-between hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-[#5a3232]">{p.name || p.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">SKU: {p.sku || "N/A"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                      {p.stock} remaining
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs italic">
                All catalog inventory items are sufficiently stocked
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
