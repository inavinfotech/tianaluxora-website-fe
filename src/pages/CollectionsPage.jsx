import React from "react";
import CollectionCard from "../components/utils/CollectionCard";

const collections = [
  {
    id: 1,
    title: "Floral Elegance",
    description: "Soft, elegant fragrances for every moment",
    image: "/images/collections/collection-1.webp",
  },
  {
    id: 2,
    title: "Woody Essence",
    description: "Warm, earthy notes crafted for timeless depth",
    image: "/images/collections/collection-2.webp",
  },
  {
    id: 3,
    title: "Luxury Editions",
    description: "Exclusive blends designed for a refined experience",
    image: "/images/collections/collection-3.webp",
  },
  {
    id: 4,
    title: "Gift Sets",
    description: "Curated collections perfect for every occasion",
    image: "/images/collections/collection-4.webp",
  },
];

const CollectionsPage = () => {
  return (
    <div className="py-20">
      <h1 className="text-[3rem] text-center mb-12">Our Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
};

export default CollectionsPage;
