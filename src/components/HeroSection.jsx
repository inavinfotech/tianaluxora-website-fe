import { Link } from "react-router-dom";
import PerfumeModel from "./PerfumeModel";
import { getPath } from "../utils/paths";

const HeroSection = () => {
  // 3D Model disabled to ensure fast 60FPS page rendering
  const is3dactive = false;

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col lg:grid lg:grid-cols-[1.1fr_1.2fr_0.9fr] items-center justify-center gap-6 md:gap-8 min-h-[calc(100vh-80px)] min-h-[calc(100dvh-80px)] pt-6 sm:pt-10 pb-10 lg:py-0 animate-fade-in text-center lg:text-left">
      <div className="flex flex-col gap-4 sm:gap-6 items-center lg:items-start order-1 lg:order-0">
        {/* <div className="inline-flex items-center gap-2 bg-[#f5e4ea]/80 border border-primary/10 px-3.5 py-1 rounded-full text-[10px] sm:text-xs uppercase tracking-[0.25em] text-primary font-bold shadow-xs">
          <span>Haute Parfumerie</span>
          <span>•</span>
          <span>Artisanal Blends</span>
        </div> */}

        <h1 className="text-[2.6rem] sm:text-[3rem] md:text-[3.5rem] leading-[1.08] text-primary font-serif font-bold tracking-tight">
          Luxury That Speaks <br />
          <span className="italic font-normal font-serif text-accent">Before You Do</span>
        </h1>

        <p className="text-[1rem] sm:text-[1.05rem] text-primary/80 font-normal max-w-[440px] leading-relaxed">
          Tiana Luxora blends rare botanicals and precious oils into unforgettable fragrances crafted for timeless presence.
        </p>

        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
          <Link
            to={getPath("/collections")}
            style={{ backgroundColor: "#83254e", color: "#ffffff" }}
            className="px-8 sm:px-9 py-4 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center shadow-lg hover:shadow-xl hover:opacity-95 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
          >
            Explore Collections
          </Link>

          <Link
            to={getPath("/shop")}
            className="px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest text-primary border border-primary/20 bg-white/60 hover:bg-white transition-all shadow-xs hover:-translate-y-0.5 active:scale-95"
          >
            Shop All Perfumes
          </Link>
        </div>

        <div className="text-[0.78rem] sm:text-[0.82rem] font-semibold uppercase tracking-[1.5px] text-primary/70 mt-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>100% Authentic • Handcrafted in India</span>
        </div>
      </div>

      <div className="order-2 lg:order-0 w-full flex justify-center my-4 sm:my-6 lg:my-0">
        {is3dactive ? (
          <div className="h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] w-full relative flex justify-center items-center">
            <PerfumeModel />
          </div>
        ) : (
          <div className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[460px] lg:max-w-[500px] h-auto max-h-[48dvh] sm:max-h-[52dvh] lg:max-h-[540px] relative flex justify-center items-center">
            <img
              src="/images/big-bottle.webp"
              alt="Tiana Luxora Signature Perfume Bottle"
              className="w-full h-auto max-h-full object-contain transition-transform duration-500 hover:scale-102 drop-shadow-[0_25px_50px_rgba(131,37,78,0.18)]"
            />
          </div>
        )}
      </div>

      <div className="flex justify-center lg:justify-end order-3 lg:order-0 max-lg:hidden">
        <div className="max-w-[280px] flex flex-col gap-4 items-center lg:items-start bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-primary/10 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            Spotlight Note
          </span>
          <h2 className="text-[1.35rem] leading-[1.25] font-serif font-bold text-primary">
            Sensory Masterpieces
          </h2>
          <p className="text-xs text-primary/70 font-normal leading-relaxed">
            Indulge your senses with rich sillage, rare florals, and deep amber notes engineered for lasting aura.
          </p>

          <div className="w-full pt-2 flex items-center gap-3 border-t border-primary/10">
            <div className="w-14 h-14 rounded-xl bg-[#faf6f4] flex justify-center items-center overflow-hidden border border-primary/10 shrink-0">
              <img
                src="/images/small-bottle.webp"
                alt="Miniature Perfume Bottle"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-xs font-serif font-bold text-primary block">
                Signature Eau de Parfum
              </span>
              <Link
                to={getPath("/shop")}
                className="text-[11px] font-bold text-accent hover:text-primary transition-colors flex items-center gap-1 mt-0.5"
              >
                Discover &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default HeroSection;
