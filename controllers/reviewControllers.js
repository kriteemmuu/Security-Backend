const Review = require("../models/ReviewModel");

// Get reviews for a product
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId });
    res.status(200).json({ reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

// Submit a review for a product
exports.submitReview = async (req, res) => {
  try {
    const { productId, rating, review, userName } = req.body;
    const newReview = new Review({
      userName,
      productId,
      userId: req.user.id,
      rating,
      review,
    });
    const savedReview = await newReview.save();
    res.status(201).json({ review: savedReview });
  } catch (error) {
    res.status(500).json({ message: "Error submitting review", error });
  }
};
