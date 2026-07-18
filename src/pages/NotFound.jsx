import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="relative mx-auto mb-8 h-28 w-28">
          <div className="absolute inset-0 rounded-full bg-amber-100 dark:bg-amber-500/10 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-14 w-14 text-amber-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
              <line x1="2" y1="2" x2="22" y2="22" />
            </svg>
          </div>
        </div>

        <p className="text-sm font-medium text-amber-600 dark:text-amber-400 tracking-wide">
          Market not found
        </p>
        <h1 className="mt-2 text-6xl font-bold text-slate-900 dark:text-white">404</h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400">
          This page went offline or never existed. Check the address, or head
          back to your dashboard.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Back to dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
