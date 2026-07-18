import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import authReducer from "../features/auth/authSlice";
import cryptoReducer from "../features/crypto/cryptoSlice";
import watchlistReducer from "../features/watchlist/watchlistSlice";
import portfolioReducer from "../features/portfolio/portfolioSlice";
import ordersReducer from "../features/orders/ordersSlice";

// redux-persist/lib/storage breaks under Vite's CJS/ESM interop (storage.getItem
// resolves to undefined), so this is a minimal manual localStorage adapter instead.
const storage = {
  getItem(key) {
    return Promise.resolve(window.localStorage.getItem(key));
  },
  setItem(key, value) {
    return Promise.resolve(window.localStorage.setItem(key, value));
  },
  removeItem(key) {
    return Promise.resolve(window.localStorage.removeItem(key));
  },
};

const rootReducer = combineReducers({
  auth: authReducer,
  orders: ordersReducer,
  portfolio: portfolioReducer,
  crypto: cryptoReducer,       // NOT persisted — always refetch fresh live prices on load
  watchlist: watchlistReducer, // persisted
});

// Whitelist every slice that holds the user's own data, so it survives a
// refresh. `crypto` is deliberately excluded — live market data should
// always be fetched fresh, never served stale from localStorage.
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'watchlist', 'portfolio', 'orders'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // redux-persist dispatches non-serializable actions internally — ignore just these
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
