const express = require("express");
const {
  createOrder,
  getOrdersForUser,
  cancelOrderForUser,
} = require("../controllers/orderControllers");
const authenticateUser = require("../middlewares/authenticateUser");

const router = express.Router();

// @desc    Create a new order
// @route   POST /api/orders
// @access  Protected (Assuming authentication is required to create an order)
router.post("/", authenticateUser, createOrder);

// @desc    Fetch orders for a particular user
// @route   GET /api/orders
// @access  Protected (Assuming authentication is required to fetch orders)
router.get("/", authenticateUser, getOrdersForUser);

// @desc    Cancel order for the user
// @route   PUT /api/orders/cancel
// @access  Protected (Assuming authentication is required to fetch orders)
router.put("/cancel", authenticateUser, cancelOrderForUser);

module.exports = router;
