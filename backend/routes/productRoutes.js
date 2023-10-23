const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} = require("../controllers/productControllers");
const authenticateUser = require("../middlewares/authenticateUser");
const authenticateAdmin = require("../middlewares/authenticateAdmin");

// @desc    Create a new product
// @route   POST /api/products
// @access  Protected
router.post("/",authenticateUser,authenticateAdmin,createProduct);

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get("/", getProducts);

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get("/:id", getProductById);

// @desc   Update a product by id
// @route  PUT /api/products/:id
// @access Protected
router.put("/:id", authenticateUser, authenticateAdmin, updateProduct);

// @desc   Delete a product by id
// @route  DELETE /api/products/:id
// @access Protected
router.delete("/:id", authenticateUser, authenticateAdmin, deleteProduct);

// @desc    Search products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
router.get('/category/:categoryId', getProductsByCategory);

module.exports = router;
