import { useGoogleLogin } from '@react-oauth/google';
import React, { useState, useEffect } from "react";
import candle from "../assets/candle.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import backendApi from '../api/backendApi';
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // google button handler
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await backendApi.post("/auth/google", {
          access_token: tokenResponse.access_token,
        });

        const userData = { user: res.data.user, token: res.data.token };
        dispatch(login(userData));
        localStorage.setItem("token", res.data.token);
        toast.success(res.data.message || "Logged in with Google");
        navigate("/");
      } catch (error) {
        toast.error(error.response?.data?.message || "Google login failed");
      }
    },
    onError: () => toast.error("Google login failed"),
  });

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await backendApi.post("/auth/login", {
        email,
        password
      });

      const userData = {
        user: res.data.user,
        token: res.data.token
      };

      dispatch(login(userData));
      localStorage.setItem("token", res.data.token);
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    }
  };

 
  return (
    <main className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Visual Branding Side (Hidden on Mobile) */}
      <div className="hidden relative flex-1 flex-col justify-between p-12 bg-linear-to-b from-slate-100 via-slate-200 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 lg:flex select-none overflow-hidden">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          <span className="text-amber-500 dark:text-amber-400 text-2xl font-serif">◆</span>
          CryptoX
        </div>

        {/* Marketing Hook & Candlestick Simulation */}
        <div className="space-y-12 my-auto max-w-lg">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            Trade crypto with{" "}
            <span className="text-amber-500 dark:text-amber-400 bg-clip-text">confidence</span> and
            precision.
          </h1>

          <img
            src={candle}
            alt="Candlestick Chart"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Footer Meta */}
        <div className="text-xs text-slate-600 dark:text-slate-400 tracking-wide">
          © 2026 CryptoX. Trusted by 40,000+ traders.
        </div>
      </div>

      {/* Form Submission Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900/40 p-8 rounded-2xl border border-slate-200 dark:border-slate-800/80 backdrop-blur-md shadow-2xl">
          {/* Header text */}
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Log in to access your portfolio
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Stack */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-hidden focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-hidden focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <a
                href="#"
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
              >
                Forgot password?
              </a>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              className="w-full bg-linear-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold py-3 px-4 rounded-lg shadow-md shadow-amber-500/10 hover:from-amber-300 hover:to-amber-400 active:scale-[0.99] transition-all cursor-pointer text-sm"
            >
              Log In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-200 dark:border-slate-800/80"></div>
            <span className="px-3 text-xs font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase">
              OR
            </span>
            <div className="flex-1 border-t border-slate-200 dark:border-slate-800/80"></div>
          </div>

          {/* OAuth Secondary Button */}
          <button
          onClick={() => handleGoogleLogin()}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 font-medium py-3 px-4 rounded-lg active:scale-[0.99] transition-all cursor-pointer text-sm"
          >
            {/* Minimal SVG Google Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* Switch View Line */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-amber-600 dark:text-amber-400 font-medium hover:underline underline-offset-4 cursor-pointer"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
