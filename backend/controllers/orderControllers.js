const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product=require("../models/productModel")



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
        
      await updateStockOnOrderItem(item.product._id,item.product.stock,item.quantity)

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
  const userId = req.params.userId;

  try {
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).populate("user").populate("product")
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
})

// @desc    Fetch orders for Admin
// @route   GET /api/orders/admin
// @access  Protected (Assuming authentication is required to fetch orders)
const getAllOrdersForAdmin = asyncHandler(async (req, res) => {
   try {
     const orders = await Order.find().sort({ createdAt: -1 })
       .populate("user")
       .populate("product")
     res.json(orders);
   } catch (error) {
     res.status(500).json({ error: "Internal Server Error" });
   }
})


// @desc    Cancel order for the user
// @route   PUT /api/orders/cancel
// @access  Protected (Assuming authentication is required to fetch orders)
const cancelOrderForUser = asyncHandler(async (req, res) => {
  
  const orderId = req.body.orderId;

  const order = await Order.findByIdAndUpdate(
    { _id: orderId },  
    { status: "Cancelled" },
    { new: true }
  ).populate("user").populate("product")
  // console.log(order.product._id,order.product.stock,order.quantity)
  await updateStockOnOrderCancel(order.product._id,order.product.stock,order.quantity);

  if (order) {
    res.json({order});
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

// @desc    Change order status of the user by admin
// @route   PUT /api/orders/status/change
// @access  Protected (Assuming authentication is required to fetch orders)
const changeOrderStatusByAdmin = asyncHandler(async (req, res) => {
  const { orderId, currentStatus } = req.body;
  console.log(currentStatus)
  const order = await Order.findByIdAndUpdate(
    { _id: orderId },
    { status: currentStatus },
    { new: true }
  );

  if (order) {
    res.json({ order });
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

const updateStockOnOrderItem = async (id, stock, quantity) => {
  try {
    newStock = stock - quantity;
    await Product.findByIdAndUpdate(
      { _id: id },
      { stock: newStock },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};

const updateStockOnOrderCancel = async (id, stock, quantity) => {
  try {
    newStock = stock + quantity;
    await Product.findByIdAndUpdate(
      { _id: id },
      { stock: newStock },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};



module.exports = { createOrder, getOrdersForUser, cancelOrderForUser,getAllOrdersForAdmin,changeOrderStatusByAdmin };



