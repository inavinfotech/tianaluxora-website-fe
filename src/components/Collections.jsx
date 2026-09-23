import { Link } from "react-router-dom";
import CollectionCard from "./utils/CollectionCard";
import { collections } from "../data/collections";

const Collections = () => {
  return (
    <section className="py-8 md:py-12 animate-fade-in">
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-[1.8rem] md:text-[2.2rem] mb-2 text-primary font-serif font-bold">
          Explore our Collection
        </h2>
        <p className="text-[0.9rem] md:text-[1rem] text-[rgba(131,37,78,0.7)] max-w-[500px] mx-auto">
          Curated fragrance collections for every mood and moment.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Link
          to="/collections"
          className="bg-[#f7c2d4] hover:bg-[#f4b8cc] text-[#83254e] px-8 py-3.5 rounded-[50px] font-bold text-[1rem] flex items-center justify-center border border-white/60 shadow-[0_10px_30px_rgba(217,115,152,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(217,115,152,0.4)]"
        >
          View all Collections
        </Link>
      </div>
    </section>
  );
};

export default Collections;
