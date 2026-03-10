import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet } from "../../services/apiHelpers";

/* ================= FETCH REPORTS ================= */

export const fetchReports = createAsyncThunk(
  "reports/fetch",
  async ({ type, page = 1 }) => {
    const res = await apiGet(
      `/orders/reports?type=${type}&page=${page}`
    );

    return res.data.data;
  }
);

const reportSlice = createSlice({
  name: "reports",

  initialState: {
    orders: [],
    summary: {
      totalSales: 0,
      totalBills: 0,
      totalItemsSold: 0,
    },
    pagination: {
      page: 1,
      totalPages: 1,
    },
    loading: false,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;

        state.orders = action.payload.orders || [];
        state.summary = action.payload.summary || {};
        state.pagination =
          action.payload.pagination || {
            page: 1,
            totalPages: 1,
          };
      });
  },
});

export default reportSlice.reducer;
