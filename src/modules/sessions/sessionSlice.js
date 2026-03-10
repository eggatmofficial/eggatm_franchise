import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  startSessionAPI,
  getActiveSessionAPI,
} from "./sessionAPI";

/* START SESSION */
export const startSession = createAsyncThunk(
  "session/start",
  async (tableId) => {
    const res = await startSessionAPI(tableId);
    return res.data.data;
  }
);

/* GET ACTIVE */
export const getActiveSession = createAsyncThunk(
  "session/getActive",
  async (tableId) => {
    const res = await getActiveSessionAPI(tableId);
    return res.data.data;
  }
);

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    current: null,
    loading: false,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(startSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(startSession.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(getActiveSession.fulfilled, (state, action) => {
        state.current = action.payload;
      });
  },
});

export default sessionSlice.reducer;
