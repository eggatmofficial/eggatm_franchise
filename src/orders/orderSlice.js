import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiPost } from "../services/apiHelpers";

/* ================= SAVE ORDER ================= */

export const saveOrder = createAsyncThunk(
  "orders/saveOrder",
  async (payload) => {
    const res = await apiPost("/orders", payload);
    return res.data.data;
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveOrder.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;
