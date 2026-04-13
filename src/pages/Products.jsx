import React from "react";
import ProductCard from "../components/utils/ProductCard";

const products = [
  {
    id: 1,
    name: "Tiana Luxora Essence",
    price: "Rs 999",
    image: "/images/small-bottle.webp",
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "Tiana Luxora Essence",
    price: "Rs 999",
    image: "/images/small-bottle.webp",
    tag: "Best Seller",
  },
  // Add more products as needed
];

const Products = () => {
  return (
    <div className="py-20">
      <h1 className="text-[3rem] text-center mb-12">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
