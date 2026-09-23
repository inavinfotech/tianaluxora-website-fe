/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import api from "../utils/api";
import { getPath } from "../utils/paths";
import THEME_COLORS, { primaryAlpha } from "../styles/theme";
import {
  Star,
  MapPin,
  ChevronDown,
  ArrowLeft,
  Heart,
  Share2,
  ShieldCheck,
  RotateCcw,
  Truck,
  Check,
  Tag,
  Sparkles,
} from "lucide-react";

export const formatVariantTitle = (v) => {
  if (!v) return "Standard Item";
  const parts = [];
  if (
    v.attributes &&
    typeof v.attributes === "object" &&
    Object.keys(v.attributes).length > 0
  ) {
    Object.entries(v.attributes).forEach(([k, val]) => {
      if (val) parts.push(`${k}: ${val}`);
    });
  }
  if (parts.length === 0) {
    if (v.color) parts.push(`Color: ${v.color}`);
    if (v.size) parts.push(`Size: ${v.size}`);
    if (v.weight) parts.push(`Weight: ${v.weight}`);
  }
  return parts.length > 0
    ? parts.join(" / ")
    : v.weight || v.size || v.name || "Variant";
};

const getColorSwatch = (colorName) => {
  if (!colorName || typeof colorName !== "string") return null;
  const name = colorName.trim().toLowerCase();

  const colorMap = {
    red: "#dc2626",
    green: "#16a34a",
    blue: "#2563eb",
    white: "#ffffff",
    black: "#111827",
    yellow: "#eab308",
    purple: "#9333ea",
    pink: "#ec4899",
    orange: "#f97316",
    gray: "#4b5563",
    grey: "#4b5563",
    navy: "#1e3a8a",
    brown: "#78350f",
    gold: "#d97706",
    silver: "#94a3b8",
    cyan: "#06b6d4",
    teal: "#0d9488",
    lime: "#65a30d",
    indigo: "#4f46e5",
    cream: "#fef3c7",
    beige: "#f5f5dc",
    maroon: "#800000",
    amber: "#d97706",
    rose: "#f43f5e",
    emerald: "#10b981",
    violet: "#8b5cf6",
    ruby: "#e11d48",
    charcoal: "#374151",
    bronze: "#cd7f32",
    peach: "#ffdab9",
    ivory: "#fffff0",
    plum: "#dda0dd",
    coral: "#ff7f50",
    burgundy: "#800020",
    lavender: "#e6e6fa",
    magenta: "#ff00ff",
  };

  for (const [k, v] of Object.entries(colorMap)) {
    if (name.includes(k)) {
      return {
        hex: v,
        isLight:
          v === "#ffffff" ||
          v === "#fef3c7" ||
          v === "#f5f5dc" ||
          v === "#fffff0" ||
          v === "#e6e6fa" ||
          v === "#ffdab9" ||
          name.includes("white") ||
          name.includes("yellow") ||
          name.includes("cream") ||
          name.includes("ivory") ||
          name.includes("beige"),
      };
    }
  }

  if (
    name.startsWith("#") ||
    name.startsWith("rgb") ||
    name.startsWith("hsl")
  ) {
    return { hex: colorName, isLight: false };
  }

  return { hex: colorName, isLight: false };
};

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [pincode, setPincode] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const { addToCart } = useCart();

  const handleShare = async () => {
    const shareData = {
      title: product?.name ? `${product.name} | Tiana Luxora` : "Tiana Luxora Luxury Fragrances",
      text: product?.name
        ? `Experience ${product.name} by Tiana Luxora.`
        : "Discover exquisite luxury fragrances by Tiana Luxora.",
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error using native share:", err);
        }
      }
    }

    // Fallback: Copy URL to clipboard
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2800);
    } catch (err) {
      console.error("Failed to copy link to clipboard:", err);
    }
  };

  const isUuidOrId = (str) => {
    if (typeof str !== "string") return false;
    return (
      str.length > 20 ||
      str.includes("INV-") ||
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
    );
  };

  const variantsList = React.useMemo(() => {
    if (!product) return [];
    return product.real_variants || product.variants || [];
  }, [product]);

  const attributeGroups = React.useMemo(() => {
    if (!product) return [];

    if (
      product.variant_types &&
      Array.isArray(product.variant_types) &&
      product.variant_types.length > 0
    ) {
      return product.variant_types.map((vt) => ({
        name: vt.name,
        options: vt.options || [],
      }));
    }

    const map = {};
    if (variantsList.length > 0) {
      variantsList.forEach((v) => {
        if (
          v.attributes &&
          typeof v.attributes === "object" &&
          Object.keys(v.attributes).length > 0
        ) {
          Object.entries(v.attributes).forEach(([k, val]) => {
            if (val && typeof val === "string" && !isUuidOrId(val)) {
              if (!map[k]) map[k] = [];
              if (!map[k].includes(val)) map[k].push(val);
            }
          });
        } else {
          if (v.color && !isUuidOrId(v.color)) {
            if (!map["Color"]) map["Color"] = [];
            if (!map["Color"].includes(v.color)) map["Color"].push(v.color);
          }
          if (v.size && !isUuidOrId(v.size)) {
            if (!map["Size"]) map["Size"] = [];
            if (!map["Size"].includes(v.size)) map["Size"].push(v.size);
          }
          if (v.weight && !isUuidOrId(v.weight)) {
            if (!map["Size"]) map["Size"] = [];
            if (!map["Size"].includes(v.weight)) map["Size"].push(v.weight);
          }
        }
      });
    }

    if (
      Object.keys(map).length === 0 &&
      product.sizes &&
      Array.isArray(product.sizes) &&
      product.sizes.length > 0
    ) {
      const cleanSizes = product.sizes.filter(
        (s) => s && typeof s === "string" && !isUuidOrId(s),
      );
      if (cleanSizes.length > 0) {
        map["Size"] = Array.from(new Set(cleanSizes));
      }
    }

    if (Object.keys(map).length === 0) {
      map["Size"] = ["50 ml", "100 ml", "250 ml"];
    }

    return Object.entries(map).map(([name, options]) => ({
      name,
      options,
    }));
  }, [product, variantsList]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          setSelectedImage(data.image);

          const list = data.real_variants || data.variants || [];
          if (list.length > 0) {
            setSelectedVariant(list[0]);
          }
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product from backend API:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [productId]);

  const getSelectedAttrValue = (attrName) => {
    if (!selectedVariant) return "";
    if (selectedVariant.attributes && selectedVariant.attributes[attrName]) {
      return selectedVariant.attributes[attrName];
    }
    if (attrName.toLowerCase() === "color") return selectedVariant.color || "";
    if (attrName.toLowerCase() === "size") return selectedVariant.size || "";
    if (attrName.toLowerCase() === "weight") return selectedVariant.weight || "";
    return "";
  };

  const handleSelectAttributeOption = (attrName, optionVal) => {
    const currentAttrs = {};
    if (selectedVariant?.attributes) {
      Object.assign(currentAttrs, selectedVariant.attributes);
    } else {
      if (selectedVariant?.color) currentAttrs["Color"] = selectedVariant.color;
      if (selectedVariant?.size) currentAttrs["Size"] = selectedVariant.size;
      if (selectedVariant?.weight) currentAttrs["Weight"] = selectedVariant.weight;
    }

    const updatedAttrs = {
      ...currentAttrs,
      [attrName]: optionVal,
    };

    let match = variantsList.find((v) => {
      const vAttrs = v.attributes || {
        Color: v.color,
        Size: v.size,
        Weight: v.weight,
      };
      return Object.entries(updatedAttrs).every(([k, val]) => vAttrs[k] === val);
    });

    if (!match) {
      match = variantsList.find((v) => {
        const vAttrs = v.attributes || {
          Color: v.color,
          Size: v.size,
          Weight: v.weight,
        };
        return vAttrs[attrName] === optionVal;
      });
    }

    if (match) {
      setSelectedVariant(match);
      if (match.image) {
        setSelectedImage(match.image);
      } else if (match.images && match.images[0]) {
        setSelectedImage(match.images[0]);
      }
    }
  };

  const getAvailableStock = (variant) => {
    if (variant) {
      const stock = variant.stock ?? variant.quantity ?? variant.stock_quantity;
      const reserved = variant.reserved ?? 0;
      if (stock !== undefined && stock !== null) {
        return Math.max(0, stock - reserved);
      }
    }
    if (product) {
      const prodStock = product.stock_quantity ?? product.stock ?? product.quantity;
      const prodReserved = product.reserved ?? 0;
      if (prodStock !== undefined && prodStock !== null) {
        return Math.max(0, prodStock - prodReserved);
      }
    }
    return 999;
  };

  const activeVariant = selectedVariant || variantsList[0];
  const availableStock = getAvailableStock(activeVariant);
  const isOutOfStock = availableStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (product) {
      const activePrice =
        activeVariant && activeVariant.price != null
          ? activeVariant.price
          : product.price;

      addToCart({
        ...product,
        quantity: 1,
        selectedSize: activeVariant
          ? formatVariantTitle(activeVariant)
          : "Standard Item",
        price: activePrice,
        variant_id: activeVariant?.id || null,
        sku: activeVariant?.sku || product.sku,
        variant_attributes: activeVariant?.attributes || null,
      });
    }
  };

  const getDisplayPrice = () => {
    if (!product) return "";
    const activeVariant = selectedVariant || variantsList[0];
    const price =
      activeVariant && activeVariant.price != null
        ? activeVariant.price
        : product.price;
    return typeof price === "number" ? `₹${price}` : price;
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6">
        <h2 className="font-serif text-3xl text-primary font-bold">
          Product not found
        </h2>
        <button
          onClick={() => navigate(getPath("/shop"))}
          className="flex items-center gap-2 group text-accent hover:text-primary transition-colors font-semibold"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Collections
        </button>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      {/* Full-bleed Edge-to-edge Luxury Surface touching navbar with zero gap */}
      <div className="w-full min-h-screen bg-white/92 sm:bg-white/95 backdrop-blur-2xl border-b border-white/80 shadow-sm pt-16 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumbs Navigation */}
          <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-primary/70 mb-4 sm:mb-6 font-medium">
            <span
              className="cursor-pointer hover:text-accent transition-colors"
              onClick={() => navigate(getPath("/"))}
            >
              Home
            </span>
            <span className="opacity-40">/</span>
            <span
              className="cursor-pointer hover:text-accent transition-colors"
              onClick={() => navigate(getPath("/shop"))}
            >
              Shop
            </span>
            <span className="opacity-40">/</span>
            <span className="text-primary font-bold capitalize truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>

        {/* Product Main Grid (Gallery & Information) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Gallery Section */}
          <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 animate-slide-right">
            {/* Thumbnails */}
            <div className="md:col-span-2 order-2 md:order-1 flex flex-row md:flex-col gap-2.5 h-fit md:max-h-[520px] overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 md:pr-1 custom-scrollbar scrollbar-hide">
              {(() => {
                const baseUrl = product.image?.includes("/uploads/")
                  ? product.image.split("/uploads/")[0]
                  : "";
                const allImages = [
                  product.image,
                  ...(product.thumbnails || []),
                  ...(product.images || []).map((img) =>
                    img.startsWith("/") && baseUrl ? `${baseUrl}${img}` : img,
                  ),
                ]
                  .filter(Boolean)
                  .filter((v, i, a) => a.indexOf(v) === i);

                return allImages.map((thumb, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(thumb)}
                    className={`aspect-square w-16 md:w-full rounded-xl overflow-hidden border-2 transition-all duration-300 shrink-0 bg-white shadow-xs ${
                      selectedImage === thumb
                        ? "border-primary ring-2 ring-primary/20 scale-105"
                        : "border-primary/10 hover:border-accent/50 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={thumb}
                      alt={`View ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ));
              })()}
            </div>

            {/* Main Stage Image */}
            <div className="md:col-span-10 order-1 md:order-2">
              <div className="w-full aspect-square sm:aspect-[4/5] max-h-[460px] md:max-h-[520px] rounded-2xl overflow-hidden border border-primary/10 relative group bg-gradient-to-b from-[#faf5f7] via-white to-[#fbf6f8] flex items-center justify-center p-6 shadow-inner">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-[0_20px_35px_rgba(131,37,78,0.12)]"
                />

                {/* Floating Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2.5 z-10">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    aria-label="Wishlist"
                    style={{
                      backgroundColor: isWishlisted ? "#e11d48" : "#ffffff",
                      color: isWishlisted ? "#ffffff" : "#83254e",
                      borderColor: isWishlisted ? "#e11d48" : "rgba(131,37,78,0.2)",
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-md border transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer bg-white"
                  >
                    <Heart
                      size={18}
                      className="transition-colors"
                      style={{
                        color: isWishlisted ? "#ffffff" : "#83254e",
                        stroke: isWishlisted ? "#ffffff" : "#83254e",
                        fill: isWishlisted ? "#ffffff" : "none",
                      }}
                    />
                  </button>
                  <button 
                    onClick={handleShare}
                    aria-label="Share"
                    title={copiedToast ? "Copied!" : "Share Product"}
                    style={{
                      backgroundColor: copiedToast ? "#10b981" : "#ffffff",
                      color: copiedToast ? "#ffffff" : "#83254e",
                      borderColor: copiedToast ? "#10b981" : "rgba(131,37,78,0.2)",
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-md border transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer bg-white"
                  >
                    {copiedToast ? (
                      <Check size={18} style={{ color: "#ffffff", stroke: "#ffffff" }} />
                    ) : (
                      <Share2 size={18} style={{ color: "#83254e", stroke: "#83254e" }} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Info & Options Section */}
          <div className="lg:col-span-6 flex flex-col gap-6 animate-slide-left">
            {/* Header: Rating, Title & Price in Single Row */}
            <div className="space-y-3 border-b border-primary/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex bg-amber-50 px-2.5 py-1 rounded-full items-center gap-1.5 border border-amber-200 shadow-xs">
                  <Star size={13} fill="#d97706" className="text-amber-600" />
                  <span className="text-xs font-bold text-amber-950">
                    {product.rating || "4.8"}
                  </span>
                </div>
                <span className="text-xs text-primary/70 font-semibold tracking-tight">
                  ({product.reviews || 124} Verified Reviews)
                </span>
                {isOutOfStock && (
                  <span className="text-xs font-bold bg-red-50 text-red-700 px-3 py-0.5 rounded-full uppercase tracking-wider border border-red-200 ml-auto">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Title & Price in Single Row */}
              <div className="flex flex-wrap items-baseline justify-between gap-3 pt-1">
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-[2.4rem] font-bold text-primary tracking-tight capitalize leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-primary font-serif">
                    {getDisplayPrice()}
                  </span>
                  {(activeVariant?.oldPrice || (activeVariant?.mrp && activeVariant?.mrp > activeVariant?.price ? `₹${activeVariant.mrp}` : null) || product.oldPrice) && (
                    <span className="text-base line-through text-primary/45 font-medium">
                      {activeVariant?.oldPrice || (activeVariant?.mrp ? `₹${activeVariant.mrp}` : product.oldPrice)}
                    </span>
                  )}
                  {(activeVariant?.discount || product.discount) && (
                    <span className="text-xs font-bold bg-[#f7c2d4] text-primary px-2 py-0.5 rounded-md uppercase tracking-wider border border-white/60 shadow-xs">
                      {activeVariant?.discount || product.discount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Variant Option Selection */}
            <div className="space-y-4 bg-white/70 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-primary/10 shadow-sm">
              <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                <h3 className="text-xs uppercase tracking-[0.15em] text-primary font-bold flex items-center gap-1.5">
                  <Tag size={14} className="text-accent" /> Available Variants
                </h3>
                <span className="text-xs font-bold text-primary bg-[#f7d7c4]/70 px-3 py-1 rounded-lg border border-accent/30 shadow-xs">
                  {selectedVariant ? formatVariantTitle(selectedVariant) : "Default"} — {getDisplayPrice()}
                </span>
              </div>

              <div className="space-y-4 pt-1">
                {attributeGroups.map((group) => {
                  const selectedVal = getSelectedAttrValue(group.name);
                  const isColorGroup =
                    group.name.toLowerCase().includes("color") ||
                    group.name.toLowerCase().includes("shade") ||
                    group.name.toLowerCase().includes("tone");

                  return (
                    <div key={group.name} className="space-y-2.5">
                      <div className="text-xs font-bold uppercase tracking-[0.15em] text-primary flex items-center gap-2">
                        <span>{group.name}:</span>
                        <span className="text-accent font-extrabold">
                          {selectedVal || "Select option"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2.5">
                        {group.options.map((opt) => {
                          const isSelected = selectedVal === opt;
                          const swatch = isColorGroup ? getColorSwatch(opt) : null;

                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleSelectAttributeOption(group.name, opt)}
                              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 border cursor-pointer select-none ${
                                isSelected
                                  ? "scale-[1.03] shadow-md ring-2 ring-primary/20"
                                  : "hover:border-accent hover:bg-white/80"
                              }`}
                              style={{
                                backgroundColor: isSelected ? THEME_COLORS.primary : "#ffffff",
                                color: isSelected ? "#ffffff" : THEME_COLORS.primary,
                                borderColor: isSelected ? THEME_COLORS.primary : primaryAlpha(0.2),
                              }}
                            >
                              {/* Checkbox Icon */}
                              <div
                                className="w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0"
                                style={{
                                  backgroundColor: isSelected ? "#ffffff" : "#f9fafb",
                                  borderColor: isSelected ? "#ffffff" : primaryAlpha(0.3),
                                  color: isSelected ? THEME_COLORS.primary : "transparent",
                                }}
                              >
                                <Check size={11} strokeWidth={3.5} />
                              </div>

                              {/* Color Swatch Circle */}
                              {swatch && (
                                <span
                                  className="w-4 h-4 rounded-full border shrink-0 inline-block shadow-xs"
                                  style={{
                                    backgroundColor: swatch.hex,
                                    borderColor: swatch.isLight
                                      ? "rgba(0,0,0,0.25)"
                                      : "transparent",
                                  }}
                                />
                              )}

                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pincode & Delivery Section */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] font-bold text-primary flex items-center gap-1.5">
                <Truck size={14} className="text-accent" /> Check Estimated Delivery
              </label>
              <div className="flex border border-primary/20 rounded-xl overflow-hidden shadow-xs bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <input
                  type="text"
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 py-3.5 px-4 outline-none text-xs font-semibold text-primary w-full placeholder:text-primary/40"
                />
                <button
                  type="button"
                  style={{ backgroundColor: "#83254e", color: "#ffffff" }}
                  className="px-6 py-3.5 bg-[#83254e] hover:bg-[#6c1d3f] text-xs font-bold uppercase tracking-wider text-white transition-colors cursor-pointer border-l border-primary/10"
                >
                  Check
                </button>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="grid grid-cols-2 gap-3.5 pt-2">
              <button
                disabled={isOutOfStock}
                onClick={() => {
                  if (isOutOfStock) return;
                  handleAddToCart();
                  navigate(getPath("/cart"));
                }}
                style={{
                  backgroundColor: isOutOfStock ? "#e5e7eb" : "#83254e",
                  color: isOutOfStock ? "#9ca3af" : "#ffffff",
                }}
                className="relative overflow-hidden py-4 sm:py-4.5 rounded-2xl font-bold uppercase tracking-wider text-xs sm:text-sm text-white transition-all duration-300 shadow-[0_10px_25px_rgba(131,37,78,0.35)] hover:shadow-[0_15px_30px_rgba(131,37,78,0.5)] hover:brightness-110 active:scale-[0.98] disabled:shadow-none disabled:transform-none disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed cursor-pointer bg-[#83254e] border border-[#83254e]"
              >
                {/* Continuous Shimmer Light Sheen */}
                {!isOutOfStock && (
                  <span className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none animate-btn-shine" />
                )}
                <span className="relative z-10">{isOutOfStock ? "Out of Stock" : "Buy Now"}</span>
              </button>

              <button
                disabled={isOutOfStock}
                onClick={() => {
                  if (isOutOfStock) return;
                  handleAddToCart();
                  navigate(getPath("/cart"));
                }}
                style={{
                  backgroundColor: isOutOfStock ? "#f3f4f6" : "#f7c2d4",
                  color: isOutOfStock ? "#9ca3af" : "#83254e",
                  borderColor: isOutOfStock ? "#e5e7eb" : "#d97398",
                }}
                className="py-4 sm:py-4.5 rounded-2xl font-bold uppercase tracking-wider text-xs sm:text-sm text-[#83254e] transition-all duration-300 bg-[#f7c2d4] hover:bg-[#f4b8cc] border-2 border-[#d97398]/50 hover:border-[#83254e] shadow-[0_10px_25px_rgba(217,115,152,0.25)] hover:shadow-[0_15px_30px_rgba(217,115,152,0.35)] hover:brightness-105 active:scale-[0.98] disabled:shadow-none disabled:transform-none disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed cursor-pointer"
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>

            {/* Description Section */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-primary/10 shadow-xs space-y-2.5">
              <h4 className="text-primary font-serif font-bold text-lg">
                Description
              </h4>
              <p className="text-primary/80 text-sm leading-relaxed font-normal">
                {product.description ||
                  "No description available for this exquisite fragrance."}
              </p>
            </div>

            {/* Olfactory Notes Pyramid Section */}
            {product.notes && (
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-primary/10 shadow-xs space-y-4">
                <h4 className="text-primary font-serif font-bold text-lg flex items-center gap-2">
                  <Sparkles size={18} className="text-accent" />
                  Olfactory Notes Pyramid
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                  {/* Top Notes */}
                  {product.notes.top && (
                    <div className="bg-[#faf5f7] p-4 rounded-xl border border-primary/10 shadow-xs">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">
                        Top Notes
                      </span>
                      <p className="text-xs font-semibold text-primary leading-snug">
                        {product.notes.top}
                      </p>
                    </div>
                  )}

                  {/* Heart Notes */}
                  {product.notes.heart && (
                    <div className="bg-[#faf5f7] p-4 rounded-xl border border-primary/10 shadow-xs">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-1">
                        Heart Notes
                      </span>
                      <p className="text-xs font-semibold text-primary leading-snug">
                        {product.notes.heart}
                      </p>
                    </div>
                  )}

                  {/* Base Notes */}
                  {product.notes.base && (
                    <div className="bg-[#faf5f7] p-4 rounded-xl border border-primary/10 shadow-xs">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">
                        Base Notes
                      </span>
                      <p className="text-xs font-semibold text-primary leading-snug">
                        {product.notes.base}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-10 pt-8 border-t border-primary/10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: ShieldCheck,
              title: "100% Original",
              sub: "Authenticity Guaranteed",
            },
            {
              icon: RotateCcw,
              title: "7 Day Return",
              sub: "Hassle-free Returns",
            },
            { icon: Truck, title: "Fast Shipping", sub: "Express Safe Delivery" },
          ].map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-primary/10 shadow-xs group hover:bg-white transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#faf5f7] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-xs border border-primary/10 shrink-0">
                <badge.icon size={22} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-0.5">
                  {badge.title}
                </h4>
                <p className="text-[10px] text-primary/70 uppercase tracking-widest leading-none font-medium">
                  {badge.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
};

export default ProductDetail;
