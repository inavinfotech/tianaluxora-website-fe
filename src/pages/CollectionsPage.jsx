import React from "react";
import CollectionCard from "../components/utils/CollectionCard";
import { collections } from "../data/collections";
import { Link } from "react-router-dom";
import { getPath } from "../utils/paths";
import { Sparkles } from "lucide-react";

const CollectionsPage = () => {
  return (
    <div className="py-8 animate-fade-in flex flex-col min-h-screen min-h-[100dvh]">
      <div className="flex-1 max-w-[1400px] mx-auto px-4 md:px-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-primary/60 mb-6 font-medium">
          <Link to={getPath("/")} className="hover:text-accent transition-colors">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-primary font-bold">Collections</span>
        </nav>

        <div className="text-center mb-10 md:mb-14">
          <div className="text-accent text-xs font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-1.5 mb-2">
            <Sparkles size={14} className="text-accent" />
            <span>Signature Fragrance Realms</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-primary font-bold mb-3">
            Our Olfactory Collections
          </h1>
          <p className="text-sm md:text-base text-primary/70 max-w-xl mx-auto font-normal">
            Immerse yourself in carefully curated aroma profiles designed for every mood, season, and occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;

