import { Link } from "react-router-dom";
import CollectionCard from "./utils/CollectionCard";
import { collections } from "../data/collections";
import { getPath } from "../utils/paths";
import { Sparkles } from "lucide-react";

const Collections = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-14 animate-fade-in">
      <div className="text-center mb-8 md:mb-12">
        <div className="text-accent text-[11px] font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-1.5 mb-2">
          <Sparkles size={13} className="text-accent" />
          <span>Curated Olfactory Realms</span>
        </div>
        <h2 className="text-[2rem] md:text-[2.6rem] mb-2 text-primary font-serif font-bold">
          Explore Scent Collections
        </h2>
        <p className="text-sm md:text-base text-primary/70 max-w-[540px] mx-auto font-normal">
          From luminous florals to opulent woody notes, find the aroma that defines your aura.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>

      <div className="flex justify-center mt-8 md:mt-10">
        <Link
          to={getPath("/shop")}
          style={{ backgroundColor: "#83254e", color: "#ffffff" }}
          className="px-9 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center shadow-md hover:opacity-90 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          Discover All Fragrances
        </Link>
      </div>
    </section>
  );
};

export default Collections;

