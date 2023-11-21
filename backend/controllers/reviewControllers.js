const asyncHandler = require("express-async-handler");
const Review = require("../models/reviewModel");
const Product = require("../models/productModel");


// @desc    Create a review
// @route   POST /api/review
// @access  Protected 
const createReview = asyncHandler(async (req, res) => {
    const { productId, review, rating } = req.body;
    

    if (!productId || !review || !rating) {
      return res
        .status(400)
        .json({ message: "Missing required fields" });
    }

    const reviewExist = await Review.findOne({
      user: req.user._id,
      product: productId,
    })

    if (reviewExist) {
        const result = await Review.findOneAndUpdate(
          {
            user: req.user._id,
            product: productId,
          },
          {
            $set: {
              review,
              rating,
            },
          },
          { new: true }
        )
          .populate("user")
          .populate("product");
        return res.status(201).json({ result })
    }

    const result = await Review.create({
        user: req.user._id,
        product: productId,
        review,
        rating
    }).populate("user").populate("product")

    

    res.status(201).json({ result });
    
})


const fetchReview = asyncHandler(async (req, res) => {

  const  productId  = req.params.id;

  const result = await Review.find({product:productId}).populate("user").populate("product")
  
  let totalRating = 0;

  result.forEach(review => {
    totalRating += review.rating;
  })

  const averageRating = totalRating / result.length;
  const noOfReviews = result.length;


  res.status(201).json({ averageRating, noOfReviews, result });

})

const fetchReviewForParticularUser = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    
    const userId = req.user._id;
    

    const reviews = await Review.find({ product: productId })
      .populate("user")
      .populate("product");

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    let totalRating = 0;

    reviews.forEach((review) => {
      totalRating += review.rating;
    });

    const userReview = reviews.find(
      (r) => r.user._id.toString() === userId.toString()
    ).review;
    const userRating = reviews.find(
      (r) => r.user._id.toString() === userId.toString()
    ).rating;

    

    const averageRating = totalRating / reviews.length;
    const noOfReviews = reviews.length;

    res.status(200).json({ averageRating, noOfReviews, userReview,userRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

  

module.exports = { createReview, fetchReview, fetchReviewForParticularUser };
