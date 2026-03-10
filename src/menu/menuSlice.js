import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost, apiPut, apiDelete } from "../services/apiHelpers";

/* ================= FETCH ================= */

export const fetchMenu = createAsyncThunk(
  "menu/fetch",
  async () => {
    const res = await apiGet("/menu");
     console.log("MENU API RESPONSE:", res.data);
    return res.data.data;
  }
);

/* ================= CREATE ================= */

export const createMenu = createAsyncThunk(
  "menu/create",
  async (payload) => {

    const fd = new FormData();

    fd.append("name", payload.name);
    fd.append("category", payload.category);
    fd.append("price", String(payload.price));
    fd.append("isAvailable", payload.isAvailable);
    fd.append("costPrice", payload.costPrice);

    if (payload.image instanceof File) {
      fd.append("image", payload.image);
    }

    // ❌ REMOVE HEADERS
    const res = await apiPost("/menu", fd);

    return res.data.data;
  }
);




/* ================= UPDATE ================= */
export const updateMenu = createAsyncThunk(
  "menu/update",
  async ({ id, payload }) => {

    const fd = new FormData();

    fd.append("name", payload.name);
    fd.append("category", payload.category);
    fd.append("price", String(payload.price));
    fd.append("isAvailable", payload.isAvailable);
    fd.append("costPrice", payload.costPrice);

    if (payload.image instanceof File) {
      fd.append("image", payload.image);
    }

    const res = await apiPut(`/menu/${id}`, fd);

    return res.data.data;
  }
);



/* ================= DELETE ================= */

export const deleteMenu = createAsyncThunk(
  "menu/delete",
  async (id) => {
    await apiDelete(`/menu/${id}`);
    return id;
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    items: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        const i = state.items.findIndex(
          m => m._id === action.payload._id
        );
        if (i !== -1) state.items[i] = action.payload;
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.items = state.items.filter(
          m => m._id !== action.payload
        );
      });
  },
});

export default menuSlice.reducer;
