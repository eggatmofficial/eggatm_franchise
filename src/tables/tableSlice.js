// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { apiGet, apiPost, apiDelete, apiPut } from "../services/apiHelpers";

// /* ================= FETCH ================= */

// export const fetchTables = createAsyncThunk(
//   "tables/fetch",
//   async () => {
//     const res = await apiGet("/tables");
//     return res.data.data;
//   }
// );

// /* ================= CREATE ================= */

// export const createTable = createAsyncThunk(
//   "tables/create",
//   async (payload) => {
//     const res = await apiPost("/tables", payload);
//     return res.data.data;
//   }
// );

// /* ================= UPDATE ================= */

// export const updateTable = createAsyncThunk(
//   "tables/update",
//   async ({ id, payload }) => {
//     const res = await apiPut(`/tables/${id}`, payload);
//     return res.data.data;
//   }
// );

// /* ================= DELETE ================= */

// export const deleteTable = createAsyncThunk(
//   "tables/delete",
//   async (id) => {
//     await apiDelete(`/tables/${id}`);
//     return id;
//   }
// );

// const tableSlice = createSlice({
//   name: "tables",
//   initialState: {
//     tables: [],
//     loading: false,
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchTables.pending, (state) => {
//         state.loading = true;
//       })

//       .addCase(fetchTables.fulfilled, (state, action) => {
//         state.loading = false;
//         state.tables = action.payload;
//       })

//       .addCase(createTable.fulfilled, (state, action) => {
//         state.tables.push(action.payload);
//       })

//       .addCase(updateTable.fulfilled, (state, action) => {
//         const index = state.tables.findIndex(
//           t => t._id === action.payload._id
//         );
//         if (index !== -1) {
//           state.tables[index] = action.payload;
//         }
//       })

//       .addCase(deleteTable.fulfilled, (state, action) => {
//         state.tables = state.tables.filter(
//           t => t._id !== action.payload
//         );
//       });
//   },
// });

// export default tableSlice.reducer;





import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGet,
  apiPost,
  apiDelete,
  apiPut
} from "../services/apiHelpers";

/* ================= FETCH ALL ================= */

export const fetchTables = createAsyncThunk(
  "tables/fetch",
  async () => {
    const res = await apiGet("/tables");
    return res.data.data;
  }
);

/* ================= FETCH SINGLE TABLE ⭐ ================= */

export const fetchSingleTable = createAsyncThunk(
  "tables/fetchOne",
  async (id) => {
    const res = await apiGet(`/tables/${id}`);
    return res.data.data;
  }
);

/* ================= CREATE ================= */

export const createTable = createAsyncThunk(
  "tables/create",
  async (payload) => {
    const res = await apiPost("/tables", payload);
    return res.data.data;
  }
);

/* ================= UPDATE ================= */

export const updateTable = createAsyncThunk(
  "tables/update",
  async ({ id, payload }) => {
    const res = await apiPut(`/tables/${id}`, payload);
    return res.data.data;
  }
);

/* ================= DELETE ================= */

export const deleteTable = createAsyncThunk(
  "tables/delete",
  async (id) => {
    await apiDelete(`/tables/${id}`);
    return id;
  }
);

/* ================= SLICE ================= */

const tableSlice = createSlice({
  name: "tables",

  initialState: {
    tables: [],
    selectedTable: null,   // ⭐ IMPORTANT
    loading: false,
  },

  extraReducers: (builder) => {
    builder

      /* FETCH ALL */
      .addCase(fetchTables.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchTables.fulfilled, (state, action) => {
        state.loading = false;
        state.tables = action.payload;
      })

      /* FETCH ONE ⭐ */
      .addCase(fetchSingleTable.fulfilled, (state, action) => {
        state.selectedTable = action.payload;
      })

      /* CREATE */
      .addCase(createTable.fulfilled, (state, action) => {
        state.tables.push(action.payload);
      })

      /* UPDATE */
      .addCase(updateTable.fulfilled, (state, action) => {
        const index = state.tables.findIndex(
          t => t._id === action.payload._id
        );

        if (index !== -1) {
          state.tables[index] = action.payload;
        }
      })

      /* DELETE */
      .addCase(deleteTable.fulfilled, (state, action) => {
        state.tables = state.tables.filter(
          t => t._id !== action.payload
        );
      });
  },
});

export default tableSlice.reducer;
