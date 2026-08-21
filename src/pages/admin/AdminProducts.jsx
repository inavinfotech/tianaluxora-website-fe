import React, { useState, useEffect } from "react";
import {
  Package,
  Search,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Layers,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const getProductPriceVal = (p) => {
  if (!p) return 0;
  if (p.price != null && p.price !== "") {
    const parsed = parseFloat(String(p.price).replace(/[^0-9.]/g, ""));
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (p.unit_price != null && p.unit_price !== "") {
    const parsed = parseFloat(String(p.unit_price).replace(/[^0-9.]/g, ""));
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (p.base_price != null && p.base_price !== "") {
    const parsed = parseFloat(String(p.base_price).replace(/[^0-9.]/g, ""));
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  const variants = p.real_variants || p.variants || [];
  if (Array.isArray(variants) && variants.length > 0) {
    const variantPrices = variants
      .map((v) => parseFloat(String(v.price || v.unit_price || 0).replace(/[^0-9.]/g, "")))
      .filter((pr) => !isNaN(pr) && pr > 0);
    if (variantPrices.length > 0) {
      return Math.min(...variantPrices);
    }
  }
  return 0;
};

const getProductImage = (p) => {
  if (!p) return "";

  // 1. Direct product image properties
  let rawImg =
    p.image ||
    p.image_url ||
    (Array.isArray(p.images) && p.images[0]) ||
    (Array.isArray(p.media) && p.media[0] && (p.media[0].url || p.media[0].src));

  // 2. Fallback to any variant's image if main product image is empty
  if (!rawImg || (typeof rawImg === "string" && rawImg.trim() === "")) {
    const variants = p.real_variants || p.variants || [];
    if (Array.isArray(variants)) {
      for (const v of variants) {
        if (!v) continue;
        const vImg =
          v.image ||
          v.image_url ||
          (Array.isArray(v.images) && v.images[0]) ||
          (Array.isArray(v.media) && v.media[0] && (v.media[0].url || v.media[0].src));
        if (vImg && typeof vImg === "string" && vImg.trim() !== "") {
          rawImg = vImg;
          break;
        }
      }
    }
  }

  if (!rawImg || typeof rawImg !== "string") return "";
  return rawImg.trim();
};

const formatProductPriceDisplay = (p) => {
  if (!p) return "₹0";
  const variants = p.real_variants || p.variants || [];
  if (Array.isArray(variants) && variants.length > 0) {
    const variantPrices = variants
      .map((v) => parseFloat(String(v.price || v.unit_price || 0).replace(/[^0-9.]/g, "")))
      .filter((pr) => !isNaN(pr) && pr > 0);

    if (variantPrices.length > 0) {
      const minPrice = Math.min(...variantPrices);
      const maxPrice = Math.max(...variantPrices);

      if (minPrice === maxPrice) {
        return `₹${minPrice.toLocaleString("en-IN")}`;
      } else {
        return `₹${minPrice.toLocaleString("en-IN")} – ₹${maxPrice.toLocaleString("en-IN")}`;
      }
    }
  }

  const rootPrice = getProductPriceVal(p);
  if (p.discounted_price && p.discounted_price < rootPrice) {
    return (
      <div className="flex flex-col">
        <span className="text-emerald-700 font-bold">₹{p.discounted_price.toLocaleString("en-IN")}</span>
        <span className="text-[10px] text-slate-400 line-through">MRP ₹{rootPrice.toLocaleString("en-IN")}</span>
      </div>
    );
  }
  return `₹${rootPrice.toLocaleString("en-IN")}`;
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedProductIds, setExpandedProductIds] = useState({});

  const toggleExpandProduct = (id) => {
    setExpandedProductIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
      <div>
        <h1 className="text-2xl font-sans font-extrabold text-[#83254e]">Product Catalog</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          View catalog items, variant details, pricing ranges & inventory stock levels
        </p>
      </div>

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
            <div className="w-8 h-8 border-3 border-[#83254e]/20 border-t-[#83254e] rounded-full animate-spin mx-auto mb-2" />
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
                <tr className="bg-[#fcf5f8] border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredProducts.map((p) => {
                  const imgUrl = getProductImage(p);
                  const qty = p.quantity ?? p.stock ?? 0;
                  const variants = p.real_variants || p.variants || [];
                  const isExpanded = !!expandedProductIds[p.id];

                  return (
                    <React.Fragment key={p.id}>
                      <tr className={`hover:bg-slate-50/70 transition-colors ${isExpanded ? "bg-slate-50/50" : ""}`}>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                              {imgUrl ? (
                                <img
                                  src={imgUrl}
                                  alt={p.name || "Product"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon size={16} className="text-slate-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-[#83254e]">{p.name || p.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-slate-400 font-medium">{p.category || "General"}</span>
                                {variants.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => toggleExpandProduct(p.id)}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#fcf5f8] hover:bg-pink-50 text-[#83254e] border border-slate-200/80 text-[10px] font-bold transition-all cursor-pointer shadow-2xs"
                                  >
                                    <Layers size={11} className="text-amber-700" />
                                    <span>{variants.length} Variants</span>
                                    {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{p.sku || "N/A"}</td>
                        <td className="py-3.5 px-4 font-bold text-[#83254e]">
                          {formatProductPriceDisplay(p)}
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
                      </tr>

                      {/* Expandable Sub-Table Row for Variant Breakdown */}
                      {isExpanded && variants.length > 0 && (
                        <tr className="bg-[#fcf5f8]/80 border-b border-slate-200/60">
                          <td colSpan={4} className="p-3.5 pl-14">
                            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2.5">
                              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                <span className="text-[10px] font-bold text-[#83254e] uppercase tracking-wider flex items-center gap-1.5">
                                  <Layers size={13} className="text-amber-700" />
                                  Configured Variants for {p.name || p.title} ({variants.length})
                                </span>
                                <span className="text-[10px] font-medium text-slate-400">
                                  Inventory variant breakdown details
                                </span>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                      <th className="py-2 px-3">Variant Attributes</th>
                                      <th className="py-2 px-3">Variant SKU</th>
                                      <th className="py-2 px-3">Price</th>
                                      <th className="py-2 px-3">Stock Level</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {variants.map((v, vIdx) => {
                                      const attrStr = v.attributes
                                        ? Object.entries(v.attributes).map(([k, val]) => `${k}: ${val}`).join(" • ")
                                        : (v.name || v.title || `Variant ${vIdx + 1}`);
                                      const vPrice = parseFloat(String(v.price || v.unit_price || 0).replace(/[^0-9.]/g, "")) || 0;
                                      const vStock = v.stock ?? v.quantity ?? 0;
                                      const vSku = v.sku || v.variant_sku || "N/A";
                                      const vMrp = v.mrp ? parseFloat(String(v.mrp).replace(/[^0-9.]/g, "")) : null;

                                      return (
                                        <tr key={v.id || v.variant_id || vIdx} className="hover:bg-slate-50/60 transition-colors">
                                          <td className="py-2.5 px-3 font-bold text-[#83254e]">{attrStr}</td>
                                          <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">{vSku}</td>
                                          <td className="py-2.5 px-3">
                                            <div className="flex flex-col">
                                              <span className="font-bold text-emerald-800">₹{vPrice.toLocaleString("en-IN")}</span>
                                              {vMrp && vMrp > vPrice && (
                                                <span className="text-[9px] text-slate-400 line-through">MRP ₹{vMrp.toLocaleString("en-IN")}</span>
                                              )}
                                            </div>
                                          </td>
                                          <td className="py-2.5 px-3">
                                            <span
                                              className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                                vStock <= 5
                                                  ? "bg-red-50 text-red-600 border-red-200"
                                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                              }`}
                                            >
                                              {vStock} left
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
