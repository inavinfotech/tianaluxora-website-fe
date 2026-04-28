import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import api from "../utils/api";
import { getPath } from "../utils/paths";
import {
  Star,
  MapPin,
  ChevronDown,
  ArrowLeft,
  Heart,
  Share2,
  ShieldCheck,
  RotateCcw,
  Truck,
} from "lucide-react";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [pincode, setPincode] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/products/${productId}`);
        const data = await response.json();
        setProduct(data);
        setSelectedImage(data.image);
        if (data.real_variants && data.real_variants.length > 0) {
          setSelectedSize(data.real_variants[0].weight);
        } else if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      const selectedVariant = product.real_variants?.find(
        (v) => v.weight === selectedSize,
      );
      addToCart({
        ...product,
        quantity: 1,
        selectedSize,
        price: selectedVariant ? selectedVariant.price : product.price,
        variant_id: selectedVariant?.id,
        sku: selectedVariant ? selectedVariant.sku : product.sku,
      });
    }
  };

  const getDisplayPrice = () => {
    if (!product) return "";
    const selectedVariant = product.real_variants?.find(
      (v) => v.weight === selectedSize,
    );
    const price = selectedVariant ? selectedVariant.price : product.price;
    return typeof price === "number" ? `₹${price}` : price;
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6">
        <h2 className="font-serif text-3xl text-primary font-bold">
          Product not found
        </h2>
        <button
          onClick={() => navigate(getPath("/shop"))}
          className="flex items-center gap-2 group text-accent hover:text-primary transition-colors font-semibold"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Collections
        </button>
      </div>
    );
  }

  return (
    <div className="py-2 md:py-4">
      {/* Breadcrumbs - Reduced margin */}
      <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-primary/40 mb-4 animate-fade-in">
        <span
          className="cursor-pointer hover:text-accent transition-colors"
          onClick={() => navigate(getPath("/"))}
        >
          Home
        </span>
        <span className="text-[8px] opacity-30">/</span>
        <span
          className="cursor-pointer hover:text-accent transition-colors"
          onClick={() => navigate(getPath("/shop"))}
        >
          Shop
        </span>
        <span className="text-[8px] opacity-30">/</span>
        <span className="text-secondary font-bold capitalize">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Gallery Section - More compact */}
        <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-12 gap-3 animate-slide-right">
          {/* Thumbnails - Showing all available images */}
          <div className="md:col-span-2 order-2 md:order-1 flex flex-row md:flex-col gap-2 h-fit md:max-h-[500px] overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 md:pr-1 custom-scrollbar scrollbar-hide">
            {(() => {
              const baseUrl = product.image?.includes("/uploads/")
                ? product.image.split("/uploads/")[0]
                : "";
              const allImages = [
                product.image,
                ...(product.thumbnails || []),
                ...(product.images || []).map((img) =>
                  img.startsWith("/") && baseUrl ? `${baseUrl}${img}` : img,
                ),
              ]
                .filter(Boolean)
                .filter((v, i, a) => a.indexOf(v) === i);

              return allImages.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(thumb)}
                  className={`aspect-square w-16 md:w-full rounded-lg overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                    selectedImage === thumb
                      ? "border-accent ring-1 ring-accent/10 shadow-sm"
                      : "border-transparent hover:border-accent/30"
                  }`}
                >
                  <img
                    src={thumb}
                    alt={`View ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ));
            })()}
          </div>

          {/* Main Image - Smaller padding and aspect ratio */}
          <div className="md:col-span-10 order-1 md:order-2">
            <div className="aspect-square md:aspect-square max-h-[400px] md:max-h-none bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100 flex items-center justify-center relative group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain p-2 drop-shadow-lg transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all ${
                    isWishlisted
                      ? "bg-rose-500 text-white"
                      : "bg-white/80 text-primary hover:bg-white"
                  }`}
                >
                  <Heart
                    size={18}
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-primary hover:bg-white flex items-center justify-center shadow-lg transition-all">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section - Tighter spacing */}
        <div className="lg:col-span-6 flex flex-col gap-5 animate-slide-left">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex bg-amber-50 px-2 py-0.5 rounded-full items-center gap-1 border border-amber-100">
                <Star size={12} fill="#d97706" className="text-amber-600" />
                <span className="text-[10px] font-bold text-amber-900">
                  {product.rating || "4.8"}
                </span>
              </div>
              <span className="text-[10px] text-primary/40 font-medium tracking-tight">
                ({product.reviews || 124} Reviews)
              </span>
            </div>

            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-secondary tracking-tight capitalize">
              {product.name}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">
                    {getDisplayPrice()}
                  </span>
                  <span className="text-base line-through text-primary/20 font-medium">
                    {product.oldPrice || "₹1299"}
                  </span>
                </div>
                <span className="text-[10px] w-fit font-bold bg-[#E4C59E] px-2 py-0.5 rounded text-primary uppercase tracking-wider">
                  {product.discount || "15% OFF"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Size Selector */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/50">
                Size
              </label>
              <div className="relative">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-neutral-50/50 border border-neutral-100 rounded-xl py-3 px-4 appearance-none font-medium focus:outline-none focus:ring-1 focus:ring-accent/20 cursor-pointer text-sm"
                >
                  {(product.sizes || ["50 ml", "100 ml", "250 ml"]).map(
                    (size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ),
                  )}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            {/* Pincode Check */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/50">
                Check Delivery
              </label>
              <div className="flex border border-neutral-100 rounded-xl overflow-hidden shadow-sm bg-white">
                <input
                  type="text"
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 py-3 px-4 outline-none text-xs font-medium w-full"
                />
                <button className="px-4 bg-neutral-50 hover:bg-neutral-100 text-[10px] font-bold uppercase tracking-widest text-secondary transition-colors">
                  Check
                </button>
              </div>
            </div>
          </div>

          {/* CTA Buttons - More compact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => {
                handleAddToCart();
                navigate(getPath("/cart"));
              }}
              style={{ backgroundColor: "#5a3232", color: "#ffffff" }}
              className="py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-all shadow-lg active:scale-95"
            >
              Buy Now
            </button>
            <button
              onClick={() => {
                handleAddToCart();
                navigate(getPath("/cart"));
              }}
              style={{ backgroundColor: "#E4C59E", color: "#5a3232" }}
              className="py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
            >
              Add to Cart
            </button>
          </div>

          {/* Description Section - Expanded layout */}
          <div className="bg-neutral-50/30 rounded-2xl p-6 border border-neutral-100">
            <h4 className="text-secondary font-serif font-bold text-lg mb-3">
              Description
            </h4>
            <p className="text-primary/70 text-sm leading-relaxed">
              {product.description ||
                "No description available for this exquisite product."}
            </p>
          </div>
        </div>
      </div>

      {/* Trust Badges - Centered on mobile */}
      <div className="mt-8 py-6 border-t border-neutral-100 grid grid-cols-3 md:grid-cols-3 gap-6">
        {[
          {
            icon: ShieldCheck,
            title: "100% Original",
            sub: "Authenticity Guaranteed",
          },
          {
            icon: RotateCcw,
            title: "7 Day Return",
            sub: "Hassle-free Returns",
          },
          { icon: Truck, title: "Fast Shipping", sub: "Express Safe Delivery" },
        ].map((badge, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-4 group text-center md:text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300 shadow-sm border border-neutral-100">
              <badge.icon size={22} />
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5">
                {badge.title}
              </h4>
              <p className="text-[8px] text-primary/40 uppercase tracking-widest leading-none">
                {badge.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
