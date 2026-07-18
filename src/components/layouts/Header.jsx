import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Topbar from '../Topbar';
import ScrollPrice from '../ScrollPrice';
import { fetchCoins } from '../../features/crypto/cryptoSlice';

const TICKER_COUNT = 8;

export default function Header() {
  const dispatch = useDispatch();
  const { coins } = useSelector((state) => state.crypto);

  useEffect(() => {
    if (!coins?.length) {
      dispatch(fetchCoins());
    }
  }, [dispatch, coins?.length]);

  const tickerItems = useMemo(() => {
    return coins.slice(0, TICKER_COUNT).map((coin) => {
      const change = coin.price_change_percentage_24h ?? 0;
      return {
        id: coin.id,
        symbol: coin.symbol?.toUpperCase(),
        price: coin.current_price
          ? `$${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : '—',
        change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
        isUp: change >= 0,
      };
    });
  }, [coins]);

  const infiniteTicker = tickerItems.length ? [...tickerItems, ...tickerItems, ...tickerItems] : [];

  return (
    <div className="w-full flex flex-col shrink-0 select-none bg-slate-50 dark:bg-slate-950">

      {infiniteTicker.length > 0 && <ScrollPrice infiniteTicker={infiniteTicker} />}

      {/* Topbar reads mobile-menu state from SidebarContext (useSidebar hook) —
          no need to prop-drill an onMenuClick handler through here */}
      <Topbar />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
      `}} />
    </div>
  );
}
