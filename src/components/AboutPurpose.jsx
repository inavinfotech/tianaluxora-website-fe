import React from "react";
import Button from "./utils/Button";

import { aboutContent } from "../data/about";

const AboutPurpose = () => {
  return (
    <section
      className="py-10 md:py-12 animate-fade-in bg-cover bg-center rounded-[30px] md:rounded-[40px] px-4 md:px-6 mb-12 overflow-hidden relative"
      style={{ backgroundImage: `url('${aboutContent.backgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
      <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-10 max-w-[1100px] mx-auto relative z-10 text-center lg:text-left">
        <div className="relative group w-full max-w-[500px] mx-auto lg:mx-0">
          <div className="rounded-[25px] md:rounded-[30px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] aspect-square relative">
            <img
              src={aboutContent.image}
              alt={aboutContent.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10 transition-custom group-hover:bg-black/0"></div>
          </div>
          <div className="absolute -top-5 md:-top-10 -left-5 md:-left-10 w-24 h-24 md:w-32 md:h-32 bg-accent/20 blur-2xl rounded-full -z-10 animate-pulse"></div>
          <div className="absolute -bottom-5 md:-bottom-10 -right-5 md:-right-10 w-24 h-24 md:w-32 md:h-32 bg-primary/10 blur-2xl rounded-full -z-10 animate-pulse delay-700"></div>
        </div>

        <div className="flex flex-col gap-4 md:gap-6 items-center lg:items-start">
          <span className="bg-[#f7d7c4] text-primary text-[0.7rem] md:text-[0.75rem] px-4 py-1.5 rounded-full font-bold uppercase tracking-widest w-fit">
            {aboutContent.label}
          </span>
          <h2 className="text-[1.8rem] md:text-[2.2rem] leading-[1.1] text-primary font-serif font-bold">
            {aboutContent.title}
          </h2>
          <p className="text-[0.95rem] md:text-[1rem] text-[rgba(61,26,26,0.7)] leading-relaxed">
            {aboutContent.description}
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 pt-4">
            {aboutContent.buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant}
                className={
                  button.variant === "secondary"
                    ? "bg-primary/50! text-accent! shadow-sm"
                    : ""
                }
              >
                {button.text}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPurpose;
