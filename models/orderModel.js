const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    province: {
      type: String,
    },
    country: {
      type: String,
    },
    postalCode: {
      type: Number,
    },
    phoneNo: {
      type: Number,
    },
  },
  orderItems: [
    {
      productName: {
        type: String,
      },
      price: {
        type: Number,
      },
      quantity: {
        type: Number,
      },
      productImg: {
        type: String,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "product",
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  paymentInfo: {
    type: String,
  },

  itemsPrice: {
    type: Number,

    default: 0,
  },
  taxPrice: {
    type: Number,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  orderStatus: {
    type: String,
    default: "processing",
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
