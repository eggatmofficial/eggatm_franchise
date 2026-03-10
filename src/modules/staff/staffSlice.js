import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/apiHelpers";

/* GET STAFF */
export const fetchStaff = createAsyncThunk(
  "staff/fetchAll",
  async () => {
    const res = await apiGet("/staff");
    return res.data.data;
  }
);

/* CREATE */
export const createStaff = createAsyncThunk(
  "staff/create",
  async (payload) => {
    const res = await apiPost("/staff", payload);
    return res.data.data;
  }
);

/* UPDATE */
export const updateStaff = createAsyncThunk(
  "staff/update",
  async ({ id, payload }) => {
    const res = await apiPut(`/staff/${id}`, payload);
    return res.data.data;
  }
);

/* DELETE */
export const deleteStaff = createAsyncThunk(
  "staff/delete",
  async (id) => {
    console.log("THUNK CALLED", id);
    await apiDelete(`/staff/${id}`);
    console.log("API FINISHED");
    return id;
  }
);

const staffSlice = createSlice({
  name: "staff",
  initialState: {
    staff: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = action.payload;
      })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.staff.unshift(action.payload);
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        const i = state.staff.findIndex(
          s => s._id === action.payload._id
        );
        if (i !== -1) state.staff[i] = action.payload;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.staff = state.staff.filter(
          s => s._id !== action.payload
        );
      });
  },
});

export default staffSlice.reducer;
