const path = require("path");
const productModel = require("../models/productModel");
const fs = require("fs");

const createProduct = async (req, res) => {
  const {
    productName,
    productPrice,
    productCategory,
    productDescription,
    ratings,
    inStock,
    user,
  } = req.body;

  if (
    !productName ||
    !productPrice ||
    !productCategory ||
    !productDescription
  ) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields",
    });
  }

  if (!req.files || !req.files.productImage) {
    return res.status(400).json({
      success: false,
      message: "Image not found",
    });
  }

  const { productImage } = req.files;
  const imageName = `${Date.now()}-${productImage.name}`;
  const imageUploadPath = path.join(
    __dirname,
    `../public/products/${imageName}`
  );

  try {
    // Check if the directory exists, if not, create it
    const directoryPath = path.join(__dirname, "../public/products");
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    await productImage.mv(imageUploadPath);

    const newProduct = new productModel({
      productName,
      productPrice,
      productCategory,
      productDescription,
      ratings,
      inStock,
      productImage: imageName,
      user: user || null,
    });

    const product = await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

//allProductsForHome
const viewAllProducts = async (req, res, next) => {
  try {
    const products = await productModel.find();
    res.status(200).json({
      success: true,
      message: "all products found",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//singleProductDetails
const viewSingleProductDetails = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "product not found",
        data: product,
      });
    }
    res.status(200).json({
      success: true,
      message: "product not found",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Fetch all products(By Admin)
const getAllProducts = async (req, res) => {
  //try catch
  try {
    const allProducts = await productModel.find({});
    res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      products: allProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Interval server error",
      error: error,
    });
  }
};

// fetch single products
const getSingleProduct = async (req, res) => {
  const productId = req.params.id;

  //find
  try {
    const product = await productModel.findById(productId);
    if (!product) {
      res.status(400).json({
        success: false,
        message: "No Product Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product fetched",
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Interval server error",
      error: error,
    });
  }
};

//---------------------------------------delete product-------------------------------------------------
const deleteProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.status(201).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};
// ----------------------------------------------------------------------------------------

// <----------------------------------------update product-------------------------------->
// 1. get product id (URL)
// 2. if image :
// 3. New image should be uploadee
// 4. old image should be deleted
//  5. final product (database) product image
//  6. find that image in directory
//  7. Delete the image
// 8. Update that product

const updateProduct = async (req, res) => {
  try {
    //if there is image
    if (req.files && req.files.productImage) {
      //Destructuring
      const { productImage } = req.files;

      //upload image to /public/products folder
      // 1. Generate new image name (abc.png) -> (21324-abc.png)
      const imageName = `${Date.now()}-${productImage.name}`;

      // 2. Make a upload path(/path/upload- directory)
      const imageUploadPath = path.join(
        __dirname,
        `../public/products/${imageName}`
      );

      //Move to folder
      await productImage.mv(imageUploadPath);

      //req.params (id), req.body(updated data : pm, pp, pc, pd), req.files(image)
      //add new field to req.body (productImage -> name)
      req.body.productImage = imageName; //image uploaded (generated name)

      //if image is uploaded and req.body is assingned
      if (req.body.productImage) {
        // finding existing product
        const existingProduct = await productModel.findById(req.params.id);

        //searching in the directory/folder
        const oldImagePath = path.join(
          __dirname,
          `../public/products/${existingProduct.productImage}`
        );

        // delete from file system
        fs.unlinkSync(oldImagePath);
      }
    }

    // update the data
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.status(201).json({
      success: true,
      message: "Product updated !",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

// Pagination

const paginationProducts = async (req, res) => {
  // page no
  const pageNo = req.query.page || 1;

  // result per page
  const resultPerPage = req.query.limit || 6;

  try {
    // find all products, skip, limit
    const products = await productModel
      .find({})
      .skip((pageNo - 1) * resultPerPage)
      .limit(resultPerPage);

    // if page 6 is requested, result 0
    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No more products",
      });
    }

    // response
    res.status(201).json({
      success: true,
      message: "Products fetched successfully",
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getProductsCount = async (req, res) => {
  try {
    const productsCount = await productModel.countDocuments();
    res.status(201).json({
      success: true,
      count: productsCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//create and update review
const createProductReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      rating: Number(rating),
      comment,
    };

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "productID not found",
      });
    }

    if (!product.reviews) {
      product.reviews = [];
    }

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "review submit successfully!",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all reviews of a products
const getProductReviews = async (req, res) => {
  try {
    const product = await productModel.findById(req.query.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "productID not found",
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
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
  getProductReviews,
};
