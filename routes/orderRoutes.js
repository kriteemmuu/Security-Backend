const express = require("express");
const { newOrder } = require("../controllers/orderControllers");
const { auth } = require("../middleware/auth");
const Router = express.Router();

//createOrder
Router.post("/create-Order", auth, newOrder);

module.exports = Router;
