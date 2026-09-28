import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { getPath } from "../../utils/paths";
import THEME_COLORS, { primaryAlpha } from "../../styles/theme";
import { ShoppingBag, Check } from "lucide-react";

const isUuidOrId = (str) => {
  if (typeof str !== "string") return false;
  return (
    str.length > 20 ||
    str.includes("INV-") ||
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
  );
};

const getVariantLabel = (v, index) => {
  if (!v) return `Option ${index + 1}`;
  if (v.size && typeof v.size === "string" && !isUuidOrId(v.size)) return v.size;
  if (v.weight && typeof v.weight === "string" && !isUuidOrId(v.weight)) return v.weight;
  if (
    v.attributes &&
    typeof v.attributes === "object" &&
    Object.keys(v.attributes).length > 0
  ) {
    const vals = Object.values(v.attributes).filter(
      (val) => val && typeof val === "string" && !isUuidOrId(val)
    );
    if (vals.length > 0) return vals.join(" / ");
  }
  if (v.name && typeof v.name === "string" && !isUuidOrId(v.name)) return v.name;
  if (v.title && typeof v.title === "string" && !isUuidOrId(v.title)) return v.title;
  if (v.color && typeof v.color === "string" && !isUuidOrId(v.color)) return v.color;
  return `Option ${index + 1}`;
};

const formatVariantFullName = (v) => {
  if (!v) return "Standard Item";
  const parts = [];
  if (
    v.attributes &&
    typeof v.attributes === "object" &&
    Object.keys(v.attributes).length > 0
  ) {
    Object.entries(v.attributes).forEach(([k, val]) => {
      if (val && !isUuidOrId(val)) parts.push(`${k}: ${val}`);
    });
  }
  if (parts.length === 0) {
    if (v.color && !isUuidOrId(v.color)) parts.push(`Color: ${v.color}`);
    if (v.size && !isUuidOrId(v.size)) parts.push(`Size: ${v.size}`);
    if (v.weight && !isUuidOrId(v.weight)) parts.push(`Weight: ${v.weight}`);
  }
  return parts.length > 0
    ? parts.join(" / ")
    : v.name || v.weight || v.size || "Variant";
};

const getStockCount = (item) => {
  if (!item) return 0;
  const stock = item.stock_quantity ?? item.stock ?? item.quantity;
  const reserved = item.reserved ?? 0;
  if (stock !== undefined && stock !== null) {
    return Math.max(0, stock - reserved);
  }
  return 999;
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [added, setAdded] = useState(false);

  const variantsList = React.useMemo(() => {
    if (!product) return [];
    const list = product.real_variants || product.variants || [];
    return Array.isArray(list) ? list : [];
  }, [product]);

  const activeVariant = React.useMemo(() => {
    if (variantsList.length === 0) return null;
    if (selectedVariantId !== null) {
      const found = variantsList.find(
        (v, i) => (v.id ?? v.variant_id ?? i) === selectedVariantId
      );
      if (found) return found;
    }
    const firstInStock = variantsList.find((v) => getStockCount(v) > 0);
    return firstInStock || variantsList[0];
  }, [variantsList, selectedVariantId]);

  const hasVariants = variantsList.length > 0;
  const isEntirelyOutOfStock = hasVariants
    ? variantsList.every((v) => getStockCount(v) <= 0)
    : getStockCount(product) <= 0;

  const isSelectedOutOfStock = activeVariant
    ? getStockCount(activeVariant) <= 0
    : isEntirelyOutOfStock;

  const currentPrice =
    activeVariant && activeVariant.price != null
      ? activeVariant.price
      : product.price;

  const currentMrp = activeVariant?.mrp || product.mrp;
  const currentDiscount = activeVariant?.discount || product.discount;

  const displayImage =
    activeVariant?.image ||
    (activeVariant?.images && activeVariant?.images[0]) ||
    product.image;

  const handleAddToCart = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (isSelectedOutOfStock) return;

    const chosenPrice =
      activeVariant && activeVariant.price != null
        ? activeVariant.price
        : product.price;

    addToCart({
      ...product,
      quantity: 1,
      selectedSize: activeVariant
        ? formatVariantFullName(activeVariant)
        : (product.selectedSize || "Standard Item"),
      price: chosenPrice,
      variant_id: activeVariant?.id ?? activeVariant?.variant_id ?? null,
      sku: activeVariant?.sku || product.sku,
      variant_attributes: activeVariant?.attributes || null,
      stock: activeVariant ? getStockCount(activeVariant) : getStockCount(product),
      image: displayImage,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-[18px] p-3 sm:p-3.5 flex flex-col items-center justify-between border border-white/80 shadow-[0_10px_30px_rgba(131,37,78,0.06)] transition-all duration-300 group relative hover:shadow-[0_20px_40px_rgba(131,37,78,0.12)] hover:bg-white hover:-translate-y-1">
      {isEntirelyOutOfStock ? (
        <span className="absolute top-3 left-3 z-10 bg-red-100/95 text-red-700 border border-red-200 text-[0.65rem] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-xs shadow-xs">
          Out of Stock
        </span>
      ) : (
        product.tag && (
          <span
            style={{
              backgroundColor: "#f7d7c4",
              color: THEME_COLORS.primary,
            }}
            className="absolute top-3 left-3 z-10 text-[0.65rem] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-xs shadow-xs border border-white/60"
          >
            {product.tag}
          </span>
        )
      )}

      <Link
        to={getPath(`/product/${product.id}`)}
        className="w-full aspect-square rounded-xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500 bg-neutral-100/50 block"
      >
        <img
          src={displayImage}
          alt={product.name}
          className={`w-full h-full object-cover rounded-xl transition-all duration-300 ${
            isSelectedOutOfStock ? "opacity-60 grayscale-[30%]" : ""
          }`}
        />
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
      </Link>

      <div className="flex items-center justify-between w-full mt-2.5 px-0.5 gap-2">
        <Link
          to={getPath(`/product/${product.id}`)}
          className="hover:text-accent transition-colors flex-1 min-w-0 text-left"
        >
          <h3
            style={{ color: THEME_COLORS.primary }}
            className="text-[0.92rem] sm:text-[1rem] font-serif font-bold capitalize truncate"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 shrink-0">
          <p
            style={{ color: THEME_COLORS.primary }}
            className="text-[0.98rem] sm:text-[1.08rem] font-bold font-serif whitespace-nowrap"
          >
            {typeof currentPrice === "number" ? `₹${currentPrice}` : currentPrice}
          </p>
          {currentMrp && currentMrp > currentPrice && (
            <span className="text-[0.7rem] sm:text-xs line-through text-primary/45 font-medium">
              ₹{currentMrp}
            </span>
          )}
          {currentDiscount && (
            <span
              style={{
                backgroundColor: THEME_COLORS.accentLight,
                color: THEME_COLORS.primary,
              }}
              className="text-[0.62rem] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
            >
              {currentDiscount}
            </span>
          )}
        </div>
      </div>

      {/* Variant Pills Selector directly on Card */}
      {hasVariants && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 my-2 w-full">
          {variantsList.map((v, idx) => {
            const vId = v.id ?? v.variant_id ?? idx;
            const isSelected =
              (activeVariant?.id ?? activeVariant?.variant_id ?? 0) === vId;
            const vStock = getStockCount(v);
            const isVOutOfStock = vStock <= 0;
            const label = getVariantLabel(v, idx);

            return (
              <button
                key={vId}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariantId(vId);
                }}
                title={
                  isVOutOfStock
                    ? `${label} (Out of stock)`
                    : `${label} - ₹${v.price ?? ""}`
                }
                style={{
                  backgroundColor: isSelected
                    ? THEME_COLORS.primary
                    : isVOutOfStock
                    ? "#f3f4f6"
                    : "#ffffff",
                  color: isSelected
                    ? "#ffffff"
                    : isVOutOfStock
                    ? "#9ca3af"
                    : THEME_COLORS.primary,
                  borderColor: isSelected
                    ? THEME_COLORS.primary
                    : isVOutOfStock
                    ? "#e5e7eb"
                    : primaryAlpha(0.25),
                }}
                className={`text-[0.74rem] sm:text-[0.78rem] font-semibold px-3 py-1 rounded-full transition-all duration-200 border cursor-pointer select-none ${
                  isSelected
                    ? "shadow-xs scale-105"
                    : isVOutOfStock
                    ? "line-through opacity-60 cursor-not-allowed"
                    : "hover:scale-102 hover:shadow-xs"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Action Buttons: Add directly + Details */}
      <div className="flex gap-2 w-full mt-auto pt-1.5">
        {isSelectedOutOfStock ? (
          <button
            type="button"
            disabled
            style={{
              backgroundColor: "#e5e7eb",
              color: "#9ca3af",
            }}
            className="flex-1 text-[0.78rem] sm:text-[0.82rem] px-2.5 py-2.5 flex items-center justify-center rounded-full uppercase tracking-wider font-bold cursor-not-allowed"
          >
            Out of Stock
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            style={{
              backgroundColor: added ? "#059669" : THEME_COLORS.primary,
              color: "#ffffff",
            }}
            className="flex-1 text-[0.78rem] sm:text-[0.82rem] px-2.5 py-2.5 flex items-center justify-center gap-1.5 rounded-full uppercase tracking-wider font-bold transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-95 hover:opacity-95"
          >
            {added ? (
              <>
                <Check size={14} strokeWidth={3} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add</span>
              </>
            )}
          </button>
        )}
        <Link
          to={getPath(`/product/${product.id}`)}
          style={{
            backgroundColor: THEME_COLORS.accentLight,
            color: THEME_COLORS.primary,
            borderColor: "rgba(255, 255, 255, 0.6)",
          }}
          className="flex-1 hover:bg-[#f4b8cc] text-[0.78rem] sm:text-[0.82rem] px-2.5 py-2.5 flex items-center justify-center rounded-full uppercase tracking-wider font-bold border shadow-xs hover:shadow-md transition-all active:scale-95 text-center"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
