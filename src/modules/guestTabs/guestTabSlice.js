import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "../../services/apiHelpers";

/* ================================
   GET ALL TABS OF SESSION
================================ */
export const fetchGuestTabs = createAsyncThunk(
  "guestTabs/fetch",
  async (sessionId) => {
    const res = await apiGet(`/guestTabs/session/${sessionId}`);
    console.log('guset fetch',res.data);
    
    return res.data.data;
  }
);

/* ================================
   CREATE NEW TAB
================================ */
export const createGuestTab = createAsyncThunk(
  "guestTabs/create",
  async (payload) => {
    const res = await apiPost("/guestTabs", payload);
    return res.data.data;
  }
);

const slice = createSlice({
  name: "guestTabs",

  initialState: {
    tabs: [],
    activeTab: null,
    loading: false,
  },

  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchGuestTabs.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchGuestTabs.fulfilled, (s, a) => {
        s.loading = false;
        s.tabs = a.payload;

        // auto select first tab
        if (a.payload.length > 0) {
          s.activeTab = a.payload[0];
        }
      })

      /* CREATE */
      .addCase(createGuestTab.fulfilled, (s, a) => {
        s.tabs.push(a.payload);
        s.activeTab = a.payload; // switch automatically
      });
  },
});

export const { setActiveTab } = slice.actions;
export default slice.reducer;
