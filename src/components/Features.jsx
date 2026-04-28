import React from "react";
import { features } from "../data/features";

const Features = () => {
  return (
    <section className="py-6 md:py-10 animate-fade-in">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-[1.8rem] md:text-[2.2rem] mb-2 text-primary font-serif font-bold">
          Why Choose Tiana Luxora<sup>TM</sup>
        </h2>
        <p className="text-[0.9rem] md:text-[1rem] text-[rgba(90,50,50,0.7)] max-w-[500px] mx-auto">
          Crafted with precision, designed for a luxurious experience
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-white/30 backdrop-blur-sm rounded-[20px] p-6 flex flex-col items-center gap-4 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.03)] text-center transition-custom hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-full bg-[#f7d7c4]/30 flex justify-center items-center scale-90">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-[1.1rem] font-serif font-bold mb-2">
                {feature.title}
              </h3>
              <p className="text-[0.9rem] text-[rgba(90,50,50,0.7)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
