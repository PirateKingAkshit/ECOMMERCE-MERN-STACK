const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");



// @desc    Create a new order
// @route   POST /api/orders
// @access  Protected (Assuming authentication is required to create an order)
const createOrder = asyncHandler(async (req, res) => {
  const { user, cart, address } = req.body;

  try {
    const orders = [];

    for (const item of cart) {
      const order = await Order.create({
        user,
        product: item.product._id,
        quantity: item.quantity,
        total: item.quantity * item.product.price,
        address,
      });
        
      orders.push(order);
      }

    res.status(201).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// @desc    Fetch orders for a particular user
// @route   GET /api/orders/user/:userId
// @access  Protected (Assuming authentication is required to fetch orders)
const getOrdersForUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const orders = await Order.find({ user: userId }).populate("user").populate("product")
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// @desc    Cancel order for the user
// @route   PUT /api/orders/cancel
// @access  Protected (Assuming authentication is required to fetch orders)
const cancelOrderForUser = asyncHandler(async (req, res) => {
  
  const orderId = req.body.orderId;

  const order = await Order.findByIdAndUpdate(
    { _id: orderId },  
    { status: "Cancelled" },
    { new: true }
  );

  if (order) {
    res.json({order});
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});


module.exports = { createOrder, getOrdersForUser, cancelOrderForUser };
