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
    "relative overflow-hidden group px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-white/40";
  const variants = {
    primary: "bg-[#f7d7c4] text-primary hover:bg-[#f5ccb5]",
    secondary:
      "bg-primary text-white hover:bg-[#4a2828]",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {shine && (
        <span className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none animate-btn-shine" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};

export default Button;
