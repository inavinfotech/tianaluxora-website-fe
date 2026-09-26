import { Link } from "react-router-dom";
import PerfumeModel from "./PerfumeModel";
import { getPath } from "../utils/paths";

const HeroSection = () => {
  // 3D Model disabled to ensure fast 60FPS page rendering
  const is3dactive = false;

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col lg:grid lg:grid-cols-[1fr_1.2fr_1fr] items-center justify-center gap-6 md:gap-8 min-h-screen min-h-[100dvh] pt-20 sm:pt-24 pb-10 lg:py-0 animate-fade-in text-center lg:text-left">
      <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 items-center lg:items-start order-1 lg:order-0">
        <h1 className="text-[2.6rem] sm:text-[2.75rem] md:text-[3rem] leading-[1.1] text-primary font-serif font-bold">
          Luxury That Speaks <br className="block sm:hidden" /> Before You Do
        </h1>
        <p className="text-[1.1rem] sm:text-[1.05rem] md:text-[1.1rem] text-primary font-medium max-w-[420px]">
          Tiana Luxora<sup>TM</sup> blends rare notes into unforgettable fragrances made for modern elegance.
        </p>
        <Link
          to={getPath("/collections")}
          className="relative overflow-hidden group bg-[#f7c2d4] text-primary px-8 sm:px-8 md:px-10 py-4 sm:py-4 md:py-5 rounded-[50px] font-bold text-[1.08rem] sm:text-[1rem] md:text-[1.1rem] flex items-center justify-center w-fit shadow-[0_10px_30px_rgba(217,115,152,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(217,115,152,0.5)] hover:bg-[#f4b8cc] my-1 cursor-pointer border border-white/50"
        >
          {/* Continuous Shimmer Light Sheen */}
          <span className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none animate-btn-shine" />

          <span className="relative z-10">Explore Collection</span>
        </Link>
        <div className="text-[0.82rem] sm:text-[0.75rem] md:text-[0.85rem] font-bold sm:font-semibold uppercase tracking-[1.2px] md:tracking-[1px] text-primary mt-1 sm:mt-0.5 mb-1">
          100% Authentic — Guaranteed Luxury
        </div>
      </div>

      <div className="order-2 lg:order-0 w-full flex justify-center my-3 sm:my-4 lg:my-0">
        {is3dactive ? (
          <div className="h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] w-full relative flex justify-center items-center">
            <PerfumeModel />
          </div>
        ) : (
          <div className="w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[540px] h-auto max-h-[46dvh] sm:max-h-[50dvh] lg:max-h-[560px] relative flex justify-center items-center px-0">
            <img
              src="/images/big-bottle.webp"
              alt="Tiana Luxora Signature Perfume Bottle"
              className="w-full h-auto max-h-full object-contain transition-transform duration-300 drop-shadow-[0_20px_45px_rgba(131,37,78,0.15)]"
            />
          </div>
        )}
      </div>

      <div className="flex justify-center lg:justify-end order-3 lg:order-0 max-lg:hidden">
        <div className="max-w-[320px] flex flex-col gap-4 md:gap-6 items-center lg:items-start">
          <h2 className="text-[1.6rem] md:text-[2rem] leading-[1.2] font-serif font-bold text-primary">
            Discover Signature Fragrances at Your Fingertips
          </h2>
          <p className="text-[0.9rem] md:text-[0.95rem] text-primary font-medium">
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
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
