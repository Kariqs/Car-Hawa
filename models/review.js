const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  productId: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Reviews", reviewSchema);
