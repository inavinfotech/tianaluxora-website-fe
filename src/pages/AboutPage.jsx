import React from "react";
import Footer from "../components/Footer";
import GlobalExportSection from "../components/GlobalExportSection";
import { aboutContent } from "../data/about";
import { CheckCircle2, Heart, Award, Sparkles } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="animate-fade-in pb-10">
      <div className="max-w-[1200px] mx-auto space-y-16 mt-8 px-4">
        {/* Page Header */}
        <div className="text-center">
          <span className="text-accent text-xs font-bold uppercase tracking-widest block mb-1">
            {aboutContent.label}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-primary font-bold tracking-tight mt-1">
            {aboutContent.title}
          </h1>
          <p className="text-primary font-medium italic text-lg mt-2 max-w-xl mx-auto">
            "{aboutContent.tagline}"
          </p>
          <div className="w-24 h-1 bg-accent mx-auto mt-4 rounded-full opacity-50"></div>
        </div>

        {/* Founder Spotlight Card */}
        <div id="founder" className="bg-linear-to-r from-[#5a3232] to-[#4a2828] text-white p-8 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl -z-10" />
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <span className="text-[#f7d7c4] text-xs font-bold uppercase tracking-widest block">
                FOUNDER SPOTLIGHT
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold">
                {aboutContent.founder.name}
              </h2>
              <p className="text-accent font-medium text-sm">
                {aboutContent.founder.role}
              </p>
              <blockquote className="text-lg italic font-serif border-l-2 border-accent pl-4 text-white/90">
                "{aboutContent.founder.quote}"
              </blockquote>
              <p className="text-white/80 leading-relaxed font-light text-sm md:text-base">
                {aboutContent.founder.bio}
              </p>
            </div>
            <div className="lg:col-span-1 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-[#f7d7c4] mx-auto" />
              <h3 className="font-serif font-bold text-lg text-white">Our Vision</h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Combining global luxury standards with empowerment-driven values to promote Made in India manufacturing and Viksit Bharat.
              </p>
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <div id="empowerment" className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white/40 rounded-[2rem] overflow-hidden border border-accent/10 shadow-xl shadow-accent/5 transition-all hover:shadow-2xl hover:shadow-accent/10 group">
          <div className="h-[320px] md:h-auto overflow-hidden">
            <img
              src="/images/about/story.png"
              alt="Woman spraying perfume"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <h2 className="font-serif text-3xl text-primary font-bold mb-4 relative inline-block">
              Our Mission
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-accent"></span>
            </h2>
            <p className="text-primary/80 leading-relaxed text-base md:text-lg font-light mb-6">
              {aboutContent.description}
            </p>
            <div className="space-y-2.5">
              <h4 className="font-bold text-primary text-sm uppercase tracking-wider">
                When You Choose Tiana Luxora™:
              </h4>
              {aboutContent.commitments.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs md:text-sm text-primary/80 font-medium">
                  <CheckCircle2 size={16} className="text-accent shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Export Section */}
        <GlobalExportSection />
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
