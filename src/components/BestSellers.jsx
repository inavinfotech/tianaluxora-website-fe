import { Link } from "react-router-dom";
import ProductCard from "./utils/ProductCard";
import { useProducts } from "../contexts/ProductContext";

const BestSellers = () => {
  const { products, loading, error } = useProducts();

  if (loading)
    return <div className="text-center py-10">Loading products...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <section className="py-8 md:py-12 animate-fade-in">
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-[1.8rem] md:text-[2.2rem] mb-2 text-primary font-serif font-bold">
          Our Best Sellers
        </h2>
        <p className="text-[0.9rem] md:text-[1rem] text-[rgba(90,50,50,0.7)] max-w-[500px] mx-auto">
          Explore our most popular and captivating fragrances that define modern
          elegance.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Link
          to="/shop"
          className="bg-[#f7d7c4] text-primary px-8 py-3 rounded-[50px] font-medium text-[1rem] flex items-center gap-[0.8rem] shadow-[0_10px_30px_rgba(212,140,106,0.2)] transition-custom hover:-translate-y-[5px] hover:shadow-[0_15px_40px_rgba(212,140,106,0.3)] hover:bg-[#f5ccb5]"
        >
          View all Products <span>→</span>
        </Link>
      </div>
    </section>
  );
};

export default BestSellers;
