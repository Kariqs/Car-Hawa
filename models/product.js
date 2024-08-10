const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
  comment: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
});
const productSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  initialPrice: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  deleteUrl: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  reviews: [reviewSchema],
});

module.exports = mongoose.model("Product", productSchema);
