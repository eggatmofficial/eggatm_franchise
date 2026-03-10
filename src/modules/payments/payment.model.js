const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    _id: String,

    sessionId: String,
    tableId: String,
    tabId: String,

    amount: Number,

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi"],
      required: true,
    },

    collectedBy: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", schema);
