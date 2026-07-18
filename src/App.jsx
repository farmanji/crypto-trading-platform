import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Watchlist from "./pages/Watchlist";
import Signup from "./pages/Signup";
import Markets from "./pages/Markets";
import Wallet from "./pages/Wallet";
import Trades from "./pages/Trades";
import Settings from "./pages/Settings";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import { fetchCoins } from "./features/crypto/cryptoSlice";
import useOrderMatching from "./useOrderMatching";
import ScrollToTop from "./ScrollToTop";

const App = () => {
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchCoins());
    const interval = setInterval(() => dispatch(fetchCoins()), 15000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useOrderMatching();

  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/trades/:id" element={<Trades />} />
            <Route path="/trades" element={<Trades />} />
          </Route>
        </Route>

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
