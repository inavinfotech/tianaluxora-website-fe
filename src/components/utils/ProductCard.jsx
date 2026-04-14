import React from "react";
import Button from "./Button";
import { useCart } from "../../contexts/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  return (
    <div className="bg-white/40 backdrop-blur-md rounded-[16px] p-3 flex flex-col items-center gap-2 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-custom group relative">
      {product.tag && (
        <span className="absolute top-3 left-3 bg-[#f7d7c4] text-primary text-[0.65rem] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          {product.tag}
        </span>
      )}
      <div className="w-full aspect-4/3 flex justify-center items-center py-2">
        <img
          src={product.image}
          alt={product.name}
          className="w-2/3 h-full object-contain transition-transform"
        />
      </div>
      <div className="text-center">
        <h3 className="text-[0.95rem] font-serif font-bold mb-0.5">
          {product.name}
        </h3>
        <p className="text-[0.9rem] font-medium text-accent">{product.price}</p>
      </div>
      <Button
        onClick={() => addToCart(product)}
        className="mt-1 text-[0.85rem] px-4 py-2 "
      >
        Add to Cart <span>→</span>
      </Button>
    </div>
  );
};

export default ProductCard;
