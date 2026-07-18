import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 8345,
  holdings: [], // Elements look like: { id, name, symbol, quantity, avgPrice }
  history: []   // Elements look like: { id, type, symbol, quantity, price, timestamp }
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    buyCoin: (state, action) => {
      const { id, name, symbol, price, quantity } = action.payload;
      const totalCost = price * quantity;

      if (state.balance < totalCost) {
        console.error("Insufficient balance");
        return;
      }

      state.balance -= totalCost;

      const existingHolding = state.holdings.find(item => item.id === id);

      if (existingHolding) {
        const oldTotalCost = existingHolding.avgPrice * existingHolding.quantity;
        const newTotalCost = oldTotalCost + totalCost;

        existingHolding.quantity += quantity;
        existingHolding.avgPrice = newTotalCost / existingHolding.quantity;
      } else {
        state.holdings.push({ id, name, symbol, quantity, avgPrice: price });
      }

      state.history.unshift({
        id: `${id}-${Date.now()}`,
        type: 'BUY',
        symbol,
        quantity,
        price,
        timestamp: new Date().toISOString()
      });
    },

    sellCoin: (state, action) => {
      const { id, symbol, price, quantity } = action.payload;

      const existingHolding = state.holdings.find(item => item.id === id);

      // Can't sell what you don't hold, or more than you hold
      if (!existingHolding || existingHolding.quantity < quantity) {
        console.error("Insufficient holdings to sell");
        return;
      }

      const proceeds = price * quantity;
      state.balance += proceeds;
      existingHolding.quantity -= quantity;

      // Clean up fully-sold holdings so they don't linger at 0
      if (existingHolding.quantity <= 0) {
        state.holdings = state.holdings.filter(item => item.id !== id);
      }

      state.history.unshift({
        id: `${id}-${Date.now()}`,
        type: 'SELL',
        symbol,
        quantity,
        price,
        timestamp: new Date().toISOString()
      });
    },

    // No real payment rails yet — this just simulates cash moving in/out so the
    // Wallet UI has something real to work with. Swap for an actual payment
    // provider + backend balance update later.
    depositFunds: (state, action) => {
      const amount = Number(action.payload);
      if (!amount || amount <= 0) return;

      state.balance += amount;
      state.history.unshift({
        id: `deposit-${Date.now()}`,
        type: 'DEPOSIT',
        symbol: 'USDT',
        quantity: amount,
        price: 1,
        timestamp: new Date().toISOString()
      });
    },

    withdrawFunds: (state, action) => {
      const amount = Number(action.payload);
      if (!amount || amount <= 0 || amount > state.balance) {
        console.error("Invalid or insufficient balance for withdrawal");
        return;
      }

      state.balance -= amount;
      state.history.unshift({
        id: `withdraw-${Date.now()}`,
        type: 'WITHDRAW',
        symbol: 'USDT',
        quantity: amount,
        price: 1,
        timestamp: new Date().toISOString()
      });
    }
  }
});

export const { buyCoin, sellCoin, depositFunds, withdrawFunds } = portfolioSlice.actions;
export default portfolioSlice.reducer;
