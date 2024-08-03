const express = require("express");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  paginationProducts,
  getProductsCount,
  viewAllProducts,
  viewSingleProductDetails,
  createProductReview,
} = require("../controllers/productControllers");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/allProducts", viewAllProducts);
router.get("/single-productDetail/:id", viewSingleProductDetails);
router.post("/create", createProduct);
router.get("/get_all_products", getAllProducts);
router.get("/get_single_product/:id", getSingleProduct);
router.put("/update_product/:id", updateProduct);
router.delete("/delete-product/:id", deleteProduct);
router.get("/pagination", paginationProducts);
router.get("/count", getProductsCount);
//add update reviews product
router.route("/add/reviews").put(auth, createProductReview);

module.exports = router;
