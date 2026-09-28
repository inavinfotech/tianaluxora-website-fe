import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="bg-white/40 backdrop-blur-md rounded-[16px] p-3 flex flex-col items-center gap-3 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.05)] animate-pulse w-full">
      {/* Image Skeleton */}
      <div className="w-full aspect-4/3 flex justify-center items-center py-2 relative">
        <div className="w-2/3 h-full bg-primary/10 rounded-xl"></div>
      </div>

      {/* Title & Price Skeleton */}
      <div className="w-full flex items-center justify-between px-0.5 gap-2">
        <div className="h-4 bg-primary/15 rounded-md w-1/2"></div>
        <div className="h-4 bg-primary/10 rounded-md w-1/4"></div>
      </div>

      {/* Buttons Skeleton */}
      <div className="flex gap-2 w-full mt-1">
        <div className="flex-1 h-8 bg-primary/15 rounded-full"></div>
        <div className="flex-1 h-8 bg-primary/10 rounded-full"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
