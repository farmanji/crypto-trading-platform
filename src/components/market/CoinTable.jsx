import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchlist, removeFromWatchlist } from '../../features/watchlist/watchlistSlice';

// Builds an SVG polyline from CoinGecko's 7-day sparkline price array
function buildSparklinePoints(prices = []) {
  if (!prices.length) return '';
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  return prices
    .map((price, idx) => {
      const x = (idx / (prices.length - 1)) * 90;
      const y = 30 - ((price - min) / range) * 26 - 2;
      return `${x},${y}`;
    })
    .join(' ');
}

const CoinTable = ({ coins }) => {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.coins);

  return (
    <table className="w-full text-left text-sm border-collapse min-w-175">
      <thead>
        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs uppercase font-bold tracking-wider select-none">
          <th className="py-4 pl-4 w-10"></th>
          <th className="py-4 font-semibold">Coin</th>
          <th className="py-4 font-semibold text-left">Price</th>
          <th className="py-4 font-semibold text-left">24h %</th>
          <th className="py-4 font-semibold text-left">Market Cap</th>
          <th className="py-4 font-semibold text-left">Volume (24h)</th>
          <th className="py-4 font-semibold text-center w-32">Last 7 days</th>
          <th className="py-4 pr-4 w-24"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 font-medium">
        {coins.map((coin) => {
          const isFav = watchlist.some((item) => item.id === coin.id);
          const isPositive = (coin.price_change_percentage_24h ?? 0) > 0;
          const svgPoints = buildSparklinePoints(coin.sparkline_in_7d?.price);

          return (
            <tr key={coin.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors group">
              {/* Favorite toggle — same component works for both Markets (add/remove) and Watchlist (always remove) */}
              <td className="py-3.5 pl-4 text-center">
                <button
                  onClick={() => {
                    if (isFav) {
                      dispatch(removeFromWatchlist(coin.id));
                    } else {
                      dispatch(addToWatchlist(coin));
                    }
                  }}
                  className={`text-base leading-none select-none transition-transform hover:scale-110 cursor-pointer ${
                    isFav ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'
                  }`}
                >
                  {isFav ? '★' : '☆'}
                </button>
              </td>

              <td className="py-3.5 flex items-center gap-3">
                <div className="w-6 h-6 overflow-hidden rounded-full flex items-center justify-center font-bold text-xs select-none shadow-xs bg-slate-100 dark:bg-slate-800">
                  {coin.image && <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" />}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">{coin.name}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{coin.symbol}</div>
                </div>
              </td>

              <td className="py-3.5 text-left font-mono text-slate-800 dark:text-slate-200">
                {coin.current_price ? `$${coin.current_price.toLocaleString()}` : 'N/A'}
              </td>

              <td className="py-3.5 text-left">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold font-mono ${
                  isPositive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}>
                  {isPositive ? '▲' : '▼'} {coin.price_change_percentage_24h ? `${coin.price_change_percentage_24h.toFixed(2)}%` : '0.00%'}
                </span>
              </td>

              <td className="py-3.5 text-left font-mono text-slate-600 dark:text-slate-300">
                {coin.market_cap ? `$${(coin.market_cap / 1000000000).toFixed(2)} B` : 'N/A'}
              </td>

              <td className="py-3.5 text-left font-mono text-slate-600 dark:text-slate-400">
                {coin.total_volume ? `$${(coin.total_volume / 1000000000).toFixed(2)} B` : 'N/A'}
              </td>

              <td className="py-3.5">
                <div className="flex justify-center items-center h-8">
                  {svgPoints ? (
                    <svg width="90" height="30" viewBox="0 0 90 30" className="overflow-visible">
                      <polyline
                        points={svgPoints}
                        fill="none"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={isPositive ? 'stroke-emerald-500 dark:stroke-emerald-400' : 'stroke-rose-500 dark:stroke-rose-400'}
                      />
                    </svg>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-slate-600">—</span>
                  )}
                </div>
              </td>

              <td className="py-3.5 pr-4 text-left">
                <Link
                  to={`/trades/${coin.id}`}
                  aria-label={`Trade ${coin.name}`}
                  className="bg-linear-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-md shadow-xs shadow-amber-500/5 hover:from-amber-300 hover:to-amber-400 active:scale-[0.98] transition-all cursor-pointer inline-block"
                >
                  Trade
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CoinTable;
