import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCoinDetails, fetchCoins } from "../features/crypto/cryptoSlice";
import { buyCoin, sellCoin } from "../features/portfolio/portfolioSlice";
import { placeOrder } from "../features/orders/ordersSlice";

export default function Trades() {
  const timeframes = ["1H", "1D", "1W", "1M", "1Y"];
  const [activeTf, setActiveTf] = useState("1D");
  const [tradeTab, setTradeTab] = useState("Buy");
  const [orderType, setOrderType] = useState("market"); // 'market' | 'limit'
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedPercent, setSelectedPercent] = useState("");
  const [feedback, setFeedback] = useState(null);

  let { id } = useParams();
  if (!id) id = "bitcoin";

  const dispatch = useDispatch();
  const { coinDetails } = useSelector((state) => state.crypto);
  const portfolio = useSelector((state) => state.portfolio);
  const orders = useSelector((state) => state.orders.orders);

  const percentChips = ["25%", "50%", "75%", "Max"];
  const currentPrice = coinDetails?.market_data?.current_price?.usd || 0;
  const total = Number(price) * Number(quantity);

  useEffect(() => {
    dispatch(fetchCoinDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchCoins());
  }, [dispatch]);

  // For Market orders, price always tracks the live price and isn't editable.
  // For Limit orders, prefill with current price but let the user change it —
  // that's the whole point of a limit order (set your own target).
  useEffect(() => {
    if (currentPrice && (orderType === "market" || price === "")) {
      setPrice(currentPrice.toString());
    }
  }, [currentPrice, orderType]);

  const holding = coinDetails
    ? portfolio.holdings.find((h) => h.id === coinDetails.id)
    : null;
  const heldQuantity = holding?.quantity || 0;

  // Open orders "lock" funds/coins so they can't be double-spent on a second order.
  const openOrders = useMemo(() => orders.filter((o) => o.status === "Open"), [orders]);

  const reservedBalance = useMemo(
    () => openOrders.filter((o) => o.side === "Buy").reduce((sum, o) => sum + o.amount * o.targetPrice, 0),
    [openOrders]
  );
  const reservedQtyThisCoin = useMemo(
    () =>
      openOrders
        .filter((o) => o.side === "Sell" && o.coinId === coinDetails?.id)
        .reduce((sum, o) => sum + o.amount, 0),
    [openOrders, coinDetails?.id]
  );

  const availableBalance = Math.max(0, portfolio.balance - reservedBalance);
  const availableHolding = Math.max(0, heldQuantity - reservedQtyThisCoin);

  const getId = (pricelast) => {
    setPrice(pricelast.toString());
    setSelectedPercent("");
  };

  const handlePercentClick = (pct) => {
    setSelectedPercent(pct);
    const fraction = pct === "Max" ? 1 : parseInt(pct, 10) / 100;
    const p = Number(price) || currentPrice;
    if (!p) return;

    if (tradeTab === "Buy") {
      const spendable = availableBalance * fraction;
      setQuantity((spendable / p).toFixed(6));
    } else {
      setQuantity((availableHolding * fraction).toFixed(6));
    }
  };

  const handleSubmit = () => {
    if (!coinDetails) return;
    const qty = Number(quantity);
    const p = Number(price);

    if (!qty || qty <= 0 || !p || p <= 0) {
      setFeedback({ type: "error", message: "Enter a valid price and quantity." });
      return;
    }

    if (tradeTab === "Buy" && p * qty > availableBalance) {
      setFeedback({ type: "error", message: "Insufficient available balance (some may be locked in open orders)." });
      return;
    }
    if (tradeTab === "Sell" && qty > availableHolding) {
      setFeedback({ type: "error", message: `Only ${availableHolding} ${coinDetails.symbol.toUpperCase()} available (some may be locked in open orders).` });
      return;
    }

    const orderPayload = {
      coinId: coinDetails.id,
      symbol: coinDetails.symbol,
      side: tradeTab,
      orderType,
      amount: qty,
      targetPrice: p,
    };

    dispatch(placeOrder(orderPayload));

    // Market orders execute right away — a limit order just sits as 'Open'
    // until useOrderMatching fills it once the live price crosses targetPrice.
    if (orderType === "market") {
      if (tradeTab === "Buy") {
        dispatch(buyCoin({ id: coinDetails.id, name: coinDetails.name, symbol: coinDetails.symbol, price: p, quantity: qty }));
      } else {
        dispatch(sellCoin({ id: coinDetails.id, symbol: coinDetails.symbol, price: p, quantity: qty }));
      }
      setFeedback({ type: "success", message: `${tradeTab} order filled: ${qty} ${coinDetails.symbol.toUpperCase()}.` });
    } else {
      setFeedback({ type: "success", message: `Limit ${tradeTab.toLowerCase()} order placed at $${p}. Waiting for price match.` });
    }

    setQuantity(1);
    setSelectedPercent("");
  };

  const candleMockData = [
    { side: "g", h: "h-[40px]", b: "h-[55px]" },
    { side: "r", h: "h-[30px]", b: "h-[40px]" },
    { side: "g", h: "h-[60px]", b: "h-[70px]" },
    { side: "g", h: "h-[20px]", b: "h-[35px]" },
    { side: "r", h: "h-[45px]", b: "h-[50px]" },
    { side: "g", h: "h-[70px]", b: "h-[90px]" },
    { side: "g", h: "h-[35px]", b: "h-[60px]" },
    { side: "r", h: "h-[25px]", b: "h-[30px]" },
    { side: "g", h: "h-[55px]", b: "h-[80px]" },
    { side: "r", h: "h-[40px]", b: "h-[45px]" },
    { side: "g", h: "h-[65px]", b: "h-[100px]" },
    { side: "g", h: "h-[30px]", b: "h-[50px]" },
    { side: "g", h: "h-[50px]", b: "h-[75px]" },
    { side: "r", h: "h-[35px]", b: "h-[40px]" },
    { side: "g", h: "h-[60px]", b: "h-[95px]" },
    { side: "g", h: "h-[45px]", b: "h-[110px]" },
    { side: "r", h: "h-[20px]", b: "h-[25px]" },
    { side: "g", h: "h-[55px]", b: "h-[85px]" },
    { side: "g", h: "h-[40px]", b: "h-[120px]" },
    { side: "g", h: "h-[30px]", b: "h-[130px]" },
  ];

  return (
    <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto items-start">
        <div className="lg:col-span-8 flex flex-col gap-6 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 p-5 rounded-2xl backdrop-blur-md shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-amber-600 dark:text-amber-300 font-bold px-1">{coinDetails?.symbol?.toUpperCase()}</span>
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveTf(tf)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-150 cursor-pointer ${
                    activeTf === tf
                      ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
              <span>High <span className="text-slate-800 dark:text-slate-200">{coinDetails?.market_data?.high_24h?.usd}</span></span>
              <span>Low <span className="text-slate-800 dark:text-slate-200">{coinDetails?.market_data?.low_24h?.usd}</span></span>
              <span>
                Vol{" "}
                <span className="text-slate-800 dark:text-slate-200">
                  ${coinDetails?.market_data?.total_volume?.usd ? (coinDetails.market_data.total_volume.usd / 1000000000).toFixed(2) : "—"} B
                </span>
              </span>
            </div>
          </div>

          <div className="h-44 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl px-4 flex items-end justify-between gap-1 overflow-hidden group pb-2">
            {candleMockData.map((candle, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center justify-end relative h-full">
                <div className={`w-px absolute ${candle.side === "g" ? "bg-emerald-500/50" : "bg-rose-500/50"} ${candle.h}`} />
                <div className={`w-full max-w-3 rounded-sm z-10 transition-all ${candle.side === "g" ? "bg-emerald-500 hover:bg-emerald-400" : "bg-rose-500 hover:bg-rose-400"} ${candle.b}`} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <h2 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-3">Order Book</h2>
              <div className="overflow-hidden border border-slate-200 dark:border-slate-700/30 rounded-xl bg-slate-50 dark:bg-slate-900/30">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40">
                      <th className="px-4 py-2 font-medium">Price (USDT)</th>
                      <th className="px-4 py-2 font-medium">Amount ({coinDetails?.symbol?.toUpperCase() || "—"})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 font-mono font-medium cursor-pointer">
                    {coinDetails?.tickers?.slice(0, 7).map((tick, idx) => (
                      <tr onClick={() => getId(tick.last)} key={`${tick.market?.name ?? 'ticker'}-${idx}`} className="hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-2 text-rose-600 dark:text-rose-400">{tick.last}</td>
                        <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{currentPrice ? (tick.last / currentPrice).toFixed(6) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  About <span className="text-amber-600 dark:text-amber-300">{coinDetails?.name}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  {coinDetails?.description?.en?.slice(0, 250) || "No description available."} ...
                </p>
              </div>
              <div className="flex gap-8 pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Circ. Supply</div>
                  <div className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                    {coinDetails?.market_data?.circulating_supply ? (coinDetails.market_data.circulating_supply / 1000000000).toFixed(2) : "—"} B
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Market Rank</div>
                  <div className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">#{coinDetails?.market_data?.market_cap_rank ?? "—"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 p-5 rounded-2xl backdrop-blur-md shadow-xl flex flex-col gap-5">
          <div className="flex w-full bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => { setTradeTab("Buy"); setSelectedPercent(""); setFeedback(null); }}
              className={`flex-1 py-2 text-center text-sm font-bold rounded-lg transition-all cursor-pointer ${
                tradeTab === "Buy" ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => { setTradeTab("Sell"); setSelectedPercent(""); setFeedback(null); }}
              className={`flex-1 py-2 text-center text-sm font-bold rounded-lg transition-all cursor-pointer ${
                tradeTab === "Sell" ? "bg-rose-500 text-slate-950 shadow-md shadow-rose-500/10" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Sell
            </button>
          </div>

          {/* Market vs Limit toggle */}
          <div className="flex gap-2 text-xs font-semibold">
            <button
              onClick={() => { setOrderType("market"); setSelectedPercent(""); setFeedback(null); }}
              className={`px-3 py-1.5 rounded-md border transition-all cursor-pointer ${
                orderType === "market" ? "bg-slate-300 dark:bg-slate-700 border-slate-400 dark:border-slate-500 text-slate-900 dark:text-slate-100" : "bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Market
            </button>
            <button
              onClick={() => { setOrderType("limit"); setSelectedPercent(""); setFeedback(null); }}
              className={`px-3 py-1.5 rounded-md border transition-all cursor-pointer ${
                orderType === "limit" ? "bg-slate-300 dark:bg-slate-700 border-slate-400 dark:border-slate-500 text-slate-900 dark:text-slate-100" : "bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Limit
            </button>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 -mt-3">
            {tradeTab === "Sell" && (
              <>Available to sell: <span className="text-slate-700 dark:text-slate-300 font-semibold">{availableHolding} {coinDetails?.symbol?.toUpperCase()}</span>{reservedQtyThisCoin > 0 && ` (${reservedQtyThisCoin} locked in open orders)`}</>
            )}
            {tradeTab === "Buy" && reservedBalance > 0 && (
              <>Available balance: <span className="text-slate-700 dark:text-slate-300 font-semibold">${availableBalance.toFixed(2)}</span> (${reservedBalance.toFixed(2)} locked in open orders)</>
            )}
          </p>

          <div className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {orderType === "limit" ? "Limit Price (USDT)" : "Price (USDT)"}
              </label>
              <input
                type="number"
                value={price}
                disabled={orderType === "market"}
                onChange={(e) => { setPrice(e.target.value); setSelectedPercent(""); }}
                placeholder="0.00"
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 rounded-xl px-4 py-2.5 font-mono text-sm text-slate-900 dark:text-slate-100 outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => { setQuantity(e.target.value); setSelectedPercent(""); }}
                placeholder="0.00"
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 rounded-xl px-4 py-2.5 font-mono text-sm text-slate-900 dark:text-slate-100 outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Amount (USDT)</label>
              <input
                type="number"
                value={total || ""}
                readOnly
                placeholder="0.00"
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 rounded-xl px-4 py-2.5 font-mono text-sm text-slate-900 dark:text-slate-100 outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {percentChips.map((pct) => (
                <button
                  key={pct}
                  onClick={() => handlePercentClick(pct)}
                  className={`py-1.5 text-xs font-semibold rounded-md border font-mono transition-all cursor-pointer ${
                    selectedPercent === pct ? "bg-slate-300 dark:bg-slate-700 border-slate-400 dark:border-slate-500 text-slate-900 dark:text-slate-100" : "bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {pct}
                </button>
              ))}
            </div>

            {feedback && (
              <p className={`text-xs font-medium ${feedback.type === "error" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                {feedback.message}
              </p>
            )}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800/80 my-0.5" />

          <div className="flex flex-col gap-1.5 text-xs font-medium">
            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
              <span>Available balance</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{availableBalance.toFixed(2)} USDT</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
              <span>Est. fee (0.1%)</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{total ? (total * 0.001).toFixed(2) : "—"}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className={`w-full py-3 rounded-xl font-bold text-sm text-slate-950 transition-colors shadow-lg cursor-pointer ${
              tradeTab === "Buy" ? "bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/5" : "bg-rose-500 hover:bg-rose-400 shadow-rose-500/5"
            }`}
          >
            {orderType === "limit" ? `Place Limit ${tradeTab}` : `${tradeTab} ${coinDetails?.name || ""}`}
          </button>

          <div className="border-t border-slate-200 dark:border-slate-800/80 my-0.5" />

          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Your Recent Orders</h2>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800/50 pb-2">
                  <th className="pb-2 font-semibold">Type</th>
                  <th className="pb-2 font-semibold text-right">Amount</th>
                  <th className="pb-2 font-semibold text-right">Price</th>
                  <th className="pb-2 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-400 dark:text-slate-500">No orders yet.</td>
                  </tr>
                ) : (
                  orders.slice(0, 5).map((o) => (
                    <tr key={o.id}>
                      <td className="py-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          o.side === "Buy" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                        }`}>
                          {o.side}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-slate-600 dark:text-slate-300 text-right">{o.amount}</td>
                      <td className="py-2.5 font-mono text-slate-600 dark:text-slate-300 text-right">{o.filledPrice ?? o.targetPrice}</td>
                      <td className="py-2.5 font-mono text-slate-500 dark:text-slate-400 text-right">{o.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
