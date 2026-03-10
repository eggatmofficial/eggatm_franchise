const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    _id: String,

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

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "paid", "cancelled"],
      default: "pending",
    },

    requestedBy: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentRequest", schema);
