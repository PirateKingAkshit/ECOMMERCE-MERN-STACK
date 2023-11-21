const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
var nodemailer = require("nodemailer");
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
    isAdmin: user.isAdmin,
    phoneNumber: user.phoneNumber,
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
    isAdmin: user.isAdmin,
    phoneNumber: user.phoneNumber,
    token,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { phoneNumber, address } = req.body;
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader.split(" ")[1];

  const user = await User.findByIdAndUpdate({_id:req.user._id}, {
    phoneNumber,address
  }, { new: true })


  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    address: user.address,
    isAdmin: user.isAdmin,
    phoneNumber: user.phoneNumber,
    token,
  });

})

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found ! ! !" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.APPLICATION_SPECIFIC_PASSWORD}`,
      },
    });

    var mailOptions = {
      from: `${process.env.EMAIL}`,
      to: `${user.email}`,
      subject: "Reset Your Password",
      text: `http://localhost:3000/reset-password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending reset link" });
      } else {
        return res
          .status(200)
          .json({ message: "Reset link sent to your mail" });
      }
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const resetPasswordController = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  
  let verify;
try {
  verify = jwt.verify(token, process.env.JWT_SECRET);
} catch (error) {
  return res.status(404).json({ message: "Error with token" });
}

    const hashPassword=await bcrypt.hash(password, 10)
    await User.findByIdAndUpdate({ _id: id }, { password: hashPassword }, { new: true });
    res.status(200).json({ message: "Password Updated" });
  
}


module.exports = { registerUser, loginUser, updateUser,forgotPasswordController,resetPasswordController };
