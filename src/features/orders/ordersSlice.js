import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  orders: [], // { id, coinId, symbol, side, orderType, amount, targetPrice, filledPrice, status, date }
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // orderType: 'market' | 'limit'
    // Market orders fill immediately at the given targetPrice (the current price at click time).
    // Limit orders start as 'Open' and wait for useOrderMatching to fill them.
    placeOrder: {
      prepare: ({ coinId, symbol, side, orderType, amount, targetPrice }) => ({
        payload: {
          id: nanoid(),
          coinId,
          symbol,
          side,
          orderType,
          amount,
          targetPrice,
          filledPrice: orderType === 'market' ? targetPrice : null,
          status: orderType === 'market' ? 'Filled' : 'Open',
          date: new Date().toISOString(),
        },
      }),
      reducer: (state, action) => {
        state.orders.unshift(action.payload);
      },
    },

    fillOrder: (state, action) => {
      const { id, filledPrice } = action.payload;
      const order = state.orders.find((o) => o.id === id);
      if (order && order.status === 'Open') {
        order.status = 'Filled';
        order.filledPrice = filledPrice;
      }
    },

    cancelOrder: (state, action) => {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order && order.status === 'Open') {
        order.status = 'Cancelled';
      }
    },
  },
});

export const { placeOrder, fillOrder, cancelOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
