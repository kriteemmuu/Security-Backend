const express = require("express");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct, // Add the updateProduct controller
  paginationProducts,
  getProductsCount,
  viewAllProducts,
  viewSingleProductDetails,
} = require("../controllers/productControllers");

const router = express.Router();

router.get("/allProducts", viewAllProducts);
router.get("/single-productDetail/:id", viewSingleProductDetails);
router.post("/create", createProduct);
router.get("/get_all_products",  getAllProducts);
router.get("/get_single_product/:id",  getSingleProduct);
router.put("/update_product/:id",  updateProduct);
router.delete("/delete-product/:id",  deleteProduct);
router.get("/pagination", paginationProducts);
router.get("/count", getProductsCount);

module.exports = router;
