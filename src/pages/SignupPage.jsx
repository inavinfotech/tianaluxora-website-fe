import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getPath } from "../utils/paths";

const SignupPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useAuth();

  const from = location.state?.from || getPath("/");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signup(email, password, fullName);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.06)] animate-fade-in">
        <h2 className="text-3xl font-serif font-bold mb-2 text-center text-primary">
          Create Account
        </h2>
        <p className="text-sm text-center mb-6 text-primary/70">
          Join Tiana Luxora<sup>TM</sup>'s exclusive world
        </p>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center shadow-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-primary/70 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/80 border border-neutral-200 text-primary placeholder-primary/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm shadow-xs"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-primary/70 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/80 border border-neutral-200 text-primary placeholder-primary/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm shadow-xs"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-primary/70 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/80 border border-neutral-200 text-primary placeholder-primary/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm shadow-xs"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "#5a3232", color: "#ffffff" }}
            className="w-full py-3.5 px-4 font-bold uppercase tracking-widest text-xs rounded-xl hover:opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-primary/60">
          Already have an account?{" "}
          <Link
            to={getPath("/login")}
            state={{ from }}
            className="text-accent font-bold hover:underline ml-1"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
