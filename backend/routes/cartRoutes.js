// Assuming you're using Express for your server
const express = require("express");
const router = express.Router();
const authenticateUser=require("../middlewares/authenticateUser")
const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
} = require("../controllers/cartControllers");

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Protected
router.get("/",authenticateUser,getCart);

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Protected
router.post("/add",authenticateUser, addToCart);

// @desc    Update item quantity in cart
// @route   PUT /api/cart/update
// @access  Protected
router.put("/update", updateCart);

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Protected
router.delete("/remove/:productId", removeFromCart);

module.exports = router;
