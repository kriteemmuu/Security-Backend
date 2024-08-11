const express = require("express");
const {
  newOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getSingleOrder,
  getSingleOrderByAdmin,
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
router.put("/update-orderStatus", auth, authAdmin, updateOrder);
//admin can delete Order
router.delete("/delete-order", auth, authAdmin, deleteOrder);

//get single order By admin
router.get("/single-order-admin/:id", auth, authAdmin, getSingleOrderByAdmin);

module.exports = router;
