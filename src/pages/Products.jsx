import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/utils/ProductCard";
import { useProducts } from "../contexts/ProductContext";

const Products = () => {
  const { products, loading, error } = useProducts();
  const location = useLocation();

  // Extract search query from URL
  const query = useMemo(() => {
    return new URLSearchParams(location.search).get("q")?.toLowerCase() || "";
  }, [location.search]);

  // Filter products based on query
  const filteredProducts = useMemo(() => {
    if (!query) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query),
    );
  }, [products, query]);

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-500 font-serif">
        Error: {error}
      </div>
    );

  return (
    <div className="py-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h1 className="font-serif text-[2.5rem] md:text-[3rem] leading-none mb-4">
            {query ? `Search: ${query}` : "All Products"}
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary/40">
            {filteredProducts.length} Exquisite Items Found
          </p>
        </div>

        {query && (
          <button
            onClick={() => window.history.back()}
            className="text-[10px] uppercase tracking-widest text-accent font-bold border-b border-accent pb-1 hover:translate-x-1 transition-transform"
          >
            Clear Search
          </button>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="min-h-[40vh] flex flex-col items-center justify-center border-2 border-dashed border-primary/5 rounded-3xl">
          <h2 className="font-serif text-xl mb-4">
            No treasures found for "{query}"
          </h2>
          <p className="text-sm text-primary/40">
            Try searching for generic terms or browse our collections.
          </p>
        </div>
      )}
    </div>
  );
};

export default Products;
