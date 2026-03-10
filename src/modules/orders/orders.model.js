const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

/* ================= ITEM SCHEMA ================= */

const orderItemSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4, // ✅ UUID instead of ObjectId
    },

    menuId: {
      type: String,
      required: true,
    },

    name: String,
    price: Number,
    qty: Number,
    image: String,
    costPrice: Number,
    
  },
  {
    _id: false, // ❗ disable mongoose auto ObjectId
  }
);

/* ================= ORDER SCHEMA ================= */

const orderSchema = new mongoose.Schema(
{
  _id: {
    type: String,
    default: uuidv4,
  },

  sessionId: {
    type: String,
    required: true,
    index: true,
  },

  tableId: {
    type: String,
    required: true,
  },

  tabId: {              
    type: String,
    required: true,
    index: true,
  },
   franchiseId: {      
    type: String,
    required: true,
    index: true,
  },

  createdBy: {
  type: String,
  required: true,
},

   clientOrderId: {
      type: String,
      unique: true,
      sparse: true,
    },

  items: [orderItemSchema],

  totalAmount: Number,

  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
