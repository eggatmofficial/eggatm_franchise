import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPatch } from "../../services/apiHelpers";

/* ================= FETCH BILLING QUEUE ================= */

export const fetchPendingBills = createAsyncThunk(
  "payments/fetchPending",
  async () => {
    const res = await apiGet("/payments");
    return res.data.data;
  }
);

/* ================= PAY BILL ================= */

export const payBill = createAsyncThunk(
  "payments/pay",
  async ({ id, method }) => {

    const res = await apiPatch(
      `/payments/${id}/pay`,
      { method }
    );

    return { id, data: res.data.data };
  }
);

const slice = createSlice({
  name: "payments",

  initialState: {
    bills: [],
    loading: false,
  },

  extraReducers: builder => {

    builder
      .addCase(fetchPendingBills.pending, s => {
        s.loading = true;
      })

      .addCase(fetchPendingBills.fulfilled, (s, a) => {
        s.loading = false;
        s.bills = a.payload;
      })

      /* remove bill after payment */
      .addCase(payBill.fulfilled, (s, a) => {
        s.bills = s.bills.filter(
          b => b._id !== a.payload.id
        );
      });
  },
});

export default slice.reducer;
