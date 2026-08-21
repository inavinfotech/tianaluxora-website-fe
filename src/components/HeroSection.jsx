import { Link } from "react-router-dom";
import PerfumeModel from "./PerfumeModel";
import { getPath } from "../utils/paths";

const HeroSection = () => {
  // 3D Model disabled to ensure fast 60FPS page rendering
  const is3dactive = false;

  return (
    <section className="flex flex-col lg:grid lg:grid-cols-[1fr_1.2fr_1fr] items-center gap-8 lg:gap-8 min-h-0 lg:min-h-[calc(100vh-80px)] animate-fade-in text-center lg:text-left py-6 lg:py-0">
      <div className="flex flex-col gap-6 md:gap-8 items-center lg:items-start order-1 lg:order-0">
        <h1 className="text-[2.5rem] sm:text-[2.75rem] md:text-[3rem] leading-[1.12] text-primary font-serif font-bold">
          Luxury That Speaks <br className="block sm:hidden" /> Before You Do
        </h1>
        <p className="text-[1.05rem] md:text-[1.1rem] text-[rgba(131,37,78,0.8)] max-w-[420px]">
          Tiana Luxora<sup>TM</sup> blends rare notes into unforgettable fragrances made for modern elegance.
        </p>
        <Link
          to={getPath("/collections")}
          className="relative overflow-hidden group bg-[#f7c2d4] text-primary px-8 md:px-10 py-4 md:py-5 rounded-[50px] font-bold text-[1rem] md:text-[1.1rem] flex items-center gap-[0.8rem] w-fit shadow-[0_10px_30px_rgba(217,115,152,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(217,115,152,0.5)] hover:bg-[#f4b8cc] my-1 cursor-pointer border border-white/50"
        >
          {/* Continuous Shimmer Light Sheen */}
          <span className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none animate-btn-shine" />

          <span className="relative z-10">Explore Collection</span>
          <span className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
        </Link>
        <div className="text-[0.75rem] md:text-[0.9rem] font-medium uppercase tracking-[1px] text-[rgba(131,37,78,0.7)] mt-1 mb-2">
          100% Authentic — Guaranteed Luxury
        </div>
      </div>

      <div className="order-2 lg:order-0 w-full flex justify-center mt-6 lg:mt-0">
        {is3dactive ? (
          <div className="h-[320px] sm:h-[420px] md:h-[500px] lg:h-[600px] w-full relative flex justify-center items-center">
            <PerfumeModel />
          </div>
        ) : (
          <div className="w-full h-auto max-h-[380px] sm:max-h-[450px] lg:h-[500px] relative flex justify-center items-center px-0">
            <img
              src="/images/big-bottle.webp"
              alt="Miniature Perfume Bottle"
              className="w-full h-auto max-h-full object-contain transition-transform"
            />
          </div>
        )}
      </div>

      <div className="flex justify-center lg:justify-end order-3 lg:order-0 max-lg:hidden">
        <div className="max-w-[320px] flex flex-col gap-4 md:gap-6 items-center lg:items-start">
          <h2 className="text-[1.6rem] md:text-[2rem] leading-[1.2] font-serif font-bold">
            Discover Signature Fragrances at Your Fingertips
          </h2>
          <p className="text-[0.9rem] md:text-[0.95rem] text-[rgba(131,37,78,0.7)]">
            Indulge your senses in a world of elegant and captivating aromas
            crafted for every occasion.
          </p>

          <div className="mt-4 md:mt-8 flex flex-col items-center lg:items-start gap-4">
            <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-[20px] flex justify-center items-center overflow-hidden">
              <img
                src="/images/small-bottle.webp"
                alt="Miniature Perfume Bottle"
                className="w-full h-full object-contain transition-transform"
              />
            </div>
            <Link
              to={getPath("/shop")}
              className="font-semibold flex items-center gap-2 hover:text-accent transition-custom"
            >
              Shop Now <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
