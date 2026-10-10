/**
 * Utility functions for product and variant normalization, expansion,
 * stock calculation, and label formatting across the storefront.
 */

export const isUuidOrId = (str) => {
  if (typeof str !== "string") return false;
  return (
    str.length > 20 ||
    str.includes("INV-") ||
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
  );
};

export const getVariantLabel = (v, index = 0) => {
  if (!v) return `Option ${index + 1}`;
  if (v.size && typeof v.size === "string" && !isUuidOrId(v.size)) return v.size;
  if (v.weight && typeof v.weight === "string" && !isUuidOrId(v.weight)) return v.weight;
  if (
    v.attributes &&
    typeof v.attributes === "object" &&
    Object.keys(v.attributes).length > 0
  ) {
    const sizeVal =
      v.attributes.Size ||
      v.attributes.size ||
      v.attributes.Volume ||
      v.attributes.volume ||
      v.attributes.Weight ||
      v.attributes.weight;
    if (sizeVal && typeof sizeVal === "string" && !isUuidOrId(sizeVal)) {
      return sizeVal;
    }
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

export const formatVariantFullName = (v) => {
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

export const getStockCount = (item) => {
  if (!item) return 0;
  const stock = item.stock_quantity ?? item.stock ?? item.quantity;
  const reserved = item.reserved ?? 0;
  if (stock !== undefined && stock !== null) {
    return Math.max(0, stock - reserved);
  }
  return 999;
};

/**
 * Expands a list of base products into separate variant items.
 * Each variant is presented as its own product item with dedicated image,
 * title, price, stock, and attributes, while keeping parent references for navigation.
 */
export const expandProductsToVariants = (baseProducts) => {
  if (!Array.isArray(baseProducts)) return [];

  const expanded = [];

  baseProducts.forEach((product) => {
    if (!product) return;

    const variants = product.real_variants || product.variants || [];

    if (Array.isArray(variants) && variants.length > 0) {
      variants.forEach((v, idx) => {
        if (!v) return;

        const variantId = v.id ?? v.variant_id ?? `${product.id}-var-${idx}`;
        const label = getVariantLabel(v, idx);
        const stockCount = getStockCount(v);
        const chosenPrice = v.price != null ? v.price : product.price;
        const chosenMrp = v.mrp || product.mrp || product.base_price;
        const chosenDiscount = v.discount || product.discount;
        const chosenOldPrice = v.oldPrice || product.oldPrice;

        const variantImage =
          v.image ||
          (Array.isArray(v.images) && v.images[0]) ||
          product.image ||
          (Array.isArray(product.images) && product.images[0]) ||
          "";

        const variantImages =
          Array.isArray(v.images) && v.images.length > 0
            ? v.images
            : Array.isArray(product.images) && product.images.length > 0
            ? product.images
            : [variantImage].filter(Boolean);

        expanded.push({
          id: `${product.id}--${variantId}`,
          productId: product.id,
          base_product_id: product.id,
          variant_id: variantId,
          base_name: product.name,
          variant_label: label,
          name: `${product.name} (${label})`,
          displayName: product.name,
          description: product.description,
          price: chosenPrice,
          mrp: chosenMrp,
          discount: chosenDiscount,
          oldPrice: chosenOldPrice,
          image: variantImage,
          images: variantImages,
          stock: stockCount,
          stock_quantity: stockCount,
          reserved: v.reserved ?? 0,
          sku: v.sku || product.sku,
          attributes: v.attributes || { Size: label },
          size: v.size || label,
          weight: v.weight || label,
          selectedSize: label,
          category: product.category,
          tag: product.tag || "Handcrafted",
          is_variant_view: true,
          real_variants: [v],
          variants: [v],
          all_product_variants: variants,
          parent_product: product,
          raw_variant: v,
        });
      });
    } else {
      // Product has no variants: preserve as single item
      expanded.push({
        ...product,
        base_product_id: product.id,
        productId: product.id,
        base_name: product.name,
        displayName: product.name,
        is_variant_view: false,
        all_product_variants: [],
      });
    }
  });

  return expanded;
};
