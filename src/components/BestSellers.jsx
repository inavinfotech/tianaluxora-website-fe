import { Link } from "react-router-dom";
import ProductCard from "./utils/ProductCard";
import ProductSkeleton from "./utils/ProductSkeleton";
import { useProducts } from "../contexts/ProductContext";
import { getPath } from "../utils/paths";

const BestSellers = () => {
  const { products, loading, error } = useProducts();

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12 animate-fade-in">
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-[1.8rem] md:text-[2.2rem] mb-2 text-primary font-serif font-bold">
          Our Best Sellers
        </h2>
        <p className="text-[0.9rem] md:text-[1rem] text-primary font-medium max-w-[500px] mx-auto">
          Explore our most popular and captivating fragrances that define modern
          elegance.
        </p>
      </div>

      {error ? (
        <div className="text-center py-10 text-red-500">Error: {error}</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            : products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      )}

      <div className="flex justify-center mt-6">
        <Link
          to={getPath("/shop")}
          className="bg-[#f7c2d4] hover:bg-[#f4b8cc] text-[#83254e] px-8 py-3.5 rounded-[50px] font-bold text-[1rem] flex items-center justify-center border border-white/60 shadow-[0_10px_30px_rgba(217,115,152,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(217,115,152,0.4)]"
        >
          View all Products
        </Link>
      </div>
    </section>
  );
};

export default BestSellers;
