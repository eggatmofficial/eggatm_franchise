// import { createSlice } from "@reduxjs/toolkit";

// const cartSlice = createSlice({
//   name: "cart",
//   initialState: {
//     items: [],
//   },

//   reducers: {

//     addToCart: (state, action) => {
//       const exist = state.items.find(
//         i => i._id === action.payload._id
//       );

//       if (exist) {
//         exist.qty += 1;
//       } else {
//         state.items.push({
//           ...action.payload,
//           qty: 1,
//         });
//       }
//     },

//     increaseQty: (state, action) => {
//       const item = state.items.find(
//         i => i._id === action.payload
//       );
//       if (item) item.qty++;
//     },

//     decreaseQty: (state, action) => {
//       const item = state.items.find(
//         i => i._id === action.payload
//       );

//       if (!item) return;

//       item.qty--;

//       if (item.qty <= 0) {
//         state.items =
//           state.items.filter(i => i._id !== action.payload);
//       }
//     },

//     clearCart: (state) => {
//       state.items = [];
//     }
//   }
// });

// export const {
//   addToCart,
//   increaseQty,
//   decreaseQty,
//   clearCart
// } = cartSlice.actions;

// export default cartSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    carts: {}, // ⭐ each guest has own cart
  },

  reducers: {

    /* ================= ADD ITEM ================= */
    addToCart: (state, action) => {

      const { tabId, item } = action.payload;

      if (!state.carts[tabId]) {
        state.carts[tabId] = [];
      }

      const existing = state.carts[tabId]
        .find(i => i._id === item._id);

      if (existing) {
        existing.qty += 1;
      } else {
        state.carts[tabId].push({
          ...item,
          qty: 1,
        });
      }
    },

    /* ================= INCREASE ================= */
    increaseQty: (state, action) => {
      const { tabId, id } = action.payload;

      const item = state.carts[tabId]
        ?.find(i => i._id === id);

      if (item) item.qty += 1;
    },

    /* ================= DECREASE ================= */
    decreaseQty: (state, action) => {
      const { tabId, id } = action.payload;

      const cart = state.carts[tabId];
      if (!cart) return;

      const index = cart.findIndex(i => i._id === id);

      if (index !== -1) {
        if (cart[index].qty > 1) {
          cart[index].qty -= 1;
        } else {
          cart.splice(index, 1);
        }
      }
    },

    /* ================= CLEAR CART ================= */
    clearCart: (state, action) => {
      const tabId = action.payload;
      state.carts[tabId] = [];
    },
  },
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
