import { Link } from "react-router-dom";
import PerfumeModel from "./PerfumeModel";

const HeroSection = () => {
  // Control 3D Model visibility via .env variable
  const is3dactive = import.meta.env.VITE_ENABLE_3D_MODEL === "true";

  return (
    <section className="flex flex-col lg:grid lg:grid-cols-[1fr_1.2fr_1fr] items-center gap-8 lg:gap-8 min-h-[60vh] animate-fade-in text-center lg:text-left py-8 lg:py-0">
      <div className="flex flex-col gap-6 md:gap-8 items-center lg:items-start order-1 lg:order-0">
        <h1 className="text-[2.2rem] md:text-[3rem] leading-[1.1] text-primary mb-2 md:mb-4 font-serif font-bold">
          Luxury That Speaks Before You Do
        </h1>
        <p className="text-[1rem] md:text-[1.1rem] text-[rgba(90,50,50,0.8)] max-w-[400px]">
          Tiana Luxora<sup>TM</sup> blends rare notes into{" "}
          <br className="hidden md:block" /> unforgettable fragrances
          <br className="hidden md:block" />
          made for modern elegance.
        </p>
        <Link
          to="/collections"
          className="bg-[#f7d7c4] text-primary px-8 md:px-10 py-4 md:py-5 rounded-[50px] font-medium text-[1rem] md:text-[1.1rem] flex items-center gap-[0.8rem] w-fit shadow-[0_10px_30px_rgba(212,140,106,0.2)] transition-custom hover:-translate-y-[5px] hover:shadow-[0_15px_40px_rgba(212,140,106,0.3)] hover:bg-[#f5ccb5]"
        >
          Explore Collection <span>→</span>
        </Link>
        <div className="text-[0.75rem] md:text-[0.9rem] font-medium uppercase tracking-[1px] mt-2 md:mt-4">
          100% Authentic — Guaranteed Luxury
        </div>
      </div>

      <div className="order-2 lg:order-0 w-full">
        {is3dactive ? (
          <div className="h-[450px] md:h-[500px] lg:h-[600px] relative flex justify-center items-center">
            <PerfumeModel />
          </div>
        ) : (
          <div className="h-[300px] md:h-[400px] lg:h-[500px] relative flex justify-center items-center">
            <img
              src="/images/big-bottle.webp"
              alt="Miniature Perfume Bottle"
              className="w-full h-full object-contain transition-transform"
            />
          </div>
        )}
      </div>

      <div className="flex justify-center lg:justify-end order-3 lg:order-0 max-lg:hidden">
        <div className="max-w-[320px] flex flex-col gap-4 md:gap-6 items-center lg:items-start">
          <h2 className="text-[1.6rem] md:text-[2rem] leading-[1.2] font-serif font-bold">
            Discover Signature Fragrances at Your Fingertips
          </h2>
          <p className="text-[0.9rem] md:text-[0.95rem] text-[rgba(90,50,50,0.7)]">
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
            <a
              href="#"
              className="font-semibold flex items-center gap-2 hover:text-accent transition-custom"
            >
              Shop Now <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
