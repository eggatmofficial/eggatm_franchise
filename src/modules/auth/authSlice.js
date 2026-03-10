import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI } from "./authAPI";
import { jwtDecode } from "jwt-decode";

// ✅ Restore user from token
const token = localStorage.getItem("token");

let userFromToken = null;

if (token) {
  try {
    const decoded = jwtDecode(token);

    userFromToken = {
      id: decoded.id,
      role: decoded.role,
      franchiseId: decoded.franchiseId,
    };
  } catch (error) {
    localStorage.removeItem("token");
  }
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await loginAPI(payload);

      localStorage.setItem("token", res.data.data.token);

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromToken,   // ✅ restored user
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
