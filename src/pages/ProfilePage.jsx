import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Heart,
  Search,
  Filter,
  ArrowRight,
  Receipt,
  CheckCircle,
} from "lucide-react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import api from "../utils/api";
import { getPath } from "../utils/paths";
import AddressForm from "../components/AddressForm";
import OrdersPage from "./OrdersPage";
import OrderDetailPage from "./OrderDetailPage";
import "../styles/Profile.css";

const ProfilePage = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { "*": subPath } = useParams();

  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [address, setAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({ full_name: "" });
  const [transactions, setTransactions] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  // Sync active tab with URL
  const activeTab = subPath?.split("/")[0] || "overview";

  useEffect(() => {
    if (!loading && !user) navigate(getPath("/login"));
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      if (activeTab === "overview") fetchRecentOrders();
      if (activeTab === "addresses") fetchAddress();
      if (activeTab === "payments") fetchTransactions();
    }
  }, [user, activeTab]);

  const fetchAddress = async () => {
    try {
      setAddressLoading(true);
      const res = await api.get("/api/auth/me/address");
      if (res.ok) {
        const data = await res.json();
        setAddress(data);
      }
    } catch (err) {
      console.error("Could not retrieve address:", err);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleSaveAddress = async (formData) => {
    try {
      setAddressLoading(true);
      const res = await api.post("/api/auth/me/address", formData);
      if (res.ok) {
        const data = await res.json();
        setAddress(data);
        setIsEditingAddress(false);
      }
    } catch (err) {
      console.error("Failed to save address:", err);
    } finally {
      setAddressLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await api.get(`/api/orders/`);
      if (res.ok) {
        const data = await res.json();
        setRecentOrders(data.slice(0, 2)); // Only show last 2 orders
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setPaymentsLoading(true);
      const res = await api.get("/api/orders/");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setPaymentsLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setOrdersLoading(true);
      const res = await api.put("/api/auth/profile", profileFormData);
      if (res.ok) {
        setIsEditingProfile(false);
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: "overview", label: "Overview", icon: User, path: "/profile" },
    {
      id: "orders",
      label: "My Orders",
      icon: Package,
      path: "/profile/orders",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: Heart,
      path: "/profile/wishlist",
    },
    {
      id: "addresses",
      label: "Addresses",
      icon: MapPin,
      path: "/profile/addresses",
    },
    {
      id: "payments",
      label: "Payments",
      icon: CreditCard,
      path: "/profile/payments",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/profile/settings",
    },
  ];

  return (
    <div className="profile-container">
      <div className="profile-layout">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="sidebar-glass-card">
            <div className="user-profile-header">
              <div className="avatar-wrapper">
                <div className="profile-avatar">
                  {user.full_name
                    ? user.full_name.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <div className="badge-icon">
                  <ShieldCheck size={14} style={{ color: "#d48c6a" }} />
                </div>
              </div>
              <h2 className="profile-name">
                {user.full_name || "Valued Customer"}
              </h2>
              <p className="membership-label">Premium Member</p>
            </div>

            <nav className="sidebar-nav">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={getPath(item.path)}
                  className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                >
                  <item.icon size={18} />
                  {item.label}
                  {activeTab === item.id && (
                    <div className="nav-indicator"></div>
                  )}
                </Link>
              ))}

              <div className="sign-out-button">
                <button
                  onClick={() => {
                    logout();
                    navigate(getPath("/"));
                  }}
                  className="logout-link"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </nav>
          </div>

          <div className="upgrade-card">
            <h4 className="upgrade-title">Tiana Gold Access</h4>
            <p className="upgrade-text">
              You're entitled to complimentary fragrance consultation sessions.
            </p>
            <button className="upgrade-link">
              Book Session <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="profile-content">
          <Routes>
            {/* Overview */}
            <Route
              path="/"
              element={
                <div className="space-y-8 animate-slide-left">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        label: "Total Orders",
                        value: "0" + recentOrders.length,
                        icon: Package,
                      },
                      { label: "Wishlist Items", value: "05", icon: Heart },
                      {
                        label: "Account Age",
                        value: "2 Months",
                        icon: ShieldCheck,
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="bg-white/30 backdrop-blur-md border border-white/20 p-6 rounded-4xl shadow-sm flex flex-col gap-2"
                      >
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-2">
                          <stat.icon size={20} />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-primary/40">
                          {stat.label}
                        </span>
                        <span className="text-2xl font-serif font-black text-primary">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-4xl overflow-hidden shadow-xl">
                    <div className="px-8 py-6 border-b border-primary/5 flex items-center justify-between">
                      <h3 className="text-xl font-serif font-bold text-primary">
                        Personal Information
                      </h3>
                      {!isEditingProfile ? (
                        <button
                          onClick={() => {
                            setProfileFormData({ full_name: user.full_name });
                            setIsEditingProfile(true);
                          }}
                          className="text-[10px] font-black uppercase tracking-widest text-accent border-b border-accent pb-0.5"
                        >
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex gap-4">
                          <button
                            onClick={() => setIsEditingProfile(false)}
                            className="text-[10px] font-black uppercase tracking-widest text-primary/40"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            className="text-[10px] font-black uppercase tracking-widest text-accent border-b border-accent pb-0.5"
                          >
                            Save Changes
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-primary/30 tracking-widest">
                          Full Legal Name
                        </p>
                        {!isEditingProfile ? (
                          <p className="text-lg font-medium text-primary">
                            {user.full_name || "Not Specified"}
                          </p>
                        ) : (
                          <input
                            type="text"
                            value={profileFormData.full_name}
                            onChange={(e) =>
                              setProfileFormData({
                                ...profileFormData,
                                full_name: e.target.value,
                              })
                            }
                            className="w-full bg-white/50 border border-primary/10 rounded-xl px-4 py-2 focus:border-accent outline-hidden"
                          />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-primary/30 tracking-widest">
                          Email Address
                        </p>
                        <p className="text-lg font-medium text-primary opacity-60 italic">
                          {user.email || user.username} (Non-editable)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-xl font-serif font-bold text-primary">
                        Recent Orders
                      </h3>
                      <Link
                        to={getPath("/profile/orders")}
                        className="text-[10px] font-bold text-primary/40 hover:text-accent uppercase tracking-widest flex items-center gap-1 transition-colors"
                      >
                        View All Orders <ChevronRight size={14} />
                      </Link>
                    </div>
                    {ordersLoading ? (
                      <div className="h-40 bg-white/20 rounded-4xl border-2 border-dashed border-primary/5 animate-pulse flex items-center justify-center">
                        <p className="text-sm font-medium text-primary/20">
                          Syncing with boutique...
                        </p>
                      </div>
                    ) : recentOrders.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recentOrders.map((order) => (
                          <Link
                            key={order.id}
                            to={getPath(`/profile/orders/${order.id}`)}
                            className="bg-white p-6 rounded-4xl shadow-lg border border-primary/5 hover:border-accent/30 transition-all flex gap-4 items-center group"
                          >
                            <div className="w-16 h-16 rounded-2xl bg-neutral-50 p-2 shrink-0">
                              <img
                                src={order.image}
                                alt={order.product_name}
                                className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif font-bold text-primary truncate capitalize">
                                {order.product_name}
                              </h4>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                                {order.status}
                              </span>
                            </div>
                            <ChevronRight
                              size={18}
                              className="text-primary/10 group-hover:text-accent"
                            />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white/20 p-12 rounded-4xl border-2 border-dashed border-primary/5 text-center">
                        <p className="text-sm font-medium text-primary/40">
                          No recent activity detected.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              }
            />

            {/* Orders */}
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:orderId" element={<OrderDetailPage />} />

            {/* Addresses */}
            <Route
              path="/addresses"
              element={
                <div className="space-y-6 animate-slide-left">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-serif font-bold text-primary">
                      Saved Address
                    </h3>
                    {!isEditingAddress && address && (
                      <button
                        onClick={() => setIsEditingAddress(true)}
                        className="text-[10px] font-black uppercase tracking-widest text-accent border-b border-accent pb-0.5"
                      >
                        Edit Address
                      </button>
                    )}
                  </div>
                  {addressLoading && !isEditingAddress ? (
                    <div className="h-48 bg-white/20 rounded-4xl border-2 border-dashed border-primary/5 animate-pulse flex items-center justify-center">
                      <p className="text-sm font-medium text-primary/20">
                        Accessing archives...
                      </p>
                    </div>
                  ) : isEditingAddress || !address ? (
                    <div className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-4xl p-8 shadow-xl">
                      <AddressForm
                        initialData={address || {}}
                        onSave={handleSaveAddress}
                        onCancel={
                          address ? () => setIsEditingAddress(false) : null
                        }
                        isProcessing={addressLoading}
                      />
                    </div>
                  ) : (
                    <div className="bg-white p-8 rounded-4xl shadow-lg border border-primary/5 flex flex-col md:flex-row gap-8 items-start relative group overflow-hidden">
                      <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center text-accent shrink-0">
                        <MapPin size={28} />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-primary font-medium">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-primary/30 tracking-widest">
                              Recipient
                            </p>
                            <p className="text-lg">{address.full_name}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-primary/30 tracking-widest">
                              Telephone
                            </p>
                            <p className="text-lg">{address.phone_number}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-primary/30 tracking-widest">
                            Street Address
                          </p>
                          <p className="text-lg leading-relaxed">
                            {address.address_line}
                          </p>
                          <p className="text-lg">
                            {address.city}, {address.state} -{" "}
                            {address.postal_code}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              }
            />

            {/* Payments */}
            <Route
              path="/payments"
              element={
                <div className="space-y-8 animate-slide-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-linear-to-br from-secondary to-black p-8 rounded-4xl text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/20 transition-colors"></div>
                      <div className="flex justify-between items-start mb-12">
                        <ShieldCheck size={32} className="text-accent" />
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40">
                          Luxury Preferred
                        </span>
                      </div>
                      <p className="text-xs uppercase tracking-[0.2em] opacity-60 mb-1">
                        Primary Method
                      </p>
                      <h4 className="text-xl font-serif font-bold tracking-widest mb-6">
                        UPI / Razorpay
                      </h4>
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold opacity-40">
                          Default Gateway
                        </span>
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/5 flex items-center justify-center text-[8px] font-bold">
                            VISA
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/5 flex items-center justify-center text-[8px] font-bold">
                            MC
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/30 backdrop-blur-md border border-dashed border-primary/20 p-8 rounded-4xl flex flex-col items-center justify-center text-center gap-3 group cursor-pointer hover:bg-white/50 transition-all">
                      <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary/20 group-hover:bg-accent/10 group-hover:text-accent transition-all">
                        <CreditCard size={24} />
                      </div>
                      <span className="text-xs font-bold text-primary/40">
                        Add New Payment Method
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-xl font-serif font-bold text-primary">
                        Transaction History
                      </h3>
                      <button className="text-[10px] font-bold text-primary/40 hover:text-accent uppercase tracking-widest flex items-center gap-2">
                        <Receipt size={14} /> Download Ledger
                      </button>
                    </div>

                    {paymentsLoading ? (
                      <div className="h-60 bg-white/20 rounded-4xl border-2 border-dashed border-primary/5 animate-pulse flex items-center justify-center">
                        <p className="text-sm font-medium text-primary/20">
                          Auditing ledgers...
                        </p>
                      </div>
                    ) : (
                      <div className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-4xl overflow-hidden shadow-xl">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-primary/5 text-[10px] uppercase tracking-widest font-black text-primary/30">
                              <th className="px-8 py-5">Reference</th>
                              <th className="px-8 py-5">Date</th>
                              <th className="px-8 py-5">Method</th>
                              <th className="px-8 py-5 text-right">Amount</th>
                              <th className="px-8 py-5 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm text-primary">
                            {transactions.map((txn) => (
                              <tr
                                key={txn.id}
                                className="border-b border-primary/5 last:border-0 hover:bg-white/40 transition-colors group"
                              >
                                <td className="px-8 py-4 font-mono text-[10px] opacity-60 uppercase">
                                  {txn.id}
                                </td>
                                <td className="px-8 py-4 font-medium">
                                  {txn.date}
                                </td>
                                <td className="px-8 py-4 text-xs opacity-80">
                                  {txn.method}
                                </td>
                                <td className="px-8 py-4 text-right font-bold">
                                  ₹{(txn.total_amount || txn.amount || 0).toLocaleString()}
                                </td>
                                <td className="px-8 py-4 text-right">
                                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                    <CheckCircle size={10} /> {txn.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              }
            />

            {/* Wishlist / Settings Fallback */}
            <Route
              path="*"
              element={
                <div className="h-[60vh] bg-white/20 rounded-4xl border-2 border-dashed border-primary/5 flex flex-col items-center justify-center gap-4 text-center p-8 animate-fade-in text-primary/60">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent animate-bounce">
                    <Settings size={32} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold">Coming Soon</h3>
                  <p className="text-sm font-medium opacity-60">
                    We are meticulously crafting the {activeTab} section to meet
                    our luxury standards.
                  </p>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
