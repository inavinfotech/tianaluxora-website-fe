import React from "react";
import Button from "./utils/Button";
import { aboutContent } from "../data/about";
import { getPath } from "../utils/paths";
import { Link } from "react-router-dom";

const AboutPurpose = () => {
  return (
    <section
      className="w-full py-12 lg:py-20 min-h-0 animate-fade-in bg-cover bg-center border-y border-[rgba(131,37,78,0.08)] relative overflow-hidden"
      style={{ backgroundImage: `url('${aboutContent.backgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[3px]"></div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-8 lg:gap-12 text-center lg:text-left">
          {/* Image */}
          <div className="relative group w-full max-w-[320px] sm:max-w-[360px] md:max-w-[400px] mx-auto lg:mx-0">
            <div className="rounded-[22px] md:rounded-[28px] overflow-hidden shadow-[0_15px_40px_rgba(131,37,78,0.12)] aspect-square relative border border-white/60">
              <img
                src={aboutContent.image}
                alt={aboutContent.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/5 transition-opacity group-hover:opacity-0"></div>
            </div>
          </div>

          {/* Text Content */}
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
            <p className="text-[0.92rem] md:text-[0.98rem] text-primary font-medium leading-relaxed">
              {aboutContent.fullStory}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              <Link to={getPath("/shop")}>
                <Button variant="primary">
                  {aboutContent.buttons[0].text}
                </Button>
              </Link>
              <Link to={getPath("/about")}>
                <Button variant="secondary" className="bg-primary! text-white! shadow-sm">
                  {aboutContent.buttons[1].text}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPurpose;
