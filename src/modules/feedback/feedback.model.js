const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const feedbackSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    phone: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 5,
    },
    comments: {
      type: String,
      default: "",
    },
    franchiseName: {
      type: String,
      default: "Egg! ATM",
    },
    status: {
      type: String,
      default: "NEW",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
