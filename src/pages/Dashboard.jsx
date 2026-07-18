import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardWatchlistCard from "../components/DashboardWatchlistCard";

const ALLOCATION_COLORS = ["#E8B339", "#4C8DFF", "#33D08A"];

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState("1W");

  const portfolio = useSelector((state) => state.portfolio);
  const { coins } = useSelector((state) => state.crypto);
  const orders = useSelector((state) => state.orders.orders);

  // --- Join holdings with live prices ---
  const enrichedHoldings = useMemo(() => {
    return portfolio.holdings.map((h) => {
      const coin = coins.find((c) => c.id === h.id);
      const currentPrice = coin?.current_price ?? h.avgPrice;
      return {
        ...h,
        currentPrice,
        currentValue: h.quantity * currentPrice,
        change24h: coin?.price_change_percentage_24h ?? 0,
      };
    });
  }, [portfolio.holdings, coins]);

  const holdingsValue = enrichedHoldings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalBalance = portfolio.balance + holdingsValue;

  // --- Unrealized P/L (vs avg buy price) as a stand-in for "24h P/L" since we
  // don't store historical portfolio snapshots yet ---
  const unrealizedPL = enrichedHoldings.reduce(
    (sum, h) => sum + (h.currentPrice - h.avgPrice) * h.quantity,
    0
  );
  const unrealizedPLPercent = holdingsValue > 0 ? (unrealizedPL / (holdingsValue - unrealizedPL)) * 100 : 0;

  const openOrdersCount = orders.filter((o) => o.status === "Open").length;

  const statsData = [
    {
      label: "Total Balance",
      value: `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      pill: enrichedHoldings.length > 0 ? `${enrichedHoldings.length} assets` : "All cash",
      type: "neutral",
    },
    {
      label: "Unrealized P/L",
      value: `${unrealizedPL >= 0 ? "+" : "-"}$${Math.abs(unrealizedPL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      pill: `${unrealizedPL >= 0 ? "▲" : "▼"} ${Math.abs(unrealizedPLPercent).toFixed(1)}%`,
      type: unrealizedPL >= 0 ? "up" : "down",
      customColor: unrealizedPL >= 0,
    },
    {
      label: "Assets Held",
      value: `${enrichedHoldings.length} coin${enrichedHoldings.length === 1 ? "" : "s"}`,
      pill: enrichedHoldings.length > 3 ? "Diversified" : enrichedHoldings.length > 0 ? "Concentrated" : "None yet",
      type: "neutral",
    },
    {
      label: "Open Orders",
      value: `${openOrdersCount}`,
      pill: openOrdersCount > 0 ? `${openOrdersCount} pending` : "None open",
      type: openOrdersCount > 0 ? "pending" : "neutral",
    },
  ];

  // --- Allocation donut: top 2 holdings + "Others" (remaining holdings + cash) ---
  const allocation = useMemo(() => {
    if (totalBalance <= 0) return [];

    const sorted = [...enrichedHoldings].sort((a, b) => b.currentValue - a.currentValue);
    const top = sorted.slice(0, 2);
    const restValue = sorted.slice(2).reduce((sum, h) => sum + h.currentValue, 0) + portfolio.balance;

    const segments = top.map((h) => ({
      label: h.symbol?.toUpperCase(),
      value: h.currentValue,
      percent: (h.currentValue / totalBalance) * 100,
    }));

    if (restValue > 0) {
      segments.push({
        label: sorted.length > 2 ? "Others" : "Cash (USDT)",
        value: restValue,
        percent: (restValue / totalBalance) * 100,
      });
    }

    // Precompute cumulative offsets for the stacked SVG circles
    let cumulative = 0;
    return segments.map((seg, idx) => {
      const dashArray = `${seg.percent.toFixed(1)} ${(100 - seg.percent).toFixed(1)}`;
      const dashOffset = -cumulative;
      cumulative += seg.percent;
      return { ...seg, dashArray, dashOffset, color: ALLOCATION_COLORS[idx] };
    });
  }, [enrichedHoldings, portfolio.balance, totalBalance]);

  // --- Recent transactions from real portfolio history ---
  const recentTransactions = portfolio.history.slice(0, 5);

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 font-sans">
      {/* 1. TOP ANALYTICS STATS GRID MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-xl flex flex-col justify-between min-h-27.5 shadow-sm"
          >
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {stat.label}
            </div>
            <div
              className={`text-2xl font-bold font-mono tracking-tight my-1 ${stat.customColor ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}
            >
              {stat.value}
            </div>
            <div>
              {stat.type === "up" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {stat.pill}
                </span>
              )}
              {stat.type === "down" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  {stat.pill}
                </span>
              )}
              {stat.type === "neutral" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {stat.pill}
                </span>
              )}
              {stat.type === "pending" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-500">
                  {stat.pill}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 2. MAIN VISUALIZATION CHARTS GRID SETUP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Portfolio Value — NOTE: this trend line is still illustrative.
            Making it fully real requires storing periodic balance snapshots
            (e.g. one entry per day) somewhere, which we don't persist yet. */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-200">
                Portfolio Value
              </h2>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">
                ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800/60">
              {["1D", "1W", "1M", "1Y"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                    timeframe === t
                      ? "bg-amber-500 text-slate-950 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 w-full">
            <svg
              viewBox="0 0 600 200"
              width="100%"
              height="200"
              preserveAspectRatio="none"
              className="w-full overflow-visible h-44"
            >
              <defs>
                <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8B339" stopOpacity="0.35"></stop>
                  <stop offset="100%" stopColor="#E8B339" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <polyline
                points="0,150 60,140 120,155 180,120 240,130 300,90 360,100 420,60 480,75 540,40 600,55"
                fill="none"
                stroke="#E8B339"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></polyline>
              <polygon
                points="0,150 60,140 120,155 180,120 240,130 300,90 360,100 420,60 480,75 540,40 600,55 600,200 0,200"
                fill="url(#pg)"
              ></polygon>
            </svg>
          </div>
        </div>

        {/* Allocation donut — now built from real holdings + cash */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-xl flex flex-col justify-between items-center text-center shadow-sm">
          <div className="w-full text-left">
            <h2 className="text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-200">
              Allocation
            </h2>
          </div>
          <div className="my-auto py-3 transform -rotate-90">
            <svg viewBox="0 0 36 36" width="140" height="140" className="block mx-auto">
              <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="currentColor" className="text-slate-200 dark:text-[#1e293b]" strokeWidth="4"></circle>
              {allocation.map((seg) => (
                <circle
                  key={seg.label}
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="4"
                  strokeDasharray={seg.dashArray}
                  strokeDashoffset={seg.dashOffset}
                ></circle>
              ))}
            </svg>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2 text-[11px] font-medium tracking-wide text-slate-600 dark:text-slate-400">
            {allocation.length === 0 ? (
              <span className="text-slate-400 dark:text-slate-500">No holdings yet</span>
            ) : (
              allocation.map((seg) => (
                <div key={seg.label} className="flex items-center gap-1.5" style={{ color: seg.color }}>
                  ● {seg.label} {seg.percent.toFixed(0)}%
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM MARKET METRICS TABLES CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DashboardWatchlistCard />

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-200">
              Recent Transactions
            </h2>
            <Link to="/wallet" className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer transition-all">
              See all
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">No transactions yet.</p>
              <Link to="/markets" className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300">
                Browse markets →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs uppercase font-bold tracking-wider">
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Coin</th>
                    <th className="pb-3 font-semibold text-right">Amount</th>
                    <th className="pb-3 font-semibold text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {recentTransactions.map((tx) => {
                    const isInflow = tx.type === "DEPOSIT" || tx.type === "BUY";
                    return (
                      <tr key={tx.id} className="group">
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-bold capitalize ${
                              isInflow ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {isInflow ? "▲" : "▼"} {tx.type.toLowerCase()}
                          </span>
                        </td>
                        <td className="py-3 font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                          {tx.symbol?.toUpperCase()}
                        </td>
                        <td className="py-3 text-right font-mono text-slate-800 dark:text-slate-200 font-medium">
                          {tx.quantity}
                        </td>
                        <td className="py-3 text-right font-mono text-slate-600 dark:text-slate-400 text-xs">
                          {new Date(tx.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
