import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPath } from "../utils/paths";

const HERO_IMAGES = [
  {
    id: 1,
    src: "/images/hero/hero-1.webp",
    alt: "Tiana Luxora Signature Fragrance 1",
    tag: "Velvet Amber Edition",
  },
  {
    id: 2,
    src: "/images/hero/hero-2.webp",
    alt: "Tiana Luxora Signature Fragrance 2",
    tag: "Royal Rose Elixir",
  },
  {
    id: 3,
    src: "/images/hero/hero-3.webp",
    alt: "Tiana Luxora Signature Fragrance 3",
    tag: "Golden Sillage Noir",
  },
];

const HeroSection = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Smooth continuous auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col lg:grid lg:grid-cols-[1.1fr_1.2fr_0.9fr] items-center justify-center gap-6 md:gap-8 min-h-[calc(100vh-80px)] min-h-[calc(100dvh-80px)] pt-6 sm:pt-10 pb-10 lg:py-0 animate-fade-in text-center lg:text-left">
      {/* Left Column: Hero Text */}
      <div className="flex flex-col gap-4 sm:gap-6 items-center lg:items-start order-1 lg:order-0">
        <h1 className="text-[2.6rem] sm:text-[3rem] md:text-[3.5rem] leading-[1.08] text-primary font-serif font-bold tracking-tight">
          Luxury That Speaks <br />
          <span className="italic font-normal font-serif text-accent">Before You Do</span>
        </h1>

        <p className="text-[1rem] sm:text-[1.05rem] text-primary/80 font-normal max-w-[440px] leading-relaxed">
          Tiana Luxora blends rare botanicals and precious oils into unforgettable fragrances crafted for timeless presence.
        </p>

        <div className="flex flex-nowrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 pt-2 w-full max-w-full">
          <Link
            to={getPath("/shop")}
            style={{ backgroundColor: "#83254e", color: "#ffffff" }}
            className="px-5 sm:px-7 py-3.5 sm:py-4 rounded-full font-bold text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center shadow-lg hover:shadow-xl hover:opacity-95 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            Explore Fragrances
          </Link>

          <Link
            to={getPath("/story")}
            className="px-5 sm:px-7 py-3.5 sm:py-4 rounded-full font-bold text-[11px] sm:text-xs uppercase tracking-wider text-primary border border-primary/20 bg-white/60 hover:bg-white transition-all shadow-xs hover:-translate-y-0.5 active:scale-95 whitespace-nowrap shrink-0"
          >
            Brand Cinema & Story
          </Link>
        </div>

        <div className="text-[0.78rem] sm:text-[0.82rem] font-semibold uppercase tracking-[1.5px] text-primary/70 mt-2 flex items-center gap-2">
          <span>100% Authentic • Handcrafted in India</span>
        </div>
      </div>

      {/* Middle Column: Auto-changing 3-Bottle Showcase with Enhanced Transitions */}
      <div className="order-2 lg:order-0 w-full flex flex-col items-center justify-center my-2 sm:my-4 lg:my-0 relative">
        <div className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[460px] lg:max-w-[500px] h-[340px] sm:h-[420px] md:h-[480px] lg:h-[520px] relative flex justify-center items-center">
          {/* Ambient Glow Aura */}
          <div className="absolute inset-0 m-auto w-52 sm:w-72 h-52 sm:h-72 rounded-full bg-accent/15 blur-3xl pointer-events-none -z-10 transition-all duration-1000" />

          {/* Render all 3 images with luxury crossfade and floating scale transition */}
          {HERO_IMAGES.map((item, idx) => {
            const isActive = idx === currentIdx;
            return (
              <img
                key={item.id}
                src={item.src}
                alt={item.alt}
                className={`absolute inset-0 m-auto w-full h-auto max-h-full object-contain transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] drop-shadow-[0_25px_50px_rgba(131,37,78,0.22)] ${
                  isActive
                    ? "opacity-100 scale-100 translate-y-0 blur-none z-10"
                    : "opacity-0 scale-92 translate-y-4 blur-[2px] pointer-events-none z-0"
                }`}
              />
            );
          })}
        </div>

        {/* Minimalist Dots Indicator (Auto-changing active pill + soft circular dots) */}
        <div className="flex items-center gap-2 mt-4 z-20" aria-label="Slide indicators">
          {HERO_IMAGES.map((item, idx) => {
            const isActive = idx === currentIdx;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Go to fragrance ${idx + 1}`}
                className={`transition-all duration-500 rounded-full cursor-pointer p-0 border-0 outline-none ${
                  isActive
                    ? "w-7 h-2 bg-[#83254e] shadow-xs"
                    : "w-2 h-2 bg-[#83254e]/25 hover:bg-[#83254e]/50"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Right Column: Spotlight Card */}
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
            <div className="w-14 h-14 rounded-xl bg-[#faf6f4] flex justify-center items-center overflow-hidden border border-primary/10 shrink-0 p-1">
              <img
                src={HERO_IMAGES[currentIdx].src}
                alt={HERO_IMAGES[currentIdx].alt}
                className="w-full h-full object-contain transition-all duration-700"
              />
            </div>
            <div>
              <span className="text-xs font-serif font-bold text-primary block line-clamp-1">
                {HERO_IMAGES[currentIdx].tag}
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

