import React from "react";
import Button from "./Button";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { getPath } from "../../utils/paths";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const prodStock = product.stock_quantity ?? product.stock ?? product.quantity;
  const hasVariants = product.real_variants && product.real_variants.length > 0;
  const isOutOfStock = hasVariants
    ? product.real_variants.every((v) => (v.stock ?? v.quantity ?? 0) <= 0)
    : prodStock !== undefined && prodStock !== null && prodStock <= 0;

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-[16px] p-3 flex flex-col items-center gap-2 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-custom group relative hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
      {isOutOfStock ? (
        <span className="absolute top-3 left-3 z-10 bg-red-100 text-red-700 border border-red-200 text-[0.65rem] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Out of Stock
        </span>
      ) : (
        product.tag && (
          <span className="absolute top-3 left-3 z-10 bg-[#f7d7c4] text-primary text-[0.65rem] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {product.tag}
          </span>
        )
      )}

      <Link
        to={getPath(`/product/${product.id}`)}
        className="w-full aspect-square rounded-xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500 bg-neutral-100/50 block"
      >
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-fill rounded-xl transition-transform ${
            isOutOfStock ? "opacity-60 grayscale-[30%]" : ""
          }`}
        />
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
      </Link>

      <div className="text-center">
        <Link
          to={getPath(`/product/${product.id}`)}
          className="hover:text-accent transition-colors"
        >
          <h3 className="text-[0.95rem] font-serif font-bold mb-0.5 capitalize">
            {product.name}
          </h3>
        </Link>
        <p className="text-[0.9rem] font-medium text-accent">
          {product.real_variants && product.real_variants.length > 0
            ? `From ₹${Math.min(...product.real_variants.map((v) => v.price))}`
            : typeof product.price === "number"
              ? `₹${product.price}`
              : product.price}
        </p>
      </div>

      <div className="flex gap-2 w-full mt-1">
        {isOutOfStock ? (
          <button
            disabled
            className="flex-1 bg-neutral-200 text-neutral-400 text-[0.7rem] px-2 py-2 flex items-center justify-center rounded-full uppercase tracking-widest font-bold cursor-not-allowed"
          >
            Out of Stock
          </button>
        ) : product.real_variants && product.real_variants.length > 0 ? (
          <Link
            to={getPath(`/product/${product.id}`)}
            style={{ backgroundColor: "#5a3232", color: "#ffffff" }}
            className="flex-1 text-[0.7rem] px-2 py-2 flex items-center justify-center rounded-full uppercase tracking-widest font-bold transition-custom"
          >
            Choose
          </Link>
        ) : (
          <Button
            onClick={() => {
              addToCart(product);
              navigate(getPath("/cart"));
            }}
            style={{ backgroundColor: "#5a3232", color: "#ffffff" }}
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
