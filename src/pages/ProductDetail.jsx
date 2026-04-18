import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import api from "../utils/api";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/products/${productId}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <h2 className="font-serif text-2xl">Product not found</h2>
        <button
          onClick={() => navigate("/shop")}
          className="text-accent underline underline-offset-4"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Product Image */}
        <div className="relative group">
          <div className="aspect-4/5 bg-[rgba(61,26,26,0.03)] rounded-2xl overflow-hidden border border-[rgba(61,26,26,0.05)]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain transition-custom p-8"
            />
          </div>
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <span className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-primary shadow-sm">
              New Collection
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <nav className="flex gap-2 text-[10px] uppercase tracking-widest text-primary/40 mb-6">
            <span
              className="cursor-pointer hover:text-accent"
              onClick={() => navigate("/")}
            >
              Home
            </span>
            <span>/</span>
            <span
              className="cursor-pointer hover:text-accent"
              onClick={() => navigate("/shop")}
            >
              Shop
            </span>
            <span>/</span>
            <span className="text-primary/80">{product.name}</span>
          </nav>

          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-2xl font-medium text-accent">
              {product.price}
            </span>
            <div className="h-4 w-px bg-primary/10"></div>
            <span className="text-xs uppercase tracking-widest text-primary/60">
              Tax Included
            </span>
          </div>

          <p className="text-primary/70 leading-relaxed mb-10 max-w-lg">
            {product.description ||
              "Indulge in the epitome of craftsmanship with Tiana Luxora's signature fragrance. A balanced blend of rare botanicals and essential oils, designed for the discerning individual who appreciates the finer things in life."}
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center border border-[rgba(61,26,26,0.1)] rounded-full px-4 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:text-accent transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:text-accent transition-colors"
                >
                  +
                </button>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-primary/40 mb-1">
                  Stock Status
                </span>
                <span className="text-xs font-medium text-green-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                  In Stock (Express Delivery)
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-primary text-white py-4 md:py-5 px-12 rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:bg-accent hover:-translate-y-1 active:scale-95 transition-custom shadow-xl shadow-primary/10 w-full md:w-fit"
            >
              Add to Cart — Reserve Order
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-[rgba(61,26,26,0.05)] flex gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-primary/40">
                Sku
              </span>
              <span className="text-xs">{product.sku || "TL-8829-X"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-primary/40">
                Category
              </span>
              <span className="text-xs">Signature Series</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
