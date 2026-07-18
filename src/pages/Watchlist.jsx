import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import CoinTable from '../components/market/CoinTable';

export default function Watchlist() {
  const watchlist = useSelector((state) => state.watchlist.coins);
  const [activeTab, setActiveTab] = useState('All');

  const filteredWatchlist = useMemo(() => {
    switch (activeTab) {
      case 'Gainers':
        return watchlist.filter((c) => (c.price_change_percentage_24h ?? 0) > 0);
      case 'Losers':
        return watchlist.filter((c) => (c.price_change_percentage_24h ?? 0) < 0);
      default:
        return watchlist;
    }
  }, [watchlist, activeTab]);

  return (
    <div className="space-y-5 p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans min-h-screen">
      {watchlist.length > 0 ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Gainers', 'Losers'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button className="self-start sm:self-auto bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs font-semibold rounded-md hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5">
              Sort: Market Cap <span className="text-[10px] text-slate-500">▼</span>
            </button>
          </div>

          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto w-full">
              {filteredWatchlist.length > 0 ? (
                <CoinTable coins={filteredWatchlist} />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500 text-sm text-center px-4">
                  No {activeTab.toLowerCase()} in your watchlist right now.
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-100 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl bg-slate-100/50 dark:bg-slate-900/20 text-center px-4">
          <h1 className="text-xl font-semibold text-slate-600 dark:text-slate-400">Your watchlist is empty</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Star assets from the markets tab to keep track of them here.</p>
        </div>
      )}
    </div>
  );
}
