const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const franchiseSchema = new mongoose.Schema(
  {

      _id: {
      type: String,
      default: uuidv4,
    },
    franchiseCode: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    ownerName: {
      type: String,
      required: true,
    },

    phone: String,

    address: String,

    city: String,
    state: String,

    isActive: {
      type: Boolean,
      default: true,
    },

    /* ===== CRM / LOYALTY CONFIG (editable by superadmin) ===== */

    // ₹ amount a customer must spend to earn 1 loyalty point
    pointsPerAmount: {
      type: Number,
      default: 20,
    },

    // loyalty points required for a customer to become reward eligible
    rewardThreshold: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Franchise", franchiseSchema);
