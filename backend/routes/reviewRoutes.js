const express = require("express")
const {
  createReview,
  fetchReview,
  fetchReviewForParticularUser,
} = require("../controllers/reviewControllers");
const authenticateUser = require("../middlewares/authenticateUser");

const router = express.Router();

// @desc    Create a review
// @route   POST /api/review
// @access  Protected 
router.post("/", authenticateUser, createReview)


// @desc    Create a review
// @route   GET /api/review
// @access  Public
router.get("/:id", fetchReview);

// @desc    Create a review
// @route   GET /api/review
// @access  Public
router.get("/user/:id", authenticateUser, fetchReviewForParticularUser);

module.exports=router
