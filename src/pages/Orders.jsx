import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cancelOrder } from '../features/orders/ordersSlice';

export default function Orders() {
  const tabs = ['All', 'Open', 'Filled', 'Cancelled'];
  const [activeTab, setActiveTab] = useState('All');

  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'All') return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  const handleCancel = (id) => {
    dispatch(cancelOrder(id));
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all duration-150 whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? 'bg-amber-500 border-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500 text-sm text-center px-4">
              No {activeTab.toLowerCase() === 'all' ? '' : activeTab.toLowerCase()} orders yet.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/80">
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Coin</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Order</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-sm">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors duration-150 ease-in-out">
                    <td className="px-5 py-4 font-mono text-slate-500 dark:text-slate-400">
                      {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-200">{order.symbol.toUpperCase()}</td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${
                        order.side === 'Buy' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                      }`}>
                        {order.side}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 capitalize">{order.orderType}</td>

                    <td className="px-5 py-4 font-mono text-slate-600 dark:text-slate-300">{order.amount}</td>
                    <td className="px-5 py-4 font-mono text-slate-600 dark:text-slate-300">
                      ${(order.filledPrice ?? order.targetPrice).toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        order.status === 'Open' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                        order.status === 'Filled' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                        'bg-slate-200/50 dark:bg-slate-700/30 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700/50'
                      }`}>
                        {order.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      {order.status === 'Open' ? (
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 rounded-lg border border-rose-500/20 transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 font-mono pr-4">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
