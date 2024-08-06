// Importing mongoose package
const mongoose = require("mongoose");

// Creating a schema
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
    maxLength: 700,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  inStock: {
    type: Number,
    default: 0,
  },
  productImage: {
    type: String,
    required: true,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Creating a model
const Product = mongoose.model("products", productSchema);

// Exporting the model
module.exports = Product;
