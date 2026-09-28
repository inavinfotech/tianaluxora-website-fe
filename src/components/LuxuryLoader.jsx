import React from "react";

const LuxuryLoader = ({
  fullscreen = true,
  message = "Luxury That Speaks Before You Do",
  subtext = "Loading experience...",
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-6 text-center select-none animate-fade-in px-4">
      {/* Brand Monogram Emblem with Luxury Pulse Glow */}
      <div className="relative flex items-center justify-center">
        {/* Soft Ambient Radiance */}
        <div className="absolute w-24 h-24 rounded-full bg-accent/20 blur-xl animate-pulse" />
        
        {/* Outer Rotating / Shimmering Ring */}
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-primary/30 animate-[spin_10s_linear_infinite] flex items-center justify-center p-1" />

        {/* Inner Solid Badge */}
        <div className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center shadow-[0_8px_25px_rgba(131,37,78,0.25)] border border-white/60">
          <span className="font-serif font-bold text-xl sm:text-2xl tracking-tighter drop-shadow-xs">
            TL
          </span>
        </div>
      </div>

      {/* Brand Title */}
      <div className="flex flex-col items-center gap-1.5">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.22em] sm:tracking-[0.28em] text-primary uppercase ml-1">
          Tiana Luxora
        </h1>
        <p className="text-[0.72rem] sm:text-[0.8rem] uppercase tracking-[0.2em] text-primary/70 font-semibold italic">
          {message}
        </p>
      </div>

      {/* Slender Luxury Progress Bar */}
      <div className="w-44 sm:w-56 h-[3px] bg-primary/10 rounded-full overflow-hidden relative shadow-inner mt-1">
        <div className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-accent via-primary to-accent rounded-full animate-[slideRight_1.4s_cubic-bezier(0.4,0,0.2,1)_infinite]" />
      </div>

      {subtext && (
        <span className="text-[0.68rem] tracking-[0.15em] text-primary/50 uppercase font-medium">
          {subtext}
        </span>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(ellipse at center, #fff5f8 0%, #fae6ee 60%, #f4d4e2 100%)",
        }}
        role="status"
        aria-label="Loading Tiana Luxora"
      >
        {content}
      </div>
    );
  }

  return (
    <div className="w-full min-h-[60dvh] flex items-center justify-center py-12">
      {content}
    </div>
  );
};

export default LuxuryLoader;
