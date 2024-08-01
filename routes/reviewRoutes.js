const express = require("express");
const { getReviews, submitReview } = require("../controllers/reviewControllers");
const {  auth } = require("../middleware/auth");
 
const router = express.Router();
 
router.get("/:productId", getReviews);
router.post("/", auth, submitReview);
 
module.exports = router;
 
