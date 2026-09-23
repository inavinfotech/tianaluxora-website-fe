import React from "react";

const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  shine = true,
  ...props
}) => {
  const baseStyles =
    "relative overflow-hidden group px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]";
  
  const variants = {
    primary:
      "bg-[#f7c2d4] hover:bg-[#f4b8cc] text-[#83254e] border border-white/60 shadow-[0_8px_20px_rgba(217,115,152,0.3)] hover:shadow-[0_12px_28px_rgba(217,115,152,0.4)]",
    secondary:
      "bg-[#83254e] hover:bg-[#6c1d3f] text-white border border-[#83254e] shadow-[0_8px_20px_rgba(131,37,78,0.35)] hover:shadow-[0_12px_28px_rgba(131,37,78,0.45)]",
    outline:
      "bg-transparent border-2 border-[#83254e] text-[#83254e] hover:bg-[#83254e] hover:text-white shadow-xs",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {shine && (
        <span className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none animate-btn-shine" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};

export default Button;
