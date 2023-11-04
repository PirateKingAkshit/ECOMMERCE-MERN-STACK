const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../models/userModel");

// Joi Schema for user registration
const registerSchema = Joi.object({
  name: Joi.string().empty("").required().messages({
    "any.required": "Name is required",
  }),
  email: Joi.string().email().empty("").required().messages({
    "string.email": "Invalid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().empty("").required().messages({
    "any.required": "Password is required",
  }),
  address: Joi.object({
    houseNo: Joi.string().empty("").required().messages({
      "any.required": "House No. is required",
    }),
    city: Joi.string().empty("").required().messages({
      "any.required": "City is required",
    }),
    state: Joi.string().empty("").required().messages({
      "any.required": "State is required",
    }),
    zip: Joi.string().empty("").required().messages({
      "any.required": "ZIP code is required",
    }),
    country: Joi.string().empty("").required().messages({
      "any.required": "Country is required",
    }),
  })
    .required()
    .messages({
      "object.base": "Address is required",
    }),
  phoneNumber: Joi.string().empty("").required().messages({
    "any.required": "Phone number is required",
  }),
  isAdmin: Joi.boolean().default(false),
});

// @desc    Register a new user
// @route   POST /api/user/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  let { error, value } = registerSchema.validate(req.body, {
    abortEarly: false,
  }); //it will show all error at once

  if (error) {
    error = error.details.map((err) => err.message);
    console.log(error);
    return res.status(400).json({ error });
  }

  const { name, email, password, address, phoneNumber, isAdmin } = value;

  const salt = 10;

  const passwordHash = await bcrypt.hash(password, salt); // hashing the password

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "20d",
  });

  const user = await User.create({
    name,
    email,
    password: passwordHash,
    address,
    phoneNumber,
    isAdmin,
  });
  
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    address: user.address,
    token,
  });
});

// Joi Schema for user login
const loginSchema = Joi.object({
  email: Joi.string().email().empty("").required().messages({
    "any.required": "Email is required",
  }),
  password: Joi.string().empty("").required().messages({
    "any.required": "Password is required",
  }),
});

// @desc    Login user
// @route   POST /api/user/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  let { error, value } = loginSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    error = error.details.map((err) => err.message);
    console.log(error);
    return res.status(400).json({ error });
  }

  const { email, password } = value;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid Username/Password !!!" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "20d",
  });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    address: user.address,
    isAdmin:user.isAdmin,
    token,
  });
});

module.exports = { registerUser, loginUser };
