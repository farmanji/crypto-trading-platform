import React, { useState } from 'react';
import candle from "../assets/candle.jpg";
import { Link } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // TODO: wire up to a real signup flow once the backend exists (see authSlice/login for the pattern Login.jsx already uses)
    console.log('Registering user with:', formData);
  };

 
 

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      
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
            Your gateway to <span className="text-amber-500 dark:text-amber-400 bg-clip-text">100+ coins,</span> zero complexity.
          </h1>
          
          {/* Ghost Candles Chart */}
          <img
                     src={candle}
                     alt="Candlestick Chart"
                     className="w-full h-auto rounded-lg"
                   />
        </div>

        {/* Footer Security Highlights */}
        <div className="text-xs text-slate-400 dark:text-slate-500 tracking-wide flex items-center gap-2 divide-x divide-slate-300 dark:divide-slate-800">
          <span>Bank-grade security</span>
          <span className="pl-2">KYC verified</span>
          <span className="pl-2">24/7 support</span>
        </div>
      </div>

      {/* Form Submission Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900/40 p-8 rounded-2xl border border-slate-200 dark:border-slate-800/80 backdrop-blur-md shadow-2xl">
          
          {/* Header text */}
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Create your account</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Start trading in under 2 minutes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Stack */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Full name
                </label>
                <input 
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Rahul Sharma" 
                  className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-hidden focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email address
                </label>
                <input 
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com" 
                  className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-hidden focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Password
                </label>
                <input 
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters" 
                  className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-hidden focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Confirm password
                </label>
                <input 
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password" 
                  className="w-full bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-hidden focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start gap-3">
              <input 
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                required
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-amber-500 focus:ring-0 accent-amber-500 cursor-pointer"
              />
              <label htmlFor="agreeToTerms" className="text-xs text-slate-500 dark:text-slate-400 leading-normal cursor-pointer select-none">
                I agree to the{' '}
                <a href="#" className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer">Terms of Service</a>
                {' '}&amp;{' '}
                <a href="#" className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer">Privacy Policy</a>
              </label>
            </div>

            
            <button 
              type="submit"
              className="w-full bg-linear-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold py-3 px-4 rounded-lg shadow-md shadow-amber-500/10 hover:from-amber-300 hover:to-amber-400 active:scale-[0.99] transition-all cursor-pointer text-sm"
            >
              Create Account
            </button>
          </form>

       
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to='/login' className="text-amber-600 dark:text-amber-400 font-medium hover:underline underline-offset-4 cursor-pointer">
              Log in
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}
