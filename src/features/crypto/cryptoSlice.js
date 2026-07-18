import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchCoins = createAsyncThunk("crypto/fetchCoins", async () => {
  const response = await axiosInstance.get("/coins/markets", {
    params: {
      vs_currency: "usd",
      per_page: 40,
      order: 'market_cap_desc',
      page: 1,
      sparkline: true
    },
  });

  return response.data;
});

export const fetchCoinDetails = createAsyncThunk(
  "crypto/fetchCoinDetails",
  async (id) => {
    const response = await axiosInstance.get(`/coins/${id}`);
    return response.data;
  }
);

const initialState = {
  coins: [],
  coinDetails: null,
  // Separate loading flags — fetchCoins now also runs on a background 15s
  // poll (see App.jsx) to keep prices fresh app-wide. If it shared one
  // `loading` flag with fetchCoinDetails, every poll tick would re-trigger
  // Markets' full-page skeleton even though data is already on screen.
  loading: false,
  loadingDetails: false,
  error: null,
};

const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.loading = false;
        state.coins = action.payload;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchCoinDetails.pending, (state) => {
        state.loadingDetails = true;
      })
      .addCase(fetchCoinDetails.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.coinDetails = action.payload;
      })
      .addCase(fetchCoinDetails.rejected, (state, action) => {
        state.loadingDetails = false;
        state.error = action.error.message;
      });
  },
});

export default cryptoSlice.reducer;
