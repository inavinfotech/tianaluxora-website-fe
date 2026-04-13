import React from "react";
import ProductCard from "../components/utils/ProductCard";
import { useProducts } from "../contexts/ProductContext";

const Products = () => {
  const { products, loading, error } = useProducts();

  if (loading)
    return <div className="text-center py-20">Loading products...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="py-20">
      <h1 className="text-[3rem] text-center mb-12">All Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
