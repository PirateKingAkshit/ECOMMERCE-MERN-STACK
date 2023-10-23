const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userControllers");

// @desc Route for user registration
// @route POST /api/user/register
// @access Public
router.post("/register",registerUser);

// @desc Route for user login
// @route POST /api/user/login
// @access Public
router.post("/login",loginUser);

module.exports = router;
