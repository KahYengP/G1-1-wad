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
  username: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

const Review = mongoose.model("Review", reviewSchema);

Review.findByRecipeId = function(recipeId) {
  return Review.find({ recipeId: recipeId }).sort({ createdAt: -1 });
};

Review.findByIdReview = function(id) {
  return Review.findById(id);
};

Review.createReview = function(data) {
  return Review.create(data);
};

Review.updateById = function(id, data) {
  return Review.findByIdAndUpdate(id, data, { new: true });
};

Review.deleteById = function(id) {
  return Review.findByIdAndDelete(id);
};

Review.countByRecipeId = function(recipeId) {
  return Review.countDocuments({ recipeId: recipeId });
};

module.exports = Review;