import React from "react";

import { testimonials } from "../data/testimonials";

const Testimonials = () => {
  return (
    <section className="py-12 md:py-16 animate-fade-in bg-cover bg-center -mx-4 md:-mx-8 px-4 md:px-8" style={{ backgroundImage: "url('/images/backgrounds/testimonial.webp')" }}>
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-[1.8rem] md:text-[2.2rem] mb-2 text-primary font-serif font-bold">What Our Customers Say</h2>
        <p className="text-[0.95rem] md:text-[1rem] text-[rgba(61,26,26,0.7)] max-w-[500px] mx-auto">
          Real experiences from those who love Tiana Luxora
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-[1200px] mx-auto">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white/40 backdrop-blur-md rounded-[20px] p-6 md:p-8 flex flex-col items-center gap-4 md:gap-6 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.03)] text-center transition-custom hover:-translate-y-1"
          >
            <div className="flex gap-1 text-[#fbbd23]">
              {[...Array(testimonial.rating)].map((_, i) => (
                <svg key={i} width="18" height="18" md:width="20" md:height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <p className="text-[1rem] md:text-[1.1rem] italic text-primary leading-relaxed">
               "{testimonial.quote}"
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[rgba(61,26,26,0.1)] flex justify-center items-center overflow-hidden">
                 <div className="w-full h-full bg-[#d1d5db]"></div>
              </div>
              <span className="font-medium text-[0.95rem] md:text-[1rem] text-primary">{testimonial.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
