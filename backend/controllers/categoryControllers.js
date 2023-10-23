const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const Category = require("../models/categoryModel");

// Joi Schema for category creation
const categorySchema = Joi.object({
  name: Joi.string().empty("").required().messages({
    "any.required": "Name is required",
  }),
  description: Joi.string().empty("").required().messages({
    "any.required": "Description is required",
  }),
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Protected
const createCategory = asyncHandler(async (req, res) => {
  let { error, value } = categorySchema.validate(req.body, {
    abortEarly: false,
  }); // It will show all errors at once

  if (error) {
    error = error.details.map((err) => err.message);
    console.log(error);
    return res.status(400).json({ error });
  }

  const { name, description } = value;

  const category = await Category.create({
    name,
    description,
  });

  res.status(201).json(category);
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Protected
const updateCategory = asyncHandler(async (req, res) => {
  let { error, value } = categorySchema.validate(req.body, {
    abortEarly: false,
  }); // It will show all errors at once

  if (error) {
    error = error.details.map((err) => err.message);
    console.log(error);
    return res.status(400).json({ error });
  }

  const { name, description } = value;

  const category = await Category.findByIdAndUpdate(req.params.id,{name,description},{new:true})

  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ error: "Category not found" });
      }
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    const count = await Category.countDocuments();
  res.json({count,categories});
});

// @desc    Get a single category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ error: "Category not found" });
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Protected
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (category) {
    res.json({ message: "Category removed" });
  } else {
    res.status(404).json({ error: "Category not found" });
  }
});


module.exports = {
  createCategory,
  updateCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
};
