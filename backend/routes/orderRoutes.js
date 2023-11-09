const express = require("express");
const {
  createOrder,
  getOrdersForUser,
  cancelOrderForUser,
  getAllOrdersForAdmin,
  changeOrderStatusByAdmin
} = require("../controllers/orderControllers");
const authenticateUser = require("../middlewares/authenticateUser");
const authenticateAdmin=require("../middlewares/authenticateAdmin")

const router = express.Router()

// @desc    Create a new order
// @route   POST /api/orders
// @access  Protected (Assuming authentication is required to create an order)
router.post("/", authenticateUser, createOrder)

// @desc    Fetch orders for a particular user
// @route   GET /api/orders
// @access  Protected (Assuming authentication is required to fetch orders)
router.get("/user/:userId", authenticateUser, getOrdersForUser)

// @desc    Fetch orders for Admin
// @route   GET /api/orders/admin
// @access  Protected (Assuming authentication is required to fetch orders)
router.get("/admin", authenticateUser, authenticateAdmin, getAllOrdersForAdmin)

// @desc    Cancel order for the user
// @route   PUT /api/orders/cancel
// @access  Protected (Assuming authentication is required to fetch orders)
router.put("/cancel", authenticateUser, cancelOrderForUser)

// @desc    Change order status of the user by admin
// @route   PUT /api/orders/status/change
// @access  Protected (Assuming authentication is required to fetch orders)
router.put("/status/change", authenticateUser,authenticateAdmin,changeOrderStatusByAdmin);

module.exports = router;
