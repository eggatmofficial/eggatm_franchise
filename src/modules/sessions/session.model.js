const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const sessionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },

    tableId: {
      type: String, // UUID reference
      ref: "Table",
      required: true,
      index: true,
    },

    franchiseId: {
      type: String,
      required: true,
      index: true,
    },

    startedBy: {
      type: String, // user UUID
      ref: "User",
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    closedAt: Date,
  },
  { timestamps: true }
);

/* One active session per table */
sessionSchema.index(
  { tableId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "active" } }
);

module.exports = mongoose.model("Session", sessionSchema);
