const router= require('express').Router();
const productController = require('../controllers/productControllers')


router.post('/create', productController.createProduct)

//fetch all products
router.get('/get_all_products',productController.getAllProducts)
//pagination
router.get('/pagination',productController.paginationProducts)

router.get('/get_single_product/:id',productController.getSingleProduct)

router.delete('/delete_product/:id', productController.deleteProduct)


//pagination
router.get('/pagination', productController.paginationProducts)



// exporting the router
module.exports = router