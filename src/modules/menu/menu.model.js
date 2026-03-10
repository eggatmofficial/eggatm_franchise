const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const menuSchema = new mongoose.Schema(
{
  _id: {
    type: String,
    default: uuidv4,
  },

  franchiseId: String,

  name: String,

  price: Number,

  category: String,

  image: String,        // image url
  imagePublicId: String, // ⭐ needed for delete

 costPrice: {
  type: Number,
  default: 0
},


  isAvailable: {
    type: Boolean,
    default: true,
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);
