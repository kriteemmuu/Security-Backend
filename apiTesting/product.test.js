const mongoose = require("mongoose");
const Product = require("../models/productModel"); // Adjust this path as necessary

const url = "mongodb://localhost:27017/DivaE-Commerce";

beforeAll(async () => {
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Product Schema Test Suite", () => {
  it("should create a product successfully", async () => {
    const productData = {
      productName: "Maternity Maxi Dress",
      productPrice: 49.99,
      productCategory: "Dresses",
      productDescription: "Comfortable maxi dress, perfect for all stages of pregnancy.",
      ratings: 4.5,
      inStock: 10,
      productImage: "path/to/image.jpg"
    };

    const createdProduct = await Product.create(productData);

    expect(createdProduct.productName).toEqual("Maternity Maxi Dress");
    expect(createdProduct.productPrice).toEqual(49.99);
    expect(createdProduct.productCategory).toEqual("Dresses");
    expect(createdProduct.productDescription).toEqual("Comfortable maxi dress, perfect for all stages of pregnancy.");
    expect(createdProduct.ratings).toEqual(4.5);
    expect(createdProduct.inStock).toEqual(10);
  });

  it("should update a product's price successfully", async () => {
    const product = await Product.findOne(); // Fetching the first product for testing
    const updatedProduct = await Product.findByIdAndUpdate(product._id, {
      $set: { productPrice: 39.99 }
    }, { new: true });

    expect(updatedProduct.productPrice).toEqual(39.99);
  });

  it("should delete a product successfully", async () => {
    const product = await Product.findOne(); // Assuming there's at least one product
    const deleteResult = await Product.findByIdAndDelete(product._id);

    expect(deleteResult._id.toString()).toEqual(product._id.toString());

    const deletedProduct = await Product.findById(product._id);
    expect(deletedProduct).toBeNull();
  });
});
