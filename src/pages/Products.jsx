import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import ProductCard from "../components/utils/ProductCard";
import ProductSkeleton from "../components/utils/ProductSkeleton";
import { useProducts } from "../contexts/ProductContext";
import { getPath } from "../utils/paths";

const Products = () => {
  const { products, loading, error } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameters
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  const categoryFromUrl = searchParams.get("category")?.toLowerCase() || "all";

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);

  // Keep local state synced with URL changes
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  const handleClearFilters = () => {
    setSelectedCategory("all");
    navigate(getPath("/shop"));
  };

  // Filter products based on search query & category
  const filteredProducts = useMemo(() => {
    let result = products || [];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery) ||
          p.description?.toLowerCase().includes(searchQuery) ||
          p.sku?.toLowerCase().includes(searchQuery) ||
          (p.tag && p.tag.toLowerCase().includes(searchQuery))
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((p) => {
        const name = (p.name || "").toLowerCase();
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
        if (selectedCategory === "gift sets" || selectedCategory === "gift") {
          return name.includes("set") || name.includes("gift") || desc.includes("gift") || tag.includes("gift");
        }
        return name.includes(selectedCategory) || desc.includes(selectedCategory) || tag.includes(selectedCategory) || cat.includes(selectedCategory);
      });
    }

    return result;
  }, [products, searchQuery, selectedCategory]);

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
        </nav>

        {/* Page Header */}
        <div className="mb-8 border-b border-primary/10 pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
            {searchQuery ? `Search Results: "${searchQuery}"` : "The Fragrance Catalog"}
          </h1>
          <p className="text-xs sm:text-sm text-primary/70 font-normal mt-1">
            Showing {loading ? "..." : filteredProducts.length} handcrafted perfumes
          </p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-serif">
            Error loading catalog: {error}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
              We couldn't find any perfumes matching your selected filters. Try choosing a different scent category or clear your search query.
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

