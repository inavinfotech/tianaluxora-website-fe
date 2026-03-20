import React from "react";

const UnderDevelopment = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <main className="relative z-10 text-center px-4">
        {/* Logo/Brand Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
            Tiana Luxora
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Status Message */}
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-4xl font-semibold text-white tracking-tight">
            We're Crafting Something Extraordinary
          </h2>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-lg mx-auto">
            Our digital home is currently under development. We're working hard
            to bring you a premium experience worth waiting for.
          </p>
        </div>


        {/* Socials Placeholder */}
        <div className="mt-16 flex justify-center gap-8">
          {["Twitter", "Instagram", "LinkedIn"].map((social) => (
            <a
              key={social}
              href="#"
              className="text-gray-500 hover:text-white transition-colors duration-300 text-sm font-medium uppercase tracking-widest"
            >
              {social}
            </a>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-8 w-full text-center">
        <p className="text-gray-600 text-xs tracking-[0.2em] uppercase">
          &copy; 2024 Tiana Luxora. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default UnderDevelopment;
