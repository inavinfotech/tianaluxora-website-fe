import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { getPath } from "../../utils/paths";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  return (
    <div className="bg-white/40 backdrop-blur-md rounded-[16px] p-3 flex flex-col items-center gap-2 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-custom group relative hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
      {product.tag && (
        <span className="absolute top-3 left-3 z-10 bg-[#f7d7c4] text-primary text-[0.65rem] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          {product.tag}
        </span>
      )}

      <Link
        to={getPath(`/product/${product.id}`)}
        className="w-full aspect-4/3 flex justify-center items-center py-2 relative overflow-hidden group-hover:scale-105 transition-transform duration-500"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-2/3 h-full object-contain transition-transform"
        />
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </Link>

      <div className="text-center">
        <Link
          to={getPath(`/product/${product.id}`)}
          className="hover:text-accent transition-colors"
        >
          <h3 className="text-[0.95rem] font-serif font-bold mb-0.5">
            {product.name}
          </h3>
        </Link>
        <p className="text-[0.9rem] font-medium text-accent">
          {product.real_variants && product.real_variants.length > 0
            ? `From Rs ${Math.min(...product.real_variants.map((v) => v.price))}`
            : typeof product.price === "number"
              ? `Rs ${product.price}`
              : product.price}
        </p>
      </div>

      <div className="flex gap-2 w-full mt-1">
        {product.real_variants && product.real_variants.length > 0 ? (
          <Link
            to={getPath(`/product/${product.id}`)}
            className="flex-1 bg-secondary text-white text-[0.7rem] px-2 py-2 flex items-center justify-center rounded-full uppercase tracking-widest font-bold transition-custom"
          >
            Choose
          </Link>
        ) : (
          <Button
            onClick={() => addToCart(product)}
            className="flex-1 text-[0.7rem] px-2 py-2 uppercase tracking-widest font-bold"
          >
            Add
          </Button>
        )}
        <Link
          to={getPath(`/product/${product.id}`)}
          className="flex-1 bg-white/60 hover:bg-white text-primary text-[0.7rem] px-2 py-2 flex items-center justify-center rounded-full uppercase tracking-widest font-bold border border-primary/5 transition-custom"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
