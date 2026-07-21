import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../../features/auth/authSlice';
import { useSidebar } from '../../context/SidebarContext';

const menuItems = [
  { url: '/', name: 'Dashboard', icon: '⌂' },
  { url: '/markets', name: 'Markets', icon: '≋' },
  { url: '/wallet', name: 'Wallet', icon: '◈' },
  { url: '/orders', name: 'Orders', icon: '☰' },
  { url: '/trades', name: 'Trades', icon: '⇄' },
  { url: '/watchlist', name: 'Watchlist', icon: '☆' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const orders = useSelector((state) => state.orders.orders);
  const { mobileOpen, setMobileOpen } = useSidebar();

  const openOrdersCount = orders.filter((o) => o.status === 'Open').length;

  const logoutHandler = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    setMobileOpen(false);
    navigate('/login');
  };

  const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase();

  const navLinkClasses = ({ isActive }) =>
    `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
      isActive
        ? "bg-amber-500/10 text-amber-500 dark:text-amber-400"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
    }`;

  return (
    <>
      {/* Backdrop — mobile only, closes the drawer on tap outside */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-20 md:hidden cursor-pointer"
        />
      )}

      <aside
        className={`flex flex-col w-64 h-screen fixed z-30 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 justify-between select-none shrink-0 transition-transform duration-200 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white p-6 border-b border-slate-200 dark:border-slate-800/50">
            <span className="text-amber-500 dark:text-amber-400 text-2xl font-serif">◆</span>
            CryptoX
          </div>

          {/* Navigation Groups */}
          <div className="p-4 space-y-6">
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase block mb-2">
                Menu
              </span>

              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.url}
                  end={item.url === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={navLinkClasses}
                >
                  <span className="text-base leading-none opacity-80">
                    {item.icon}
                  </span>
                  {item.name}

                  {item.name === 'Orders' && openOrdersCount > 0 && (
                    <span className="ml-auto bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {openOrdersCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            <div className="space-y-1">
              <span className="px-3 text-[10px] font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase block mb-2">
                Account
              </span>

              <NavLink to="/settings" onClick={() => setMobileOpen(false)} className={navLinkClasses}>
                <span>⚙</span>
                Settings
              </NavLink>

              <button
                onClick={logoutHandler}
                className="w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
              >
                <span>↪</span>
                Log out
              </button>
            </div>
          </div>
        </div>

        {/* Bottom profile card — real user data, links through to Settings */}
        <Link
          to="/settings"
          onClick={() => setMobileOpen(false)}
          className="p-4 border-t border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-amber-400 to-amber-600 border border-amber-400/20 shadow-inner flex items-center justify-center text-slate-950 font-bold text-sm shrink-0 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name || 'Profile'} className="w-full h-full object-cover" />
              ) : (
                userInitial || '?'
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {user?.fullName || user?.email || 'Guest'}
              </div>
              {!user?.kycVerified ? (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  Verified · KYC ✓
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Not verified</div>
              )}
            </div>
          </div>
        </Link>
      </aside>
    </>
  );
}
