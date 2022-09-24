const mongoose = require("mongoose");
const geocoder = require('../utils/geocoder');

const ItemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: [true, 'Please add an itemName'],
    unique: true,
    trim: true,
    maxlength: [30, 'Farm ID must be less than 10 chars']
  },
  itemDescription: {
    type: String,
    required: [true, 'Please describe the item'],
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});




module.exports = mongoose.model('Item', ItemSchema);
