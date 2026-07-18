import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from "react-router-dom";
import { logout } from '../features/auth/authSlice';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';

const PAGE_TITLES = {
  '': 'Dashboard',
  dashboard: 'Dashboard',
  markets: 'Markets',
  wallet: 'Wallet',
  orders: 'Orders',
  trades: 'Trade',
  watchlist: 'Watchlist',
  settings: 'Settings',
};

// Turns a timestamp into "2m ago", "3h ago", "5d ago" etc.
function timeAgo(timestamp) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const { setMobileOpen } = useSidebar();

  const [searchTerm, setSearchTerm] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [lastSeenNotifAt, setLastSeenNotifAt] = useState(() => localStorage.getItem('lastSeenNotifAt') || null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const firstSegment = location.pathname.split('/').filter(Boolean)[0] || '';
  const pageName = PAGE_TITLES[firstSegment] || firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);

  const user = useSelector((state) => state.auth.user);
  const portfolio = useSelector((state) => state.portfolio);
  const coins = useSelector((state) => state.crypto.coins);
  const orders = useSelector((state) => state.orders.orders);

  const totalBalance = useMemo(() => {
    const holdingsValue = portfolio.holdings.reduce((sum, h) => {
      const coin = coins.find((c) => c.id === h.id);
      const price = coin?.current_price ?? h.avgPrice;
      return sum + h.quantity * price;
    }, 0);
    return portfolio.balance + holdingsValue;
  }, [portfolio, coins]);

  // Notification feed from real events: filled/cancelled limit orders (market
  // orders fire instantly so they're less "notification worthy"), plus
  // deposits/withdrawals. Sorted newest first.
  const notifications = useMemo(() => {
    const orderNotifs = orders
      .filter((o) => o.orderType === 'limit' && (o.status === 'Filled' || o.status === 'Cancelled'))
      .map((o) => ({
        id: o.id,
        icon: o.status === 'Filled' ? (o.side === 'Buy' ? '✅' : '💰') : '✖️',
        text:
          o.status === 'Filled'
            ? `Limit ${o.side.toLowerCase()} filled: ${o.amount} ${o.symbol.toUpperCase()} @ $${o.filledPrice}`
            : `Limit ${o.side.toLowerCase()} cancelled: ${o.amount} ${o.symbol.toUpperCase()}`,
        timestamp: o.date,
      }));

    const txNotifs = portfolio.history
      .filter((tx) => tx.type === 'DEPOSIT' || tx.type === 'WITHDRAW')
      .map((tx) => ({
        id: tx.id,
        icon: tx.type === 'DEPOSIT' ? '⬆️' : '⬇️',
        text: `${tx.type === 'DEPOSIT' ? 'Deposited' : 'Withdrew'} $${tx.quantity.toFixed(2)}`,
        timestamp: tx.timestamp,
      }));

    return [...orderNotifs, ...txNotifs]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 8);
  }, [orders, portfolio.history]);

  const unreadCount = useMemo(() => {
    if (!lastSeenNotifAt) return notifications.length;
    return notifications.filter((n) => new Date(n.timestamp) > new Date(lastSeenNotifAt)).length;
  }, [notifications, lastSeenNotifAt]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/markets?search=${encodeURIComponent(searchTerm.trim())}`);
    setMobileSearchOpen(false);
  };

  const toggleNotifications = () => {
    setNotifOpen((prev) => {
      const next = !prev;
      if (next) {
        const now = new Date().toISOString();
        localStorage.setItem('lastSeenNotifAt', now);
        setLastSeenNotifAt(now);
      }
      return next;
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoutHandler = () => {
    setProfileOpen(false);
    dispatch(logout());
    localStorage.removeItem("token");
    navigate('/login'); // matches the actual route registered in App.jsx
  };

  const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase();

  const searchForm = (
    <form
      onSubmit={handleSearchSubmit}
      className="flex items-center gap-2 bg-slate-100 dark:bg-[#16171d] border border-slate-200 dark:border-slate-800/80 rounded-lg px-3 py-1.5 text-xs text-slate-500 w-full sm:w-52 cursor-text hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
    >
      <span className="text-[13px]">🔍</span>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search coins…"
        className="bg-transparent outline-hidden text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 w-full"
      />
    </form>
  );

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/40">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4">
        {/* Hamburger (mobile only) + page title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="md:hidden shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-[#16171d] border border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            ☰
          </button>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans capitalize truncate">
            {pageName} </h1>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Search — full box on desktop, icon-toggle on mobile */}
          <div className="hidden sm:block">{searchForm}</div>
          <button
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            aria-label="Search"
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-[#16171d] border border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            🔍
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-[#16171d] border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
          >
            <span className="text-sm">{theme === 'dark' ? '☾' : '☀'}</span>
          </button>

          {/* Notification bell + dropdown */}
          <div ref={notifRef} className="relative">
            <button
              onClick={toggleNotifications}
              aria-label="Notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-[#16171d] border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            >
              <span className="text-sm">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-slate-500">
                      Nothing yet. Limit order fills and deposits/withdrawals show up here.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="flex items-start gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <span className="text-base leading-none">{n.icon}</span>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-700 dark:text-slate-200 leading-snug">{n.text}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{timeAgo(n.timestamp)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Currency Wallet Chip — hidden on very small screens to save space */}
          <div className="hidden sm:block bg-slate-100 dark:bg-[#16171d] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold text-xs px-3 py-2 rounded-lg tracking-wide">
            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          {/* Avatar + Profile dropdown */}
          <div
            ref={profileRef}
            className="relative"
            onMouseEnter={() => setProfileOpen(true)}
            onMouseLeave={() => setProfileOpen(false)}
          >
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="w-9 h-9 rounded-full bg-linear-to-tr from-amber-400 to-amber-600 border border-slate-900/10 dark:border-slate-900 shadow-sm cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center text-xs font-bold text-slate-900 overflow-hidden"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name || 'Profile'} className="w-full h-full object-cover" />
              ) : (
                userInitial || '?'
              )}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="w-11 h-11 rounded-full bg-linear-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-sm font-bold text-slate-900 overflow-hidden shrink-0">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user?.name || 'Profile'} className="w-full h-full object-cover" />
                    ) : (
                      userInitial || '?'
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name || 'Your Account'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'Not signed in'}</p>
                  </div>
                </div>

                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between text-xs">
                  <span className="text-slate-500">Total balance</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Settings
                  </Link>
                  <Link
                    to="/wallet"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Wallet
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="w-full text-left px-4 py-2 text-sm text-rose-500 dark:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search row — only shown when toggled open */}
      {mobileSearchOpen && (
        <div className="sm:hidden px-4 pb-4">{searchForm}</div>
      )}
    </div>
  );
}
