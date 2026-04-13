import React from "react";
import Button from "./Button";

const CollectionCard = ({ collection }) => {
  return (
    <div className="group relative h-[300px] md:h-[380px] rounded-[20px] md:rounded-[25px] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.12)] transition-transform">
      <img
        src={collection.image}
        alt={collection.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/40 to-transparent flex flex-col justify-end p-8">
        <h3 className="text-white text-[1.5rem] font-serif font-bold mb-2">
          {collection.title}
        </h3>
        <p className="text-white/80 text-[0.9rem] mb-6 line-clamp-2">
          {collection.description}
        </p>
        <Button variant="text-gold" className="text-[#b8b8b8] w-fit">
          Shop Now
        </Button>
      </div>
    </div>
  );
};

export default CollectionCard;
