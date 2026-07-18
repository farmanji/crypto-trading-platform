import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from 'react-router-dom';
import { fetchCoins } from "../features/crypto/cryptoSlice";
import MarketTableSkeleton from '../components/common/MarketTableSkeleton';
import CoinTable from '../components/market/CoinTable';

const PER_PAGE = 10;

export default function Markets() {
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  const dispatch = useDispatch();

  const { coins, loading, error } = useSelector((state) => state.crypto);
  const watchlist = useSelector((state) => state.watchlist.coins);

  useEffect(() => {
    dispatch(fetchCoins());
  }, [dispatch]);

  // Reset to page 1 whenever the active filter or search term changes, so you don't land on an empty page
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const filteredCoins = useMemo(() => {
    if (!coins?.length) return [];

    let result = coins;

    switch (activeTab) {
      case 'Gainers':
        result = result.filter((c) => (c.price_change_percentage_24h ?? 0) > 0);
        break;
      case 'Losers':
        result = result.filter((c) => (c.price_change_percentage_24h ?? 0) < 0);
        break;
      case 'Favorites': {
        const favIds = new Set(watchlist.map((c) => c.id));
        result = result.filter((c) => favIds.has(c.id));
        break;
      }
      default:
        break;
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(term) || c.symbol.toLowerCase().includes(term)
      );
    }

    return result;
  }, [coins, activeTab, watchlist, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredCoins.length / PER_PAGE));

  const paginatedCoins = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredCoins.slice(start, start + PER_PAGE);
  }, [filteredCoins, currentPage]);

  // Only show the full-page skeleton on the very first load. The background
  // poll in App.jsx re-triggers `loading` every 15s to keep prices fresh —
  // without this guard, Markets would flash its skeleton over already-loaded
  // data on every poll tick.
  if (loading && !coins?.length) {
    return <MarketTableSkeleton />;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="space-y-5 p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans min-h-screen">

      {/* SECTION HEADER: FILTERS & SORT */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Gainers', 'Losers', 'Favorites'].map((tab) => (
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

      {/* Active search indicator */}
      {searchTerm && (
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Showing results for "<span className="text-slate-800 dark:text-slate-200 font-semibold">{searchTerm}</span>"</span>
          <button
            onClick={() => setSearchParams({})}
            className="text-amber-600 dark:text-amber-500 hover:text-amber-500 dark:hover:text-amber-400 font-semibold cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* CORE DATA TABLE MODULE */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto w-full">
          {paginatedCoins.length > 0 ? (
            <CoinTable coins={paginatedCoins} />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500 text-sm text-center px-4">
              {searchTerm
                ? `No coins match "${searchTerm}".`
                : `No coins match "${activeTab}" right now.`}
            </div>
          )}
        </div>
      </div>

      {/* PAGINATION UTILITY MATRIX FOOTER */}
      {filteredCoins.length > PER_PAGE && (
        <div className="flex justify-center items-center gap-1.5 select-none pt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 font-medium text-xs px-3 py-2 rounded-md transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ‹ Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`text-xs font-bold px-3 py-2 rounded-md transition-all cursor-pointer ${
                currentPage === num
                  ? 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-amber-600 dark:text-amber-400'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 font-medium text-xs px-3 py-2 rounded-md transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
}
