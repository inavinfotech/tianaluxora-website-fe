import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/utils/ProductCard";
import ProductSkeleton from "../components/utils/ProductSkeleton";
import { useProducts } from "../contexts/ProductContext";
import { getPath } from "../utils/paths";

const Products = () => {
  const { products, loading, error } = useProducts();
  const list = products || [];

  return (
    <div className="py-6 sm:py-8 animate-fade-in flex flex-col min-h-[100dvh]">
      <div className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-primary/60 mb-5 font-medium">
          <Link to={getPath("/")} className="hover:text-accent transition-colors">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-primary font-bold">Fragrance Catalog</span>
        </nav>

        {/* Page Header */}
        <div className="mb-6 border-b border-primary/10 pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
            The Fragrance Catalog
          </h1>
          <p className="text-xs sm:text-sm text-primary/70 font-normal mt-1">
            Showing {loading ? "..." : list.length} handcrafted bottle editions
          </p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-serif">
            Error loading catalog: {error}
          </div>
        ) : list.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {list.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="min-h-[45dvh] flex flex-col items-center justify-center border-2 border-dashed border-primary/10 rounded-3xl p-8 text-center bg-[#faf6f4]/50">
            <h2 className="font-serif text-2xl font-bold text-primary mb-2">
              New creations coming soon
            </h2>
            <p className="text-xs sm:text-sm text-primary/60 max-w-md leading-relaxed">
              Our fragrance catalog is being refreshed. Please check back shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
