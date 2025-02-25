const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

//create new Order
exports.newOrder = async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    message: "order create successfully!",
    order,
  });
};

//get single orders of Logged Users
exports.getSingleOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "firstName lastName email"
  );

  if (!order)
    return res.status(404).json({
      success: false,
      message: "Order not found!",
    });

  res.status(200).json({
    success: true,
    data: order,
  });
};

//get logged in user Orders
exports.myOrders = async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    data: orders,
  });
};

//get all orders by admin
exports.getAllOrders = async (req, res, next) => {
  const orders = await Order.find().populate("user", "firstName lastName");

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    success: true,
    totalAmount,
    data: orders,
  });
};

//update Order status by admin

exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "OrderId not found!",
      });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Your order has been already placed!",
      });
    }

    if (req.body.status === "Shipped") {
      for (let o of order.orderItems) {
        if (o.product) {
          await updateStock(o.product, o.quantity);
        }
      }
    }

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  if (!product) {
    throw new ErrorHandler("Product not found with this Id", 404);
  }
  product.inStock -= quantity;

  await product.save({ validateBeforeSave: false });
}

//delete Order
exports.deleteOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    return res.status(404).json({
      success: false,
      message: "order not found with this Id",
    });

  await order.remove();
  res.status(200).json({
    success: true,
    message: "order delete successfully!",
  });
};

//get Single Orders By admin
exports.getSingleOrderByAdmin = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "firstName lastName email"
  );

  if (!order)
    return res.status(404).json({
      success: false,
      message: "Order not found!",
    });

  res.status(200).json({
    success: true,
    data: order,
  });
};

//calculate all Modal Stats

exports.getAllStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    const totalIncome = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalIncome: totalIncome.length > 0 ? totalIncome[0].totalIncome : 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.khaltiVerify = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
