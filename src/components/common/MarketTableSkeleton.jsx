import React from 'react';

export default function MarketTableSkeleton({ rowCount = 6 }) {
  return (
    <div className="w-full bg-slate-100 dark:bg-[#121829] rounded-lg p-4 font-sans overflow-x-auto">
      <style>{`
        @keyframes shimmerSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer-sweep {
          animation: shimmerSweep 1.5s infinite linear;
        }
      `}</style>

      <div className="min-w-175">
        {/* Table Header Row */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center px-5 py-4 text-[11px] font-bold tracking-wider text-slate-400 dark:text-[#68728a] border-b border-slate-200 dark:border-[#1e2640] opacity-60">
          <div>COIN</div>
          <div>PRICE</div>
          <div>24H %</div>
          <div>MARKET CAP</div>
          <div>VOLUME (24H)</div>
          <div>LAST 7 DAYS</div>
          <div className="text-right">ACTION</div>
        </div>

        {/* Animated Content Rows Loop */}
        {Array(rowCount).fill(0).map((_, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center px-5 py-5 border-b border-slate-100 dark:border-[#161e35]"
          >
            <div className="flex items-center gap-3">
              <div className="relative overflow-hidden bg-slate-200 dark:bg-[#1e2640] w-3.5 h-3.5 [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]">
                <div className="absolute inset-0 animate-shimmer-sweep bg-linear-to-r from-transparent via-white/40 dark:via-[#2a3554]/40 to-transparent" />
              </div>
              <div className="relative overflow-hidden bg-slate-200 dark:bg-[#1e2640] w-8 h-8 rounded-full">
                <div className="absolute inset-0 animate-shimmer-sweep bg-linear-to-r from-transparent via-white/40 dark:via-[#2a3554]/40 to-transparent" />
              </div>
              <div className="flex flex-col gap-1.5 w-16">
                <div className="relative overflow-hidden bg-slate-200 dark:bg-[#1e2640] h-3 w-full rounded">
                  <div className="absolute inset-0 animate-shimmer-sweep bg-linear-to-r from-transparent via-white/40 dark:via-[#2a3554]/40 to-transparent" />
                </div>
                <div className="relative overflow-hidden bg-slate-200 dark:bg-[#1e2640] h-2 w-3/5 rounded">
                  <div className="absolute inset-0 animate-shimmer-sweep bg-linear-to-r from-transparent via-white/40 dark:via-[#2a3554]/40 to-transparent" />
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-slate-200 dark:bg-[#1e2640] h-3.5 w-14 rounded">
              <div className="absolute inset-0 animate-shimmer-sweep bg-linear-to-r from-transparent via-white/40 dark:via-[#2a3554]/40 to-transparent" />
            </div>

            <div className="relative overflow-hidden bg-slate-200 dark:bg-[#1e2640] h-4.5 w-12 rounded-md">
              <div className="absolute inset-0 animate-shimmer-sweep bg-linear-to-r from-transparent via-white/40 dark:via-[#2a3554]/40 to-transparent" />
            </div>

            <div className="relative overflow-hidden bg-slate-200 dark:bg-[#1e2640] h-3.5 w-16 rounded">
              <div className="absolute inset-0 animate-shimmer-sweep bg-linear-to-r from-transparent via-white/40 dark:via-[#2a3554]/40 to-transparent" />
            </div>

            <div className="relative overflow-hidden bg-slate-200 dark:bg-[#1e2640] h-3.5 w-16 rounded">
              <div className="absolute inset-0 animate-shimmer-sweep bg-linear-to-r from-transparent via-white/40 dark:via-[#2a3554]/40 to-transparent" />
            </div>

            <div className="relative overflow-hidden bg-slate-200 dark:bg-[#1e2640] h-6 w-17.5 rounded-sm">
              <div className="absolute inset-0 animate-shimmer-sweep bg-linear-to-r from-transparent via-white/40 dark:via-[#2a3554]/40 to-transparent" />
            </div>

            <div className="flex justify-end">
              <div className="relative overflow-hidden bg-slate-200 dark:bg-[#1e2640] h-8 w-17.5 rounded-md">
                <div className="absolute inset-0 animate-shimmer-sweep bg-linear-to-r from-transparent via-white/40 dark:via-[#2a3554]/40 to-transparent" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
