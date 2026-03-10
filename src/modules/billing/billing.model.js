const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

/* =====================================================
   BILL ITEM SCHEMA (each item has UUID)
===================================================== */

const billItemSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4, // ✅ UUID for each item
    },

    menuId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    qty: {
      type: Number,
      required: true,
      default: 1,
    },

    /* OPTIONAL POS FEATURES */

    status: {
      type: String,
      default: "ordered", // ordered | preparing | served | cancelled
    },

    notes: String, // special instructions

    subtotal: {
      type: Number,
      default: 0,
    },
  },
  { _id: false } // ❗ prevents Mongo ObjectId duplication
);

/* =====================================================
   BILL SCHEMA
===================================================== */

const billSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4, // ✅ Bill UUID
    },

    sessionId: {
      type: String,
      required: true,
    },

    tableId: {
      type: String,
      required: true,
    },

    tabId: {
      type: String,
      required: true,
    },

    franchiseId: {
      type: String,
      required: true,
    },

    billNumber: {
      type: String,
      required: true,
    },

    /* ================= ITEMS ================= */

    items: [billItemSchema],

    /* ================= BILL TOTALS ================= */

    subTotal: {
      type: Number,
      default: 0,
    },

    taxAmount: {
      type: Number,
      default: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    /* ================= PAYMENT ================= */

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi"],
      default: "cash",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    
    printStatus: {
    type: String,
    enum: ["pending", "printed"],
    default: "pending"
    },
    customerId: {
    type: String,
    default: null
    },
    
    totalCost: {
    type: Number,
    default: 0
    },

    totalProfit: {
    type: Number,
    default: 0
    },


    /* ================= AUDIT ================= */

    generatedBy: String, // staffId

    status: {
      type: String,
      enum: ["generated", "paid", "cancelled"],
      default: "generated",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bill", billSchema);
