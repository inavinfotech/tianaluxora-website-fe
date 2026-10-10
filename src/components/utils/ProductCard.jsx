import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { getPath } from "../../utils/paths";
import THEME_COLORS, { primaryAlpha } from "../../styles/theme";
import { ShoppingBag, Check } from "lucide-react";
import {
  getVariantLabel,
  formatVariantFullName,
  getStockCount,
} from "../../utils/productUtils";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [added, setAdded] = useState(false);

  const isVariantView = Boolean(product?.is_variant_view);
  const targetProductId = product?.base_product_id || product?.productId || product?.id;
  const targetVariantId =
    product?.variant_id ||
    (product?.raw_variant ? product.raw_variant.id : null);

  const detailUrl = targetVariantId
    ? getPath(`/product/${targetProductId}?variant=${targetVariantId}`)
    : getPath(`/product/${targetProductId}`);

  const variantsList = React.useMemo(() => {
    if (!product) return [];
    const list = product.real_variants || product.variants || [];
    return Array.isArray(list) ? list : [];
  }, [product]);

  const activeVariant = React.useMemo(() => {
    if (isVariantView) {
      return product.raw_variant || (variantsList.length > 0 ? variantsList[0] : null);
    }
    if (variantsList.length === 0) return null;
    if (selectedVariantId !== null) {
      const found = variantsList.find(
        (v, i) => (v.id ?? v.variant_id ?? i) === selectedVariantId
      );
      if (found) return found;
    }
    const firstInStock = variantsList.find((v) => getStockCount(v) > 0);
    return firstInStock || variantsList[0];
  }, [isVariantView, product, variantsList, selectedVariantId]);

  const hasVariants = !isVariantView && variantsList.length > 1;

  const currentStock = isVariantView
    ? getStockCount(product)
    : activeVariant
    ? getStockCount(activeVariant)
    : getStockCount(product);

  const isOutOfStock = currentStock <= 0;

  const currentPrice = isVariantView
    ? product.price
    : activeVariant && activeVariant.price != null
    ? activeVariant.price
    : product?.price;

  const currentMrp = isVariantView
    ? product.mrp
    : activeVariant?.mrp || product?.mrp;

  const currentDiscount = isVariantView
    ? product.discount
    : activeVariant?.discount || product?.discount;

  const displayImage = isVariantView
    ? product.image || (Array.isArray(product.images) && product.images[0]) || ""
    : activeVariant?.image ||
      (activeVariant?.images && activeVariant?.images[0]) ||
      product?.image;

  const displayName = product?.base_name || product?.name;
  const variantLabel =
    product?.variant_label ||
    (activeVariant ? getVariantLabel(activeVariant, 0) : "");

  const handleAddToCart = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (isOutOfStock) return;

    const chosenPrice =
      typeof currentPrice === "number"
        ? currentPrice
        : parseFloat(String(currentPrice).replace(/[^0-9.]/g, "")) || 0;

    const chosenSize = isVariantView
      ? variantLabel || "Standard Item"
      : activeVariant
      ? formatVariantFullName(activeVariant)
      : product?.selectedSize || "Standard Item";

    addToCart({
      ...product,
      id: targetProductId,
      base_product_id: targetProductId,
      productId: targetProductId,
      name: displayName,
      quantity: 1,
      selectedSize: chosenSize,
      price: chosenPrice,
      variant_id: targetVariantId || activeVariant?.id || activeVariant?.variant_id || null,
      sku: product?.sku || activeVariant?.sku,
      variant_attributes: product?.attributes || activeVariant?.attributes || null,
      stock: currentStock,
      image: displayImage,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-[18px] p-3 sm:p-3.5 flex flex-col justify-between border border-white/80 shadow-[0_10px_30px_rgba(131,37,78,0.06)] transition-all duration-300 group relative hover:shadow-[0_20px_40px_rgba(131,37,78,0.12)] hover:bg-white hover:-translate-y-1">
      {/* Top Left Badge: Stock or Product Tag */}
      {isOutOfStock ? (
        <span className="absolute top-3 left-3 z-10 bg-red-100/95 text-red-700 border border-red-200 text-[0.65rem] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-xs shadow-xs">
          Out of Stock
        </span>
      ) : (
        product?.tag && (
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

      {/* Top Right Badge: Variant size pill */}
      {variantLabel && (
        <span
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            color: THEME_COLORS.primary,
          }}
          className="absolute top-3 right-3 z-10 text-[0.68rem] px-2.5 py-0.5 rounded-full font-bold tracking-wider backdrop-blur-md shadow-xs border border-primary/15"
        >
          {variantLabel}
        </span>
      )}

      {/* Product Image Link */}
      <Link
        to={detailUrl}
        className="w-full aspect-square rounded-xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500 bg-neutral-100/50 block"
      >
        <img
          src={displayImage}
          alt={product?.name}
          className={`w-full h-full object-cover rounded-xl transition-all duration-300 ${
            isOutOfStock ? "opacity-60 grayscale-[30%]" : ""
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
      </Link>

      {/* Title & Price Header */}
      <div className="w-full mt-2.5 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={detailUrl}
            className="hover:text-accent transition-colors flex-1 min-w-0 text-left"
          >
            <h3
              style={{ color: THEME_COLORS.primary }}
              className="text-[0.92rem] sm:text-[1rem] font-serif font-bold capitalize truncate"
              title={product?.name}
            >
              {displayName}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
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

        {/* Elegant Variant Subtitle */}
        {variantLabel && (
          <div className="flex items-center gap-1.5 text-[0.72rem] text-primary/65 font-medium mt-0.5">
            <span className="font-semibold text-accent">{variantLabel}</span>
            <span className="opacity-40">•</span>
            <span>Eau de Parfum</span>
          </div>
        )}
      </div>

      {/* Fallback Variant Pills Selector if rendered as multi-variant base card */}
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
      <div className="flex gap-2 w-full mt-auto pt-2.5">
        {isOutOfStock ? (
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
          to={detailUrl}
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
