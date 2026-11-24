import React, { useState } from "react";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getPath } from "../utils/paths";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  const from = location.state?.from || getPath("/");

  // Already signed in: skip this screen
  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100dvh-120px)] flex items-start sm:items-center justify-center pt-8 pb-12 px-5 sm:py-10 sm:px-6 bg-white sm:bg-[#faf6f4]/60">
      <div className="w-full max-w-md bg-white sm:p-10 sm:rounded-3xl sm:border sm:border-primary/10 sm:shadow-[0_15px_45px_rgba(131,37,78,0.08)] animate-fade-in">
        <h2 className="text-3xl font-serif font-bold mb-2 text-center text-primary">
          Welcome Back
        </h2>
        <p className="text-sm text-center mb-6 text-primary/70">
          Sign in to continue exploring Tiana Luxora<sup>TM</sup>
        </p>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center shadow-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
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
            style={{ backgroundColor: "#83254e", color: "#ffffff" }}
            className="w-full py-3.5 px-4 font-bold uppercase tracking-widest text-xs rounded-xl hover:opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-primary/60">
          Don't have an account?{" "}
          <Link
            to={getPath("/signup")}
            state={{ from }}
            className="text-accent font-bold hover:underline ml-1"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
