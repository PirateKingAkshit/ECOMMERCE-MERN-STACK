const express = require("express");
const router = express.Router();
const {
  createCategory,
  updateCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
} = require("../controllers/categoryControllers");
const authenticateUser = require("../middlewares/authenticateUser");
const authenticateAdmin = require("../middlewares/authenticateAdmin");

// @route   POST /api/categories
// @desc    Create a new category
// @access  Protected
router.post("/",authenticateUser,authenticateAdmin,createCategory);

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Protected
router.put("/:id", authenticateUser, authenticateAdmin, updateCategory);

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get("/", getCategories);

// @route   GET /api/categories/:id
// @desc    Get a single category by ID
// @access  Public
router.get("/:id", getCategoryById);

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Protected
router.delete("/:id", authenticateUser, authenticateAdmin, deleteCategory);

module.exports = router;

