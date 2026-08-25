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
  const { addToCart } = useCart();

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
    <div className="py-2 md:py-4">
      {/* Breadcrumbs - Reduced margin */}
      <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-primary/40 mb-4 animate-fade-in">
        <span
          className="cursor-pointer hover:text-accent transition-colors"
          onClick={() => navigate(getPath("/"))}
        >
          Home
        </span>
        <span className="text-[8px] opacity-30">/</span>
        <span
          className="cursor-pointer hover:text-accent transition-colors"
          onClick={() => navigate(getPath("/shop"))}
        >
          Shop
        </span>
        <span className="text-[8px] opacity-30">/</span>
        <span className="text-secondary font-bold capitalize">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Gallery Section - More compact */}
        <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-12 gap-3 animate-slide-right">
          {/* Thumbnails - Showing all available images */}
          <div className="md:col-span-2 order-2 md:order-1 flex flex-row md:flex-col gap-2 h-fit md:max-h-[500px] overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 md:pr-1 custom-scrollbar scrollbar-hide">
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
                  className={`aspect-square w-16 md:w-full rounded-lg overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                    selectedImage === thumb
                      ? "border-accent ring-1 ring-accent/10 shadow-sm"
                      : "border-transparent hover:border-accent/30"
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

          {/* Main Image */}
          <div className="md:col-span-10 order-1 md:order-2">
            <div className="w-full max-h-[40vh] md:max-h-[500px] rounded-2xl overflow-hidden border border-neutral-100 relative group bg-neutral-100/50 flex items-center justify-center">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-auto max-h-[40vh] md:max-h-[500px] object-contain transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all ${
                    isWishlisted
                      ? "bg-rose-500 text-white"
                      : "bg-white/80 text-primary hover:bg-white"
                  }`}
                >
                  <Heart
                    size={18}
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-primary hover:bg-white flex items-center justify-center shadow-lg transition-all">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section - Tighter spacing */}
        <div className="lg:col-span-6 flex flex-col gap-5 animate-slide-left">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex bg-amber-50 px-2 py-0.5 rounded-full items-center gap-1 border border-amber-100">
                <Star size={12} fill="#d97706" className="text-amber-600" />
                <span className="text-[10px] font-bold text-amber-900">
                  {product.rating || "4.8"}
                </span>
              </div>
              <span className="text-[10px] text-primary/40 font-medium tracking-tight">
                ({product.reviews || 124} Reviews)
              </span>
            </div>

            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-secondary tracking-tight capitalize">
              {product.name}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">
                    {getDisplayPrice()}
                  </span>
                  {(activeVariant?.oldPrice || (activeVariant?.mrp && activeVariant?.mrp > activeVariant?.price ? `₹${activeVariant.mrp}` : null) || product.oldPrice) && (
                    <span className="text-base line-through text-primary/40 font-medium">
                      {activeVariant?.oldPrice || (activeVariant?.mrp ? `₹${activeVariant.mrp}` : product.oldPrice)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {(activeVariant?.discount || product.discount) && (
                    <span className="text-[10px] w-fit font-bold bg-[#E4C59E] px-2 py-0.5 rounded text-primary uppercase tracking-wider">
                      {activeVariant?.discount || product.discount}
                    </span>
                  )}
                  {isOutOfStock ? (
                    <span className="text-[10px] w-fit font-bold bg-red-100 text-red-700 px-2.5 py-0.5 rounded uppercase tracking-wider border border-red-200">
                      Out of Stock
                    </span>
                  ) : (
                    <span className="text-[10px] w-fit font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded uppercase tracking-wider border border-emerald-200">
                      In Stock ({availableStock} available)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Variant Option Pills & Pincode Section */}
          <div className="space-y-4">
            {/* Variant Option Pills */}
            <div className="space-y-4 bg-white/40 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-neutral-100 shadow-sm">
              <div className="flex items-center justify-between border-b border-primary/5 pb-2.5">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-bold flex items-center gap-1.5">
                  <Tag size={13} className="text-accent" /> Available Variants
                </h3>
                <span className="text-[10px] font-bold text-primary bg-[#f7d7c4]/60 px-2.5 py-1 rounded-lg border border-accent/20">
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
                    <div key={group.name} className="space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70 flex items-center gap-2">
                        <span>{group.name}:</span>
                        <span className="text-accent font-black">
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
                              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer select-none ${
                                isSelected
                                  ? "scale-[1.02] shadow-md"
                                  : "hover:border-accent"
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

            {/* Pincode Check */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/50">
                Check Delivery
              </label>
              <div className="flex border border-neutral-100 rounded-xl overflow-hidden shadow-sm bg-white">
                <input
                  type="text"
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 py-3 px-4 outline-none text-xs font-medium w-full"
                />
                <button className="px-4 bg-neutral-50 hover:bg-neutral-100 text-[10px] font-bold uppercase tracking-widest text-secondary transition-colors">
                  Check
                </button>
              </div>
            </div>
          </div>

          {/* CTA Buttons - Arranged in one row */}
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={isOutOfStock}
              onClick={() => {
                if (isOutOfStock) return;
                handleAddToCart();
                navigate(getPath("/cart"));
              }}
              style={{
                backgroundColor: isOutOfStock ? "#e5e7eb" : THEME_COLORS.primary,
                color: isOutOfStock ? "#9ca3af" : "#ffffff",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
              }}
              className="py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg active:scale-95 disabled:shadow-none disabled:transform-none"
            >
              {isOutOfStock ? "Out of Stock" : "Buy Now"}
            </button>
            <button
              disabled={isOutOfStock}
              onClick={() => {
                if (isOutOfStock) return;
                handleAddToCart();
                navigate(getPath("/cart"));
              }}
              style={{
                backgroundColor: isOutOfStock ? "#f3f4f6" : THEME_COLORS.accentLight,
                color: isOutOfStock ? "#9ca3af" : THEME_COLORS.primary,
                cursor: isOutOfStock ? "not-allowed" : "pointer",
              }}
              className="py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95 disabled:shadow-none disabled:transform-none border border-neutral-200"
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>

          {/* Description Section */}
          <div className="bg-neutral-50/30 rounded-2xl p-6 border border-neutral-100 space-y-3">
            <h4 className="text-secondary font-serif font-bold text-lg">
              Description
            </h4>
            <p className="text-primary/70 text-sm leading-relaxed">
              {product.description ||
                "No description available for this exquisite product."}
            </p>
          </div>

          {/* Olfactory Notes Pyramid Section */}
          {product.notes && (
            <div className="bg-linear-to-b from-[#faf7f5] to-white rounded-2xl p-6 border border-primary/10 shadow-xs space-y-4">
              <h4 className="text-secondary font-serif font-bold text-lg flex items-center gap-2">
                <Sparkles size={18} className="text-accent" />
                Olfactory Notes Pyramid
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                {/* Top Notes */}
                {product.notes.top && (
                  <div className="bg-white p-4 rounded-xl border border-primary/5 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">
                      Top Notes
                    </span>
                    <p className="text-xs font-medium text-primary leading-snug">
                      {product.notes.top}
                    </p>
                  </div>
                )}

                {/* Heart Notes */}
                {product.notes.heart && (
                  <div className="bg-white p-4 rounded-xl border border-primary/5 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-1">
                      Heart Notes
                    </span>
                    <p className="text-xs font-medium text-primary leading-snug">
                      {product.notes.heart}
                    </p>
                  </div>
                )}

                {/* Base Notes */}
                {product.notes.base && (
                  <div className="bg-white p-4 rounded-xl border border-primary/5 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">
                      Base Notes
                    </span>
                    <p className="text-xs font-medium text-primary leading-snug">
                      {product.notes.base}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trust Badges - Centered on mobile */}
      <div className="mt-8 py-6 border-t border-neutral-100 grid grid-cols-3 md:grid-cols-3 gap-6">
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
            className="flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-4 group text-center md:text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300 shadow-sm border border-neutral-100">
              <badge.icon size={22} />
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5">
                {badge.title}
              </h4>
              <p className="text-[8px] text-primary/40 uppercase tracking-widest leading-none">
                {badge.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
