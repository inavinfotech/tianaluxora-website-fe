import React from "react";

const UnderMaintenance = () => {
  return (
    <div className="fixed inset-0 z-9999 bg-[#fff5f0] flex items-center justify-center overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)] blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)] blur-[120px]"></div>
      </div>

      <div className="max-w-2xl px-8 text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-serif text-primary mb-6 tracking-tight">
          Tiana Luxora<sup>&reg;</sup>
        </h1>

        <div className="w-20 h-px bg-accent mx-auto mb-10"></div>

        <h2 className="text-2xl md:text-3xl font-serif text-primary mb-4">
          Refining Perfection
        </h2>

        <p className="text-primary opacity-80 text-lg md:text-xl font-sans mb-12 leading-relaxed">
          Our digital sanctuary is currently undergoing a curated
          transformation. We are meticulously crafting an experience as
          exquisite as our collections.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="px-8 py-3 border border-primary/20 rounded-full text-xs uppercase tracking-widest font-sans text-primary/60">
            Coming Soon 2026
          </div>
          <a
            href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`}
            className="text-primary hover:text-accent font-sans text-sm uppercase tracking-widest transition-colors duration-300 flex items-center gap-2"
          >
            Enquiries
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.5 1.5L1.5 13.5M13.5 1.5V12M13.5 1.5H3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div className="mt-20 flex items-center justify-center gap-8 opacity-40">
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans">
            Elegance
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans">
            Craftsmanship
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans">
            Luxury
          </span>
        </div>
      </div>

      {/* Subtle Animation Styles */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default UnderMaintenance;
