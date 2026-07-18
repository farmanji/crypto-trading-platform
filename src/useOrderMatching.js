import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fillOrder } from './features/orders/ordersSlice';
import { buyCoin, sellCoin } from './features/portfolio/portfolioSlice';

/**
 * Mount this once near the top of the app (e.g. in App.jsx).
 * Whenever crypto.coins updates (see the polling effect in App.jsx),
 * it checks every Open order and fills it if the current price has
 * crossed the order's target price — simulating what a real matching
 * engine / Socket.io price feed would trigger on the backend.
 */
export default function useOrderMatching() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const coins = useSelector((state) => state.crypto.coins);

  useEffect(() => {
    if (!coins?.length) return;

    const openOrders = orders.filter((o) => o.status === 'Open');
    if (!openOrders.length) return;

    openOrders.forEach((order) => {
      const coin = coins.find((c) => c.id === order.coinId);
      if (!coin?.current_price) return;

      const currentPrice = coin.current_price;

      // Buy limit fills when price drops to/below target.
      // Sell limit fills when price rises to/above target.
      const shouldFill =
        (order.side === 'Buy' && currentPrice <= order.targetPrice) ||
        (order.side === 'Sell' && currentPrice >= order.targetPrice);

      if (!shouldFill) return;

      dispatch(fillOrder({ id: order.id, filledPrice: currentPrice }));

      if (order.side === 'Buy') {
        dispatch(
          buyCoin({
            id: order.coinId,
            name: coin.name,
            symbol: order.symbol,
            price: currentPrice,
            quantity: order.amount,
          })
        );
      } else {
        dispatch(
          sellCoin({
            id: order.coinId,
            symbol: order.symbol,
            price: currentPrice,
            quantity: order.amount,
          })
        );
      }
    });
  }, [coins, orders, dispatch]);
}
