// const router= require('express').Router();
// const productController = require('../controllers/productControllers')


// router.post('/create', productController.createProduct)

// //fetch all products
// router.get('/get_all_products',productController.getAllProducts)


// router.get('/get_single_product/:id',productController.getSingleProduct)

// router.delete('/delete_product/:id', productController.deleteProduct)

// //pagination
// router.get('/pagination', productController.paginationProducts)



// // exporting the router
// module.exports = router

const express = require("express");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct, // Add the updateProduct controller
  paginationProducts,
  getProductsCount
} = require("../controllers/productControllers");
const router = express.Router();

router.post("/create", createProduct);
router.get("/get_all_products", getAllProducts);
router.get("/get_single_product/:id", getSingleProduct); // Update this route
router.put("/update_product/:id", updateProduct); // Ensure this route is added
router.delete("/delete-product/:id", deleteProduct);
router.get("/pagination", paginationProducts);
router.get("/count", getProductsCount);

module.exports = router;