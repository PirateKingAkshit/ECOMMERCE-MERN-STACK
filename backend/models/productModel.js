const mongoose = require("mongoose");
const Category = require("./categoryModel");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  image: {
    type: String,
  },
  brand: {
    type: String,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
