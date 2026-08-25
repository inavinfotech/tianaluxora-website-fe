import React, { useState, useEffect, useRef } from "react";
import Button from "./utils/Button";

import { aboutContent } from "../data/about";

const AboutPurpose = () => {
  const [activePillar, setActivePillar] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const totalPillars = aboutContent.pillars.length;

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActivePillar((prev) => (prev + 1) % totalPillars);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused, totalPillars]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e) => {
    setIsPaused(false);
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setActivePillar((prev) => (prev + 1) % totalPillars);
      } else {
        setActivePillar((prev) => (prev - 1 + totalPillars) % totalPillars);
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="py-12 lg:py-16 min-h-0 animate-fade-in bg-cover bg-center rounded-[24px] md:rounded-[40px] px-4 md:px-8 mb-8 md:mb-12 overflow-hidden relative"
      style={{ backgroundImage: `url('${aboutContent.backgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[3px]"></div>
      
      <div className="max-w-[1150px] mx-auto relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-10 text-center lg:text-left mb-10">
          <div className="relative group w-full max-w-[480px] mx-auto lg:mx-0">
            <div className="rounded-[25px] md:rounded-[30px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] aspect-square relative">
              <img
                src={aboutContent.image}
                alt={aboutContent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10 transition-custom group-hover:bg-black/0"></div>
            </div>
            
            {/* Founder Quote Overlay Card */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-lg text-left">
              <p className="text-[0.82rem] italic font-serif text-primary font-medium">
                "{aboutContent.founder.quote}"
              </p>
              <p className="text-[0.72rem] font-bold text-accent uppercase tracking-wider mt-1">
                — {aboutContent.founder.name}, {aboutContent.founder.role}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:gap-5 items-center lg:items-start pt-6 lg:pt-0">
            <span className="text-accent text-[0.75rem] md:text-[0.8rem] font-bold uppercase tracking-widest">
              {aboutContent.label}
            </span>
            <h2 className="text-[1.8rem] md:text-[2.4rem] leading-[1.1] text-primary font-serif font-bold">
              {aboutContent.title}
            </h2>
            <p className="text-[0.88rem] md:text-[0.98rem] text-primary font-semibold italic">
              {aboutContent.tagline}
            </p>
            <p className="text-[0.92rem] md:text-[0.98rem] text-[rgba(131,37,78,0.75)] leading-relaxed">
              {aboutContent.fullStory}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              {aboutContent.buttons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant}
                  className={
                    button.variant === "secondary" ? "bg-primary! text-white! shadow-sm" : ""
                  }
                >
                  {button.text}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Core Brand Pillars - Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 md:gap-6 mt-8 border-t border-primary/10 pt-8">
          {aboutContent.pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-xs text-left"
            >
              <h3 className="text-[1.1rem] font-serif font-bold text-primary mb-1">
                {pillar.title}
              </h3>
              <p className="text-[0.84rem] text-[rgba(131,37,78,0.75)] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* 3 Core Brand Pillars - Mobile Auto-Changing Carousel */}
        <div
          className="block md:hidden mt-8 border-t border-primary/10 pt-6"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activePillar * 100}%)` }}
            >
              {aboutContent.pillars.map((pillar, idx) => (
                <div key={idx} className="w-full shrink-0 px-1">
                  <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-xs text-center min-h-[130px] flex flex-col justify-center">
                    <h3 className="text-[1.15rem] font-serif font-bold text-primary mb-1.5">
                      {pillar.title}
                    </h3>
                    <p className="text-[0.86rem] text-[rgba(131,37,78,0.8)] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {aboutContent.pillars.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActivePillar(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activePillar === idx
                    ? "w-7 bg-primary"
                    : "w-2 bg-primary/25 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPurpose;
