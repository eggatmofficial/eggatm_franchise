// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "../../services/apiHelpers";

// export const fetchFranchises = createAsyncThunk(
//   "franchise/fetchAll",
//   async () => {
//     const res = await apiGet("/franchise");
//     return res.data.data;
//   }
// );

// export const createFranchise = createAsyncThunk(
//   "franchise/create",
//   async (payload) => {
//     const res = await apiPost("/franchise", payload);
//     return res.data.data;
//   }
// );

// export const updateFranchise = createAsyncThunk(
//   "franchise/update",
//   async ({ id, payload }) => {
//     const res = await apiPut(`/franchise/${id}`, payload);
//     return res.data;
//   }
// );

// export const deleteFranchise = createAsyncThunk(
//   "franchise/delete",
//   async (id) => {
//     await apiDelete(`/franchise/${id}`);
//     return id;
//   }
// );

// export const toggleFranchiseStatus = createAsyncThunk(
//   "franchise/toggleStatus",
//   async ({ id, isActive }) => {

//     const res = await apiPatch(
//       `/franchise/${id}/status`,
//       { isActive }   
//     );

//     return res.data.data;
//   }
// );


// const franchiseSlice = createSlice({
//   name: "franchise",
//   initialState: {
//     franchises: [],
//     loading: false,
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchFranchises.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchFranchises.fulfilled, (state, action) => {
//         state.loading = false;
//         state.franchises = action.payload;
//       })
//       .addCase(createFranchise.fulfilled, (state, action) => {
//         state.franchises.unshift(action.payload);
//       })
//       .addCase(updateFranchise.fulfilled, (state, action) => {
//         const index = state.franchises.findIndex(
//           (f) => f._id === action.payload._id
//         );
//         if (index !== -1) {
//           state.franchises[index] = action.payload;
//         }
//       })
//       .addCase(deleteFranchise.fulfilled, (state, action) => {
//         state.franchises = state.franchises.filter(
//           (f) => f._id !== action.payload
//         );
//       })
//       // NEW: Handle toggle status
//       .addCase(toggleFranchiseStatus.fulfilled, (state, action) => {
//         const index = state.franchises.findIndex(
//           (f) => f._id === action.payload._id
//         );
//         if (index !== -1) {
//           state.franchises[index] = action.payload;
//         }
//       });
//   },
// });

// export default franchiseSlice.reducer;







import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "../../services/apiHelpers";

export const fetchFranchises = createAsyncThunk(
  "franchise/fetchAll",
  async () => {
    const res = await apiGet("/franchise");
    return res.data.data; // Now includes email field
  }
);

export const fetchFranchiseById = createAsyncThunk(
  "franchise/fetchById",
  async (id) => {
    const res = await apiGet(`/franchise/${id}`);
    return res.data.data;
  }
);

export const createFranchise = createAsyncThunk(
  "franchise/create",
  async (payload) => {
    const res = await apiPost("/franchise", payload);
    return res.data.data; // Returns franchise with email
  }
);

export const updateFranchise = createAsyncThunk(
  "franchise/update",
  async ({ id, payload }) => {
    const res = await apiPut(`/franchise/${id}`, payload);
    return res.data.data; // Returns updated franchise with email
  }
);

export const deleteFranchise = createAsyncThunk(
  "franchise/delete",
  async (id) => {
    await apiDelete(`/franchise/${id}`);
    return id;
  }
);

export const toggleFranchiseStatus = createAsyncThunk(
  "franchise/toggleStatus",
  async ({ id, isActive }) => {
    const res = await apiPatch(`/franchise/${id}/status`, { isActive });
    return res.data.data; // Returns updated franchise with email
  }
);

const franchiseSlice = createSlice({
  name: "franchise",
  initialState: {
    franchises: [],
    currentFranchise: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentFranchise: (state) => {
      state.currentFranchise = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchFranchises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFranchises.fulfilled, (state, action) => {
        state.loading = false;
        state.franchises = action.payload;
      })
      .addCase(fetchFranchises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Fetch By Id
      .addCase(fetchFranchiseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFranchiseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFranchise = action.payload;
      })
      .addCase(fetchFranchiseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Create
      .addCase(createFranchise.fulfilled, (state, action) => {
        state.franchises.unshift(action.payload);
      })
      
      // Update
      .addCase(updateFranchise.fulfilled, (state, action) => {
        const index = state.franchises.findIndex(
          (f) => f._id === action.payload._id
        );
        if (index !== -1) {
          state.franchises[index] = action.payload;
        }
        if (state.currentFranchise?._id === action.payload._id) {
          state.currentFranchise = action.payload;
        }
      })
      
      // Delete
      .addCase(deleteFranchise.fulfilled, (state, action) => {
        state.franchises = state.franchises.filter(
          (f) => f._id !== action.payload
        );
        if (state.currentFranchise?._id === action.payload) {
          state.currentFranchise = null;
        }
      })
      
      // Toggle Status
      .addCase(toggleFranchiseStatus.fulfilled, (state, action) => {
        const index = state.franchises.findIndex(
          (f) => f._id === action.payload._id
        );
        if (index !== -1) {
          state.franchises[index] = action.payload;
        }
        if (state.currentFranchise?._id === action.payload._id) {
          state.currentFranchise = action.payload;
        }
      });
  },
});

export const { clearCurrentFranchise } = franchiseSlice.actions;
export default franchiseSlice.reducer;