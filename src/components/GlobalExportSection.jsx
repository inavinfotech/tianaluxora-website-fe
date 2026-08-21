import React from "react";
import { Globe, Mail, ShieldCheck, Award, PackageCheck } from "lucide-react";
import { globalExportData } from "../data/about";

const GlobalExportSection = () => {
  return (
    <section className="py-12 md:py-16 animate-fade-in bg-linear-to-b from-[#fcf5f8] to-white rounded-[24px] md:rounded-[36px] px-6 md:px-12 my-8 border border-[rgba(131,37,78,0.08)] shadow-xs relative overflow-hidden">
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-[1100px] mx-auto text-center">
        {/* Section Title Header */}
        <div className="text-accent text-[0.75rem] md:text-[0.8rem] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 mb-2">
          <Globe size={14} className="text-accent" />
          <span>{globalExportData.badge}</span>
        </div>

        <h2 className="text-[1.8rem] md:text-[2.5rem] leading-[1.15] text-primary font-serif font-bold mb-4">
          {globalExportData.title}
        </h2>

        <p className="text-[0.95rem] md:text-[1.05rem] text-[rgba(131,37,78,0.75)] max-w-[650px] mx-auto mb-10 leading-relaxed font-medium">
          {globalExportData.description}
        </p>

        {/* 5 Core B2B Trade Offerings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-10 text-left">
          {globalExportData.offerings.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-primary/10 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#f7d7c4]/40 text-primary flex items-center justify-center mb-3">
                  {idx === 0 && <PackageCheck size={18} />}
                  {idx === 1 && <Globe size={18} />}
                  {idx === 2 && <ShieldCheck size={18} />}
                  {idx === 3 && <Award size={18} />}
                  {idx === 4 && <Mail size={18} />}
                </div>
                <h4 className="font-bold text-primary text-[0.95rem] mb-1.5 font-serif">
                  {item.title}
                </h4>
                <p className="text-[0.82rem] text-[rgba(131,37,78,0.7)] leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Global Export Contact Banner */}
        <div className="bg-primary text-white p-6 md:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md text-left">
          <div>
            <h3 className="font-serif text-[1.2rem] md:text-[1.4rem] font-bold mb-1">
              Have an International Inquiry?
            </h3>
            <p className="text-[0.85rem] md:text-[0.92rem] text-white/80">
              For bulk export orders, corporate gifting, or overseas dealership partnerships:
            </p>
          </div>
          <a
            href={`mailto:${globalExportData.contactEmail}`}
            className="relative overflow-hidden group bg-[#f7c2d4] text-primary px-6 md:px-8 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-[#f4b8cc] transition-all shrink-0 cursor-pointer shadow-sm"
          >
            <Mail size={16} />
            <span>{globalExportData.contactEmail}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default GlobalExportSection;
