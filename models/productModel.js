// const mongoose = require('mongoose')

// const ProductSchema = new mongoose.Schema({
//     productName : {
//         type: String,
//         required : true
//     }, 
//     productPrice : {
//         type: String,
//         required : true
//     },
//     productCategory : {
//         type: String,
//         required : true,
        
//     },
//     productDescription : {
//         type: String,
//         required : true,
//         maxLength:300

//     },
//     productImage: {
//         type: String,
//         required : true,
//     },
//     createdAt:{
//         type:Date,
//         required:true,
//         default: Date.now()
//     }    
        

// })

// const Product= mongoose.model('product', ProductSchema)
// module.exports = Product;


// Importing mongoose package
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creating a schema
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
    maxLength: 700,
  },
  productImage: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Creating a model
const Product = mongoose.model("products", productSchema);

// Exporting the model
module.exports = Product;