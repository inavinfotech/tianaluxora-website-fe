import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles, KeyRound, Eye, EyeOff, Compass } from "lucide-react";

const DevAccessGate = ({ children }) => {
  const isUnderDevelopment = import.meta.env.VITE_UNDER_DEVELOPMENT === "true";
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem("dev_access_granted") === "true";
  });

  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  // If development mode is disabled, or site is already unlocked, or user is accessing /admin, render children directly
  if (!isUnderDevelopment || isUnlocked || isAdminRoute) {
    return children;
  }

  const handleUnlock = (e) => {
    e.preventDefault();
    const cleanPasscode = passcode.trim();
    if (cleanPasscode === "admin@123" || cleanPasscode === "admin@!23") {
      sessionStorage.setItem("dev_access_granted", "true");
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] text-primary flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Light subtle ambient radial glows */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-[#f7d7c4]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#e6ceb8]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-[40px] border border-[#f3e5d8] shadow-2xl relative z-10 text-center animate-fade-in">
        {/* Company Logo at Top */}
        <div className="mb-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wider text-primary uppercase">
            TIANA LUXORA<sup className="text-xs text-accent">TM</sup>
          </h2>
          <p className="text-[9px] uppercase tracking-[0.35em] text-primary/40 font-bold mt-1">
            PARFUMS DE LUXE
          </p>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-3">
          Crafting Something Extraordinary
        </h1>
        <p className="text-xs sm:text-sm text-primary/70 leading-relaxed max-w-sm mx-auto mb-8 font-medium">
          Our website is currently undergoing enhancements. Enter your preview key below to access the live site.
        </p>

        <form onSubmit={handleUnlock} className="space-y-4 text-left">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60 block mb-1.5 ml-1">
              Preview Access Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary/40">
                <KeyRound size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Enter access key"
                autoFocus
                className={`w-full bg-neutral-50/80 border ${
                  error ? "border-rose-400 focus:ring-rose-400" : "border-neutral-200 focus:border-accent focus:ring-accent"
                } rounded-2xl pl-11 pr-11 py-3.5 text-sm text-primary placeholder-primary/30 focus:outline-none focus:ring-1 transition-all font-medium`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary/40 hover:text-primary transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-fade-in flex items-center justify-between">
              <span>⚠️ Invalid passcode. Please try again.</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2 group hover:opacity-90"
          >
            <span>Enter Preview</span>
            <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
          </button>
        </form>

        <p className="mt-8 text-[10px] text-primary/40 font-bold uppercase tracking-widest">
          Tiana Luxora™ Luxury Fragrances • Atelier Preview
        </p>
      </div>
    </div>
  );
};

export default DevAccessGate;

