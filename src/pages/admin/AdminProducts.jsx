import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  Edit2,
  X,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: "",
    description: "",
    category: "",
    image_url: "",
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.items || [];
        setProducts(list);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      price: "",
      quantity: "10",
      description: "",
      category: "Luxury Fragrance",
      image_url: "",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || product.title || "",
      sku: product.sku || "",
      price: product.price || "",
      quantity: product.quantity ?? product.stock ?? 10,
      description: product.description || "",
      category: product.category || "Luxury Fragrance",
      image_url: product.image_url || product.image || (product.images && product.images[0]) || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const token = localStorage.getItem("token");
    const payload = {
      name: formData.name,
      sku: formData.sku,
      price: parseFloat(formData.price) || 0,
      quantity: parseInt(formData.quantity, 10) || 0,
      description: formData.description,
      category: formData.category,
      image_url: formData.image_url,
      images: formData.image_url ? [formData.image_url] : [],
    };

    try {
      const url = editingProduct
        ? `${API_BASE_URL}/api/admin/products/${editingProduct.id}`
        : `${API_BASE_URL}/api/admin/products`;

      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage({
          type: "success",
          text: `Product successfully ${editingProduct ? "updated" : "created"}!`,
        });
        setShowModal(false);
        fetchProducts();
      } else {
        const err = await res.json();
        setMessage({
          type: "error",
          text: err.detail || "Failed to save product",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error occurred" });
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.name || p.title || "").toLowerCase().includes(q) ||
      (p.sku || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#5a3232]">Product Catalog</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage store products, variants, pricing & inventory stock
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          style={{ backgroundColor: "#5a3232", color: "#ffffff" }}
          className="flex items-center justify-center gap-2 font-bold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-md active:scale-95 cursor-pointer hover:opacity-95"
        >
          <Plus size={16} /> Add Product
        </button>
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
          placeholder="Search by product name, SKU, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs font-medium outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <div className="w-8 h-8 border-3 border-[#5a3232]/20 border-t-[#5a3232] rounded-full animate-spin mx-auto mb-2" />
            Loading catalog products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs italic">
            No products found matching "{search}"
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#faf7f5] border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredProducts.map((p) => {
                  const img = p.image_url || p.image || (p.images && p.images[0]);
                  const qty = p.quantity ?? p.stock ?? 0;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {img ? (
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon size={16} className="text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-[#5a3232]">{p.name || p.title}</p>
                            <p className="text-[10px] text-slate-400">{p.category || "General"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{p.sku || "N/A"}</td>
                      <td className="py-3.5 px-4 font-bold text-[#5a3232]">
                        ₹{(parseFloat(p.price) || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            qty <= 5
                              ? "bg-red-50 text-red-600 border-red-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {qty} in stock
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-[#5a3232] transition-colors cursor-pointer"
                        >
                          <Edit2 size={15} />
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

      {/* Modal for Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 border border-slate-100 shadow-2xl space-y-5 relative">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-lg font-serif font-bold text-[#5a3232]">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Amber Oud EDP"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#5a3232]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#5a3232]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Luxury Fragrance"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#5a3232]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2499"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#5a3232]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="50"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#5a3232]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#5a3232]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description and scent notes..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#5a3232]"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ backgroundColor: "#5a3232", color: "#ffffff" }}
                  className="w-1/2 py-3 font-bold rounded-2xl transition-all shadow-md disabled:opacity-50 hover:opacity-95"
                >
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
