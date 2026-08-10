import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  Menu,
  X,
  Store,
} from "lucide-react";

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/admin/login");
        return;
      }
      const roles = user.roles || (user.role ? [user.role] : []);
      if (!roles.includes("admin") && user.role !== "admin") {
        navigate("/admin/login");
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#faf7f5] flex flex-col items-center justify-center text-[#5a3232] font-sans">
        <div className="w-10 h-10 border-4 border-[#5a3232]/20 border-t-[#5a3232] rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-semibold tracking-wider text-slate-500">Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={17} />,
      end: true,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <Package size={17} />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <ShoppingBag size={17} />,
    },
    {
      name: "Customers",
      path: "/admin/users",
      icon: <Users size={17} />,
    },
  ];

  return (
    <div className="admin-portal flex flex-col md:flex-row min-h-screen bg-[#faf7f5] font-sans text-slate-900 w-full relative">
      {/* Mobile Header Bar */}
      <div className="md:hidden w-full bg-[#5a3232] text-white px-4 py-3 flex justify-between items-center fixed top-0 left-0 z-50 border-b border-white/10 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div>
            <span className="text-xs font-sans font-black tracking-wider text-white block">
              TIANA LUXORA
            </span>
            <span className="text-[9px] font-bold text-[#d4a373] tracking-widest uppercase">
              Admin Panel
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-white bg-white/10 rounded-xl hover:bg-white/20 transition-all cursor-pointer"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-56 bg-[#5a3232] text-white fixed h-screen border-r border-white/5 flex flex-col z-50 transition-transform duration-300 shadow-xl
          max-md:top-0 max-md:left-0
          ${isSidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full md:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
          <div>
            <h2 className="text-sm font-sans font-black tracking-wider text-white">
              TIANA LUXORA
            </h2>
            <p className="text-[9px] font-bold text-[#d4a373] tracking-widest uppercase mt-0.5">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-white/15 text-[#d4a373] border-l-2 border-[#d4a373]"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Left: Compact User Profile & Logout Icon Button */}
        <div className="p-3 border-t border-white/10">
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full bg-[#d4a373] text-[#5a3232] font-bold text-xs flex items-center justify-center border border-white/10 flex-shrink-0">
                {(user.full_name || user.email || "A")[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {user.full_name || "System Administrator"}
                </p>
                <p className="text-[10px] text-slate-300 truncate mt-0.5">{user.email}</p>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate("/admin/login");
              }}
              title="Logout"
              className="p-2 text-red-300 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg transition-all cursor-pointer flex-shrink-0 border border-red-500/20"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 md:ml-56 p-6 max-w-7xl max-md:p-4 max-md:pt-20 w-full text-slate-900">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
