import React from "react";

const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  ...props
}) => {
  const baseStyles =
    "px-6 py-3 rounded-full font-medium transition-custom flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-[#f7d7c4] text-primary hover:bg-[#f5ccb5]",
    secondary:
      "bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
