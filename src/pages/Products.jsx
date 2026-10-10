import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import ProductCard from "../components/utils/ProductCard";
import ProductSkeleton from "../components/utils/ProductSkeleton";
import { useProducts } from "../contexts/ProductContext";
import { getPath } from "../utils/paths";
import THEME_COLORS from "../styles/theme";

const SCENT_CATEGORIES = [
  { id: "all", label: "All Fragrances" },
  { id: "floral", label: "Floral" },
  { id: "woody", label: "Woody & Oud" },
  { id: "luxury", label: "Luxury Elixirs" },
  { id: "oriental", label: "Oriental & Amber" },
  { id: "fresh", label: "Fresh Citrus" },
];

const SIZE_OPTIONS = [
  { id: "all", label: "All Sizes" },
  { id: "30ml", label: "30 ml Travel" },
  { id: "50ml", label: "50 ml Signature" },
  { id: "100ml", label: "100 ml Statement" },
];

const Products = () => {
  const { products, loading, error } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameters
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  const categoryFromUrl = searchParams.get("category")?.toLowerCase() || "all";

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [selectedSize, setSelectedSize] = useState("all");

  // Keep local state synced with URL changes
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedSize("all");
    navigate(getPath("/shop"));
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId === "all") {
      navigate(getPath("/shop"));
    } else {
      navigate(getPath(`/shop?category=${catId}`));
    }
  };

  // Filter products based on search query, category, and size
  const filteredProducts = useMemo(() => {
    let result = products || [];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery) ||
          p.base_name?.toLowerCase().includes(searchQuery) ||
          p.displayName?.toLowerCase().includes(searchQuery) ||
          p.variant_label?.toLowerCase().includes(searchQuery) ||
          p.description?.toLowerCase().includes(searchQuery) ||
          p.sku?.toLowerCase().includes(searchQuery) ||
          (p.tag && p.tag.toLowerCase().includes(searchQuery))
      );
    }

    // Filter by scent category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((p) => {
        const name = (p.base_name || p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const tag = (p.tag || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();

        if (selectedCategory === "floral") {
          return name.includes("floral") || desc.includes("floral") || desc.includes("rose") || desc.includes("jasmine") || tag.includes("floral") || cat.includes("floral");
        }
        if (selectedCategory === "woody") {
          return name.includes("wood") || name.includes("oud") || desc.includes("woody") || desc.includes("sandalwood") || desc.includes("cedar") || tag.includes("woody") || cat.includes("woody");
        }
        if (selectedCategory === "luxury") {
          return name.includes("luxury") || name.includes("elixir") || desc.includes("luxury") || desc.includes("exclusive") || tag.includes("luxury") || cat.includes("luxury");
        }
        if (selectedCategory === "oriental") {
          return name.includes("oriental") || desc.includes("amber") || desc.includes("spice") || desc.includes("vanilla") || tag.includes("oriental") || cat.includes("oriental");
        }
        if (selectedCategory === "fresh") {
          return name.includes("fresh") || desc.includes("citrus") || desc.includes("aquatic") || desc.includes("bergamot") || tag.includes("fresh") || cat.includes("fresh");
        }
        return name.includes(selectedCategory) || desc.includes(selectedCategory) || tag.includes(selectedCategory) || cat.includes(selectedCategory);
      });
    }

    // Filter by size
    if (selectedSize && selectedSize !== "all") {
      result = result.filter((p) => {
        const label = (p.variant_label || p.size || p.name || "").toLowerCase();
        return label.includes(selectedSize.toLowerCase());
      });
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedSize]);

  return (
    <div className="py-6 sm:py-8 animate-fade-in flex flex-col min-h-screen min-h-[100dvh]">
      <div className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-primary/60 mb-5 font-medium">
          <Link to={getPath("/")} className="hover:text-accent transition-colors">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-primary font-bold">Fragrance Catalog</span>
          {selectedCategory !== "all" && (
            <>
              <span className="opacity-40">/</span>
              <span className="text-accent font-bold capitalize">{selectedCategory}</span>
            </>
          )}
          {selectedSize !== "all" && (
            <>
              <span className="opacity-40">/</span>
              <span className="text-accent font-bold">{selectedSize}</span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="mb-6 border-b border-primary/10 pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
            {searchQuery ? `Search Results: "${searchQuery}"` : "The Fragrance Catalog"}
          </h1>
          <p className="text-xs sm:text-sm text-primary/70 font-normal mt-1">
            Showing {loading ? "..." : filteredProducts.length} handcrafted bottle editions
          </p>

          {/* Filter Pills Controls */}
          {!loading && !error && (
            <div className="mt-5 flex flex-col gap-3">
              {/* Scent Categories */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary/50 mr-1">
                  Scent:
                </span>
                {SCENT_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      style={{
                        backgroundColor: isSelected ? THEME_COLORS.primary : "#ffffff",
                        color: isSelected ? "#ffffff" : THEME_COLORS.primary,
                        borderColor: isSelected ? THEME_COLORS.primary : "rgba(131, 37, 78, 0.15)",
                      }}
                      className={`text-xs font-semibold px-3.5 py-1 rounded-full border transition-all cursor-pointer shadow-xs ${
                        isSelected
                          ? "shadow-sm scale-102"
                          : "hover:border-primary/40 hover:bg-neutral-50"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Bottle Sizes */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary/50 mr-1">
                  Bottle Size:
                </span>
                {SIZE_OPTIONS.map((size) => {
                  const isSelected = selectedSize === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size.id)}
                      style={{
                        backgroundColor: isSelected ? THEME_COLORS.accent : "#ffffff",
                        color: isSelected ? "#ffffff" : THEME_COLORS.primary,
                        borderColor: isSelected ? THEME_COLORS.accent : "rgba(131, 37, 78, 0.15)",
                      }}
                      className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all cursor-pointer shadow-xs ${
                        isSelected
                          ? "shadow-sm scale-102 text-white"
                          : "hover:border-primary/40 hover:bg-neutral-50"
                      }`}
                    >
                      {size.label}
                    </button>
                  );
                })}
                {(selectedCategory !== "all" || selectedSize !== "all" || searchQuery) && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-xs text-accent hover:underline font-bold ml-2 cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-serif">
            Error loading catalog: {error}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="min-h-[45dvh] flex flex-col items-center justify-center border-2 border-dashed border-primary/10 rounded-3xl p-8 text-center bg-[#faf6f4]/50">
            <h2 className="font-serif text-2xl font-bold text-primary mb-2">
              No creations found
            </h2>
            <p className="text-xs sm:text-sm text-primary/60 max-w-md mb-6 leading-relaxed">
              We couldn't find any perfume editions matching your selected filters. Try choosing a different size or scent category.
            </p>
            <button
              onClick={handleClearFilters}
              style={{ backgroundColor: "#83254e", color: "#ffffff" }}
              className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              Show All Fragrances
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
