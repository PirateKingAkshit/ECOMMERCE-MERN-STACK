const express = require("express");
const router = express.Router();
const { registerUser, loginUser,updateUser,forgotPasswordController,resetPasswordController } = require("../controllers/userControllers");
const authenticateUser = require("../middlewares/authenticateUser")

// @desc Route for user registration
// @route POST /api/user/register
// @access Public
router.post("/register",registerUser);

// @desc Route for user login
// @route POST /api/user/login
// @access Public
router.post("/login", loginUser);

// @desc Route for update user
// @route POST /api/user/update
// @access protected
router.put("/update", authenticateUser, updateUser)

//forgot-password
router.post("/forgot-password", forgotPasswordController);

//reset-password
router.post("/reset-password/:id/:token",resetPasswordController)

module.exports = router;
