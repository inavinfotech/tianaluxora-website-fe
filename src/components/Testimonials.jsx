import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { testimonials } from "../data/testimonials";

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = testimonials.length;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, activeIndex]);

  const current = testimonials[activeIndex];

  return (
    <section
      className="py-12 md:py-16 animate-fade-in bg-cover bg-center -mx-4 md:-mx-8 px-4 md:px-8 relative overflow-hidden"
      style={{ backgroundImage: "url('/images/backgrounds/testimonial.webp')" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-[1.8rem] md:text-[2.4rem] mb-2 text-primary font-serif font-bold tracking-tight">
          What Our Customers Say
        </h2>
        <p className="text-[0.95rem] md:text-[1.05rem] text-[rgba(90,50,50,0.75)] max-w-[500px] mx-auto font-medium">
          Real experiences from those who love Tiana Luxora
        </p>
      </div>

      {/* Carousel Container */}
      <div className="max-w-[750px] mx-auto relative px-10 md:px-14">
        {/* Left Arrow Button */}
        <button
          onClick={prevSlide}
          aria-label="Previous Testimonial"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/70 backdrop-blur-md text-primary flex justify-center items-center shadow-md hover:bg-white hover:scale-110 transition-all z-10 cursor-pointer border border-white/40"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Testimonial Slide Card */}
        <div className="bg-white/65 backdrop-blur-lg rounded-[24px] p-8 md:p-10 border border-white/40 shadow-[0_15px_35px_rgba(90,50,50,0.08)] text-center relative transition-all duration-500 min-h-[220px] flex flex-col justify-between items-center">
          <Quote className="absolute top-4 left-6 text-primary/10 w-12 h-12 pointer-events-none" />

          {/* Star Rating */}
          <div className="flex gap-1.5 text-[#fbbd23] mb-4">
            {[...Array(current.rating || 5)].map((_, i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
          </div>

          {/* Quote Text */}
          <p className="text-[1.05rem] md:text-[1.2rem] italic text-primary leading-relaxed max-w-[580px] font-serif my-auto">
            "{current.quote}"
          </p>

          {/* Author Meta */}
          <div className="flex items-center gap-3 mt-6">
            <div className="w-11 h-11 rounded-full bg-[#5a3232]/10 text-[#5a3232] font-bold text-sm flex justify-center items-center border border-white/40 shadow-xs">
              {current.name[0]}
            </div>
            <div className="text-left">
              <h4 className="font-bold text-[0.95rem] md:text-[1rem] text-primary">
                {current.name}
              </h4>
              <p className="text-[0.75rem] text-[rgba(90,50,50,0.6)] font-semibold uppercase tracking-wider">
                {current.role || "Verified Buyer"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={nextSlide}
          aria-label="Next Testimonial"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/70 backdrop-blur-md text-primary flex justify-center items-center shadow-md hover:bg-white hover:scale-110 transition-all z-10 cursor-pointer border border-white/40"
        >
          <ChevronRight size={20} />
        </button>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? "w-8 bg-[#5a3232]"
                  : "w-2.5 bg-[#5a3232]/30 hover:bg-[#5a3232]/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
