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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Franchise", franchiseSchema);
