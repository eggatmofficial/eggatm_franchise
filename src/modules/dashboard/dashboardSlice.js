

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { apiGet } from "../../services/apiHelpers";

// export const fetchStaffDashboard = createAsyncThunk(
//   "dashboard/staff",
//   async () => {
//     const res = await apiGet("/dashboard/staff");
//     return res.data.data;
//   }
// );

// const dashboardSlice = createSlice({
//   name: "dashboard",
//   initialState: {
//     stats: {
//       activeTables: 0,
//       ordersToday: 0,
//       guestsServed: 0,
//       salesHandled: 0,
//     },
//     loading: false,
//   },

//   extraReducers: builder => {
//     builder
//       .addCase(fetchStaffDashboard.pending, state => {
//         state.loading = true;
//       })
//       .addCase(fetchStaffDashboard.fulfilled, (state, action) => {
//         state.loading = false;
//         state.stats = action.payload;
//       })
//       .addCase(fetchStaffDashboard.rejected, state => {
//         state.loading = false;
//       });
//   },
// });

// export default dashboardSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet } from "../../services/apiHelpers";

/* ======================================================
   STAFF DASHBOARD
====================================================== */

export const fetchStaffDashboard = createAsyncThunk(
  "dashboard/staff",
  async () => {
    const res = await apiGet("/dashboard/staff");
    return res.data.data;
  }
);

/* ======================================================
   FRANCHISE DASHBOARD
====================================================== */

// export const fetchFranchiseDashboard = createAsyncThunk(
//   "dashboard/franchise",
//   async () => {
//     const res = await apiGet("/dashboard/franchise");
//     console.log("franchise response:", res.data.data);
//     return res.data.data;
//   }
// );

export const fetchFranchiseDashboard = createAsyncThunk(
  "dashboard/franchise",
  async (params = {}) => {

    const query = new URLSearchParams(params).toString();

    const res = await apiGet(`/dashboard/franchise?${query}`);

    console.log("franchise response:", res.data.data);

    return res.data.data;
  }
);

/* ======================================================
   SUPER ADMIN DASHBOARD
====================================================== */

// export const fetchSuperAdminDashboard = createAsyncThunk(
//   "dashboard/superadmin",
//   async () => {
//     const res = await apiGet("/dashboard/superadmin");
//     return res.data.data;
//   }
// );

// In your dashboardSlice.js, update the fetchSuperAdminDashboard thunk:

export const fetchSuperAdminDashboard = createAsyncThunk(
  "dashboard/superadmin",
  async (filters = {}) => {
    // Convert filters to query string
    const queryParams = new URLSearchParams();
    
    if (filters.year) queryParams.append('year', filters.year);
    if (filters.month) queryParams.append('month', filters.month);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.franchiseId) queryParams.append('franchiseId', filters.franchiseId);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/dashboard/superadmin?${queryString}` : "/dashboard/superadmin";
    
    const res = await apiGet(url);
    return res.data.data;
  }
);

/* ======================================================
   SLICE
====================================================== */

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState: {
    loading: false,

    staffStats: {
      activeTables: 0,
      ordersToday: 0,
      guestsServed: 0,
      salesHandled: 0,
    },

    franchiseStats: {
      revenue: {
        dailyRevenue: 0,
        weeklyRevenue: 0,
        monthlyRevenue: 0,
      },
      topSelling: [],
      lowSelling: [],
    },
    /* ===== SUPER ADMIN ===== */
    superAdminStats: {
      totalFranchises: 0,
      franchises: [],
    },
  },

  

  extraReducers: (builder) => {
    builder

      /* ===== STAFF ===== */
      .addCase(fetchStaffDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStaffDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.staffStats = action.payload;
      })
      .addCase(fetchStaffDashboard.rejected, (state) => {
        state.loading = false;
      })

      /* ===== FRANCHISE ===== */
      .addCase(fetchFranchiseDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFranchiseDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.franchiseStats = action.payload;
      })
      .addCase(fetchFranchiseDashboard.rejected, (state) => {
        state.loading = false;
      })

       /* ================= SUPER ADMIN ================= */
      .addCase(fetchSuperAdminDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSuperAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.superAdminStats = action.payload;
      })
      .addCase(fetchSuperAdminDashboard.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default dashboardSlice.reducer;
