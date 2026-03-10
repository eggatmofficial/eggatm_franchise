const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const tableSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },

    franchiseId: {
      type: String, // UUID reference
      required: true,
      index: true,
    },

    tableNumber: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      default: 4,
    },

    status: {
      type: String,
      enum: ["available", "occupied", "billing"],
      default: "available",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* ✅ Prevent duplicate table number inside same franchise */
tableSchema.index(
  { franchiseId: 1, tableNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("Table", tableSchema);
