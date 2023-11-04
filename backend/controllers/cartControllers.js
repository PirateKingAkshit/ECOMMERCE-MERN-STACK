const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const Cart = require("../models/cartModel");

const cartItemSchema = Joi.object({
  product: Joi.string().required().messages({
    "any.required": "Product ID is required",
  }),
  quantity: Joi.number().integer().positive().default(1).messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.positive": "Quantity must be positive",
    "any.required": "Quantity is required",
  }),
});

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Protected
const getCart = asyncHandler(async (req, res) => {
  const user = req.user._id;

  const cart = await Cart.findOne({ user }).populate({
    path: "user",
    select:"name email address phoneNumber "
  }).populate({
    path: "items.product",
    populate: {
      path: "category",
    }
  })

  res.json(cart);
});


// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Protected
const addToCart = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const { error, value } = cartItemSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({ error });
  }

  const { product,quantity } = value;

  let cart = await Cart.findOne({ user })
    .populate({
      path: "items.product",
      populate: {
        path: "category",
        model: "Category",
      },
    })
    .populate("user");

  if (!cart) {
    cart = await Cart.create({ user, items: [{ product, quantity }] });
  } else {
    const item = cart.items.find((item) => item.product.equals(product));

    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ product, quantity });
    }

    await cart.save();
  }

  res.json(cart);
});


// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Protected
const removeFromCart = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const productId = req.params.productId;

  let cart = await Cart.findOne({ user });

  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }

  cart.items = cart.items.filter((item) => !item.product.equals(productId));
  await cart.save();

  res.json(cart);
});


// @desc    Update entire cart for a user
// @route   PUT /api/cart/update
// @access  Protected
const updateCartForUser = asyncHandler(async (req, res) => {
  // console.log(req.user)
  const userId = req.user._id;
  const { items } = req.body;
 

  try {
    let cart = await Cart.findOneAndUpdate(
      { user: userId },
      { items:items },
      { new: true }
    ).populate("items.product");

    res.json(cart);
  } catch (error) {
    // console.log(error)
    res.status(500).json({ error });
  }
});



module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartForUser
};
