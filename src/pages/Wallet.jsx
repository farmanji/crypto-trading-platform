import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { depositFunds, withdrawFunds } from '../features/portfolio/portfolioSlice';

const COIN_STYLE = {
  btc: { bg: '#F7931A', glyph: '₿' },
  eth: { bg: '#8C8FF0', glyph: 'Ξ' },
  usdt: { bg: '#26A17B', glyph: '₮' },
};

export default function Wallet() {
  const dispatch = useDispatch();
  const portfolio = useSelector((state) => state.portfolio);
  const coins = useSelector((state) => state.crypto.coins);

  const [activeAction, setActiveAction] = useState(null); // 'deposit' | 'withdraw' | null
  const [amountInput, setAmountInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Join each holding with its live price/image from the crypto slice
  const enrichedHoldings = useMemo(() => {
    return portfolio.holdings.map((holding) => {
      const coin = coins.find((c) => c.id === holding.id);
      const currentPrice = coin?.current_price ?? holding.avgPrice;
      return {
        ...holding,
        image: coin?.image,
        currentPrice,
        currentValue: holding.quantity * currentPrice,
      };
    });
  }, [portfolio.holdings, coins]);

  const holdingsValue = enrichedHoldings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalWalletBalance = portfolio.balance + holdingsValue;

  const handleAction = () => {
    const amount = Number(amountInput);
    if (!amount || amount <= 0) {
      setFeedback({ type: 'error', message: 'Enter a valid amount.' });
      return;
    }

    if (activeAction === 'deposit') {
      dispatch(depositFunds(amount));
      setFeedback({ type: 'success', message: `Deposited $${amount.toFixed(2)}.` });
    } else {
      if (amount > portfolio.balance) {
        setFeedback({ type: 'error', message: 'Insufficient balance to withdraw.' });
        return;
      }
      dispatch(withdrawFunds(amount));
      setFeedback({ type: 'success', message: `Withdrew $${amount.toFixed(2)}.` });
    }

    setAmountInput('');
    setTimeout(() => setActiveAction(null), 900);
  };

  const openAction = (type) => {
    setActiveAction((prev) => (prev === type ? null : type));
    setAmountInput('');
    setFeedback(null);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 font-sans">

      {/* Top Section: Balance & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
        <div className="md:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <div className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Total Wallet Balance</div>
          <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            ${totalWalletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 dark:text-gray-500 mt-1 font-mono">
            ${portfolio.balance.toFixed(2)} cash + ${holdingsValue.toFixed(2)} in holdings
          </div>
        </div>

        <button
          onClick={() => openAction('deposit')}
          className={`h-full px-5 py-3 font-semibold rounded-xl transition-colors duration-200 shadow-sm cursor-pointer ${
            activeAction === 'deposit' ? 'bg-amber-400 text-gray-900' : 'text-gray-900 bg-amber-500 hover:bg-amber-400 active:bg-amber-600'
          }`}
        >
          ＋ Deposit
        </button>

        <button
          onClick={() => openAction('withdraw')}
          className={`h-full px-5 py-3 font-semibold rounded-xl transition-colors duration-200 border cursor-pointer ${
            activeAction === 'withdraw' ? 'bg-slate-800 border-slate-600 text-white' : 'text-slate-700 dark:text-gray-200 bg-transparent border-slate-300 dark:border-gray-700 hover:bg-slate-100 dark:hover:bg-gray-800 active:bg-slate-200 dark:active:bg-gray-700'
          }`}
        >
          Withdraw
        </button>
      </div>

      {/* Inline deposit/withdraw form */}
      {activeAction && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-700 rounded-xl p-5 flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-gray-400">
              {activeAction === 'deposit' ? 'Amount to deposit (USDT)' : 'Amount to withdraw (USDT)'}
            </label>
            <input
              type="number"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="0.00"
              className="mt-1 w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-gray-700 focus:border-slate-400 dark:focus:border-gray-500 rounded-lg px-4 py-2.5 font-mono text-sm text-slate-900 dark:text-slate-100 outline-none transition-colors"
            />
          </div>
          <button
            onClick={handleAction}
            className="px-5 py-2.5 font-semibold text-gray-900 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors cursor-pointer"
          >
            Confirm
          </button>
          {feedback && (
            <p className={`text-xs font-medium sm:ml-2 ${feedback.type === 'error' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {feedback.message}
            </p>
          )}
        </div>
      )}

      {/* Holdings Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 pt-4 pb-3 border-b border-slate-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Holdings</h2>
        </div>
        <div className="overflow-x-auto">
          {enrichedHoldings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-slate-500 dark:text-gray-400">You don't hold any coins yet.</p>
              <Link to="/markets" className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-500 hover:text-amber-500 dark:hover:text-amber-400">
                Browse markets →
              </Link>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-gray-700 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/60">
                  <th className="px-5 py-3">Coin</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Value (USD)</th>
                  <th className="px-5 py-3">Avg. Buy Price</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-700 text-sm">
                {enrichedHoldings.map((holding) => {
                  const style = COIN_STYLE[holding.symbol?.toLowerCase()] || { bg: '#475569', glyph: holding.symbol?.[0]?.toUpperCase() };
                  return (
                    <tr key={holding.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors duration-150">
                      <td className="px-5 py-4 flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white overflow-hidden"
                          style={{ backgroundColor: style.bg }}
                        >
                          {holding.image ? <img src={holding.image} alt={holding.name} className="w-full h-full object-cover" /> : style.glyph}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{holding.name}</div>
                          <div className="text-xs text-slate-500 dark:text-gray-400">{holding.symbol?.toUpperCase()}</div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono font-medium text-slate-900 dark:text-slate-100">{holding.quantity}</td>
                      <td className="px-5 py-4 font-mono text-slate-600 dark:text-gray-300">
                        ${holding.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-500 dark:text-gray-400">${holding.avgPrice.toFixed(2)}</td>
                      <td className="px-5 py-4 text-right">
                        <Link                         
                          to={`/trades/${holding.id}`}
                          aria-label={`Trade ${holding.name}`}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors cursor-pointer"
                        >
                          Trade
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Transaction History Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 pt-4 pb-3 border-b border-slate-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Transaction History</h2>
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-500 hover:text-amber-500 dark:hover:text-amber-400 cursor-pointer transition-colors">Export CSV</span>
        </div>
        <div className="overflow-x-auto">
          {portfolio.history.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-slate-500 dark:text-gray-400">
              No transactions yet.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-gray-700 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/60">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Coin</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-700 text-sm">
                {portfolio.history.slice(0, 10).map((tx) => {
                  const isInflow = tx.type === 'DEPOSIT' || tx.type === 'BUY';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors duration-150">
                      <td className="px-5 py-4 font-mono text-slate-500 dark:text-gray-400">
                        {new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4 font-medium capitalize">
                        <span className={`inline-flex items-center gap-1 ${isInflow ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {isInflow ? '▲' : '▼'} {tx.type.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-800 dark:text-slate-200">{tx.symbol?.toUpperCase()}</td>
                      <td className="px-5 py-4 font-mono text-slate-600 dark:text-gray-300">{tx.quantity}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Completed
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
