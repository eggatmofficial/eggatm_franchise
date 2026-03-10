const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const ROLES = require("../../common/constants/roles.constant");

const userSchema = new mongoose.Schema(
  {

       _id: {
      type: String,
      default: uuidv4,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: [ROLES.SUPERADMIN, ROLES.FRANCHISE, ROLES.STAFF],
      required: true,
    },

     franchiseId: {
      type: String,
      ref: "Franchise",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
