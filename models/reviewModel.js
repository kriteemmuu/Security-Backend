const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
},{timestamps:true});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
