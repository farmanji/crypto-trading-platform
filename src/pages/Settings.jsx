import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase();

  const logoutHandler = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 font-sans space-y-6">
      <h1 className="text-xl font-bold">Settings</h1>

      {/* Profile summary */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-linear-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-lg font-bold text-slate-950 overflow-hidden shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt={user?.name || 'Profile'} className="w-full h-full object-cover" />
          ) : (
            userInitial || '?'
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold truncate">{user?.name || 'Your Account'}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user?.email || 'Not signed in'}</p>
        </div>
      </section>

      {/* Appearance */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl p-5">
        <h2 className="text-sm font-semibold mb-3">Appearance</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTheme('light')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold border transition-colors cursor-pointer ${
              theme === 'light'
                ? 'bg-amber-500 border-amber-500 text-slate-950'
                : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            ☀ Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold border transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-amber-500 border-amber-500 text-slate-950'
                : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            ☾ Dark
          </button>
        </div>
      </section>

      {/* Account actions */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl p-5">
        <h2 className="text-sm font-semibold mb-3">Account</h2>
        <button
          onClick={logoutHandler}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
        >
          Log out
        </button>
      </section>
    </div>
  );
}
