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

  franchiseId: { type: String, ref: "Franchise" },

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

  isContact: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  },

  cardUrl: {
    type: String,
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
