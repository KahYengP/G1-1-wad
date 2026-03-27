const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  username: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("Review", reviewSchema);

// Get all reviews for a specific recipe
exports.findByRecipeId = (recipeId) => {
  return Review.find({ recipeId: recipeId }).sort({ createdAt: -1 });
};

// Find a single review by its ID
exports.findById = (id) => {
  return Review.findById(id);
};

// Create a new review
exports.createReview = (data) => {
  return Review.create(data);
};

// Update a review by ID
exports.updateById = (id, data) => {
  return Review.findByIdAndUpdate(id, data, { new: true });
};

// Delete a review by ID
exports.deleteById = (id) => {
  return Review.findByIdAndDelete(id);
};
