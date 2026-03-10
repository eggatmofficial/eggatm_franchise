const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const customerSchema = new mongoose.Schema({

  _id: {
    type: String,
    default: uuidv4   
  },

  name: String,

  phone: {
    type: String,
    required: true,
    unique:true,
    index: true
  },

  franchiseId: String,

  loyaltyPoints: {
    type: Number,
    default: 0
  },

  rewardEligible: {
    type: Boolean,
    default: false
  },

  rewardsRedeemed: {
    type: Number,
    default: 0
  },

}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
