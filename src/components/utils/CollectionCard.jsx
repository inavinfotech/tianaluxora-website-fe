import React from "react";
import { Link } from "react-router-dom";
import { getPath } from "../../utils/paths";
import { ArrowRight } from "lucide-react";

const CollectionCard = ({ collection }) => {
  // Extract category key e.g. "Floral", "Woody", "Luxury", "Gift Sets"
  const categoryParam = collection.title.toLowerCase().includes("floral")
    ? "Floral"
    : collection.title.toLowerCase().includes("woody")
    ? "Woody"
    : collection.title.toLowerCase().includes("gift")
    ? "Gift Sets"
    : collection.title.toLowerCase().includes("luxury")
    ? "Luxury"
    : collection.title;

  return (
    <Link
      to={getPath(`/shop?category=${encodeURIComponent(categoryParam)}`)}
      className="group relative h-[320px] md:h-[400px] rounded-[24px] overflow-hidden shadow-[0_15px_35px_rgba(131,37,78,0.12)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_22px_45px_rgba(131,37,78,0.22)] block border border-white/40"
    >
      <img
        src={collection.image}
        alt={collection.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#83254e]/95 via-[#83254e]/40 to-transparent flex flex-col justify-end p-6 sm:p-7">
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#f7ece8]/80 mb-1">
          Fragrance Family
        </span>
        <h3 className="text-white text-[1.4rem] sm:text-[1.55rem] font-serif font-bold mb-1.5 leading-tight group-hover:text-[#f7ece8] transition-colors">
          {collection.title}
        </h3>
        <p className="text-white/80 text-xs sm:text-[0.85rem] mb-5 line-clamp-2 leading-relaxed font-light">
          {collection.description}
        </p>
        <div className="inline-flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/40 w-fit group-hover:bg-white group-hover:text-primary transition-all duration-300">
          <span>Explore Scents</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;

