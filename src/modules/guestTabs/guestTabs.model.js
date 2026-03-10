const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const guestTabSchema = new mongoose.Schema(
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
    index: true,
  },

  guestName: {
    type: String,
    default: "Guest",
  },

  totalAmount: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    enum: ["active", "paid"],
    default: "active",
  },

  isActive: {
    type: Boolean,
    default: true,
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("GuestTab", guestTabSchema);
