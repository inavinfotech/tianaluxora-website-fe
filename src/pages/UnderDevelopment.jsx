import React from "react";

function UnderDevelopment() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 py-8 md:p-8 overflow-x-hidden bg-gray-950 text-white">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-pink-500/10 rounded-full blur-[100px] animate-bounce"
        style={{ animationDuration: "8s" }}
      ></div>
      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-4xl text-center">
        {/* Logo/Brand Name */}
        <div className="mb-8 md:mb-12">
          <img
            src="/images/company-logo.webp"
            alt="Tiana Luxora Logo"
            className="h-14 md:h-20 w-auto mx-auto object-contain hover:scale-105 transition-transform duration-500"
          />
          <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 md:mt-6 rounded-full opacity-50"></div>
        </div>
        {/* Glass Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-16 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative group overflow-hidden transition-all duration-500 hover:border-white/20 mx-2 md:mx-0">
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6 tracking-tight text-white leading-tight">
              Crafting Something <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                Luxurious
              </span>
            </h1>
            <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto mb-0 font-light leading-relaxed">
              We're currently building a premium digital experience for Tiana
              Luxora. Our new site is under development and will be launching
              soon.
            </p>
          </div>
        </div>
        {/* Footer/Socials */}
        <div className="mt-10 md:mt-16 text-gray-400">
          <p className="text-xs md:text-sm font-light tracking-widest uppercase mb-4 md:mb-6">
            Connect with us
          </p>
          <div className="flex justify-center gap-6 md:gap-8">
            {["Instagram", "Twitter", "LinkedIn"].map((social) => (
              <a
                key={social}
                href="#"
                className="hover:text-blue-400 transition-colors duration-300 text-xs md:text-sm font-medium tracking-wide"
              >
                {social}
              </a>
            ))}
          </div>
          <p className="mt-8 md:mt-12 text-[10px] md:text-xs text-gray-600 font-light">
            &copy; 2026 Tiana Luxora. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default UnderDevelopment;
