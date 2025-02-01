const express = require("express");
const {
  newOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getSingleOrder,
  getSingleOrderByAdmin,
  getAllStats,
} = require("../controllers/orderControllers");
const { auth, authAdmin } = require("../middleware/auth");
const router = express.Router();

//createOrder
router.post("/create-Order", auth, newOrder);
//get Logged In user ORders
router.get("/get-user-orders", auth, myOrders);
// Single Order History
router.get("/single-order/:id", auth, getSingleOrder);

//get all Orders By Admin
router.get("/all-orders", auth, authAdmin, getAllOrders);

//update Order Status By Admin
router.put("/update-orderStatus/:id", auth, authAdmin, updateOrder);
//admin can delete Order
router.delete("/delete-order/:id", auth, authAdmin, deleteOrder);

//get single order By admin
router.get("/single-order-admin/:id", auth, authAdmin, getSingleOrderByAdmin);

//calculate stats
router.get("/get-stats", auth, authAdmin, getAllStats);

//KhaltiPay

module.exports = router;
