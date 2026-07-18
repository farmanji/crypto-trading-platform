import React from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'

const MAX_ITEMS = 3;

const DashboardWatchlistCard = () => {
  const watchlist = useSelector((state) => state.watchlist.coins);
  const topCoins = watchlist.slice(0, MAX_ITEMS);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-xl shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200">
          Watchlist
        </h2>
        <Link to='/watchlist' className="text-xs font-semibold text-amber-500 dark:text-amber-400 hover:underline cursor-pointer transition-all">
          See all
        </Link>
      </div>

      {topCoins.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">No coins starred yet.</p>
          <Link to="/markets" className="mt-2 text-xs font-semibold text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300">
            Browse markets →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs uppercase font-bold tracking-wider">
                <th className="pb-3 font-semibold">Coin</th>
                <th className="pb-3 font-semibold text-right">Price</th>
                <th className="pb-3 font-semibold text-right">24h</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {topCoins.map((coin) => {
                const isPositive = (coin.price_change_percentage_24h ?? 0) > 0;

                return (
                  <tr key={coin.id} className="group">
                    <td className="py-3 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-sm">
                        {coin.image && (
                          <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                          {coin.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                          {coin.symbol}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right font-mono text-slate-800 dark:text-slate-200 font-medium">
                      {coin.current_price ? `$${coin.current_price.toLocaleString()}` : 'N/A'}
                    </td>
                    <td className="py-3.5 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold font-mono ${
                        isPositive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        {isPositive ? '▲' : '▼'} {coin.price_change_percentage_24h ? `${coin.price_change_percentage_24h.toFixed(2)}%` : '0.00%'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default DashboardWatchlistCard
