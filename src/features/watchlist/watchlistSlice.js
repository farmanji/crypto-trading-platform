import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coins: [],
};
const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addToWatchlist: (state, action) => {
      state.coins.push(action.payload);
    },
    removeFromWatchlist: (state, action) => {
      state.coins = state.coins.filter((coin) => coin.id !== action.payload);
    },
  },
});
export const { addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
