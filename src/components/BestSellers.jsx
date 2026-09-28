import { Link } from "react-router-dom";
import ProductCard from "./utils/ProductCard";
import ProductSkeleton from "./utils/ProductSkeleton";
import { useProducts } from "../contexts/ProductContext";
import { getPath } from "../utils/paths";
import { Sparkles } from "lucide-react";

const BestSellers = () => {
  const { products, loading, error } = useProducts();

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-14 animate-fade-in">
      <div className="text-center mb-8 md:mb-12">
        <div className="text-accent text-[11px] font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-1.5 mb-2">
          <Sparkles size={13} className="text-accent" />
          <span>Star Fragrances</span>
        </div>
        <h2 className="text-[2rem] md:text-[2.6rem] mb-2 text-primary font-serif font-bold">
          Our Best Sellers
        </h2>
        <p className="text-sm md:text-base text-primary/70 max-w-[520px] mx-auto font-normal">
          Explore our most sought-after signature perfumes that define luxury, longevity, and modern grace.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 font-serif">
          Error loading best sellers: {error}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {(products || []).slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8 md:mt-10">
        <Link
          to={getPath("/shop")}
          style={{ backgroundColor: "#83254e", color: "#ffffff" }}
          className="px-9 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center shadow-md hover:opacity-90 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default BestSellers;

