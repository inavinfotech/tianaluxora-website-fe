import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./utils/ProductCard";
import ProductSkeleton from "./utils/ProductSkeleton";
import { useProducts } from "../contexts/ProductContext";
import { getPath } from "../utils/paths";
import THEME_COLORS from "../styles/theme";
import { Sparkles } from "lucide-react";

const BestSellers = () => {
  const { products, loading, error } = useProducts();
  const [activeSizeFilter, setActiveSizeFilter] = useState("all");

  const filterOptions = [
    { id: "all", label: "All Editions" },
    { id: "50ml", label: "50ml Signature" },
    { id: "100ml", label: "100ml Statement" },
    { id: "30ml", label: "30ml Discovery" },
  ];

  const displayedProducts = useMemo(() => {
    const list = products || [];
    if (activeSizeFilter === "all") return list;
    return list.filter((p) => {
      const label = (p.variant_label || p.size || p.name || "").toLowerCase();
      return label.includes(activeSizeFilter.toLowerCase());
    });
  }, [products, activeSizeFilter]);

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-14 animate-fade-in">
      <div className="text-center mb-6 md:mb-10">
        <div className="text-accent text-[11px] font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-1.5 mb-2">
          <Sparkles size={13} className="text-accent" />
          <span>Star Fragrances</span>
        </div>
        <h2 className="text-[2rem] md:text-[2.6rem] mb-2 text-primary font-serif font-bold">
          Our Best Sellers
        </h2>
        <p className="text-sm md:text-base text-primary/70 max-w-[540px] mx-auto font-normal mb-6">
          Explore our most sought-after signature perfumes in distinct bottle sizes, each crafted to define luxury, longevity, and modern grace.
        </p>

        {/* Quick Size Filter Tabs */}
        {!loading && !error && products.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
            {filterOptions.map((opt) => {
              const isSelected = activeSizeFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setActiveSizeFilter(opt.id)}
                  style={{
                    backgroundColor: isSelected ? THEME_COLORS.primary : "#ffffff",
                    color: isSelected ? "#ffffff" : THEME_COLORS.primary,
                    borderColor: isSelected ? THEME_COLORS.primary : "rgba(131, 37, 78, 0.15)",
                  }}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? "shadow-sm scale-105"
                      : "hover:border-primary/40 hover:bg-neutral-50"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 font-serif">
          Error loading best sellers: {error}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8 md:mt-12">
        <Link
          to={getPath("/shop")}
          style={{ backgroundColor: "#83254e", color: "#ffffff" }}
          className="px-9 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center shadow-md hover:opacity-90 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          View Full Fragrance Catalog
        </Link>
      </div>
    </section>
  );
};

export default BestSellers;
