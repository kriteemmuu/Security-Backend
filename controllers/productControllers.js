const path = require("path");
const ProductModel = require("../models/productModel");

const createProduct = async (req, res) => {
    // Check incoming data
    console.log(req.body);
    console.log(req.files);

    // Destructuring the body data
    const { productName, productPrice, productCategory, productDescription } = req.body;

    // Validation
    if (!productName || !productPrice || !productCategory || !productDescription) {
        return res.status(400).json({
            success: false,
            message: "Please enter all  fields!",
        });
    }

    // Validate if there is an image
    if (!req.files || !req.files.productImage) {
        return res.status(400).json({
            success: false,
            message: "Image not found!",
        });
    }

    const { productImage } = req.files;
    
    // Upload image
    // 1. Generate new image name (abc.png) -> need to change to sthg like (213-qbc.png)
    const imageName = `${Date.now()}-${productImage.name}`;
    
    // 2. Make an upload path (/path/upload-directory)
    const imageUploadPath = path.join(__dirname, `../public/products/${imageName}`);
    
    // 3. Move to that directory (await, try-catch)
    try {
        await productImage.mv(imageUploadPath);

        // Save to database
        const newProduct = new ProductModel({
            productName: productName,
            productPrice: productPrice,
            productCategory: productCategory,
            productDescription: productDescription,
            productImage: imageName,
        });

        const product = await newProduct.save();
        res.status(201).json({
            success: true,
            message: "Product created successfully!",
            data: product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: error,
        });
    }
};

// Fetch all products
const getAllProducts = async (req, res) => {
    try {
        const allProducts = await ProductModel.find({});
        res.status(201).json({
            success: true,
            message: "Products successfully fetched",
            products: allProducts,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
};
