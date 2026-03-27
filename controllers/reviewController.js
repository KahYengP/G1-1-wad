// controllers/reviewController.js

const Review = require("../models/Review");
const Recipe = require("../models/Recipe");
const User = require("../models/User");
const mongoose = require("mongoose");

// --------------------
// GET /recipe/:id
// Show recipe details + all its reviews
// --------------------
exports.showRecipeDetails = async (req, res) => {
  try {
    const recipeId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.send("Invalid recipe ID.");
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.send("Recipe not found.");
    }

    const reviews = await Review.findByRecipeId(recipeId);

    // Pass the current user's ID (as string) so EJS can show Edit/Delete
    // on the user's own reviews only
    const currentUserId = req.session.userId
      ? req.session.userId.toString()
      : null;

    return res.render("recipe-details", {
      recipe,
      reviews,
      currentUserId,
    });
  } catch (error) {
    console.error(error);
    return res.send("Error loading recipe details.");
  }
};

// --------------------
// GET /review/add/:recipeId
// Show the add review form
// --------------------
exports.showAddReview = async (req, res) => {
  try {
    const recipeId = req.params.recipeId;

    // Must be logged in
    if (!req.session.userId) {
      return res.redirect("/login");
    }

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.send("Invalid recipe ID.");
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.send("Recipe not found.");
    }

    return res.render("add-review", {
      recipe,
      errors: [],
    });
  } catch (error) {
    console.error(error);
    return res.send("Error loading review form.");
  }
};

// --------------------
// POST /review/add/:recipeId
// Save a new review
// --------------------
exports.createReview = async (req, res) => {
  try {
    const recipeId = req.params.recipeId;

    // Must be logged in
    if (!req.session.userId) {
      return res.redirect("/login");
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.send("Recipe not found.");
    }

    const rating = Number(req.body.rating);
    const content = (req.body.content ?? "").trim();
    const errors = [];

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      errors.push("Please select a rating between 1 and 5.");
    }
    if (!content) {
      errors.push("Review content cannot be empty.");
    }

    if (errors.length > 0) {
      return res.render("add-review", { recipe, errors });
    }

    // Fetch the username to store alongside the review
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect("/login");
    }

    await Review.createReview({
      recipeId: recipeId,
      userId: req.session.userId,
      username: user.username,
      rating: rating,
      content: content,
    });

    return res.redirect("/recipe/" + recipeId);
  } catch (error) {
    console.error(error);
    return res.send("Error submitting review.");
  }
};

// --------------------
// GET /review/edit/:reviewId
// Show the edit review form, pre-filled with existing data
// --------------------
exports.showEditReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    if (!req.session.userId) {
      return res.redirect("/login");
    }

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.send("Invalid review ID.");
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.send("Review not found.");
    }

    // Only the owner can edit
    if (review.userId.toString() !== req.session.userId.toString()) {
      return res.send("Not allowed.");
    }

    const recipe = await Recipe.findById(review.recipeId);

    return res.render("edit-review", {
      review,
      recipe,
      errors: [],
    });
  } catch (error) {
    console.error(error);
    return res.send("Error loading edit form.");
  }
};

// --------------------
// POST /review/edit/:reviewId
// Update an existing review
// --------------------
exports.updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    if (!req.session.userId) {
      return res.redirect("/login");
    }

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.send("Invalid review ID.");
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.send("Review not found.");
    }

    // Only the owner can update
    if (review.userId.toString() !== req.session.userId.toString()) {
      return res.send("Not allowed.");
    }

    const rating = Number(req.body.rating);
    const content = (req.body.content ?? "").trim();
    const errors = [];

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      errors.push("Please select a rating between 1 and 5.");
    }
    if (!content) {
      errors.push("Review content cannot be empty.");
    }

    if (errors.length > 0) {
      const recipe = await Recipe.findById(review.recipeId);
      return res.render("edit-review", { review, recipe, errors });
    }

    await Review.updateById(reviewId, { rating, content });

    return res.redirect("/recipe/" + review.recipeId);
  } catch (error) {
    console.error(error);
    return res.send("Error updating review.");
  }
};

// --------------------
// POST /review/delete/:reviewId
// Delete a review
// --------------------
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    if (!req.session.userId) {
      return res.redirect("/login");
    }

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.send("Invalid review ID.");
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.send("Review not found.");
    }

    // Only the owner can delete
    if (review.userId.toString() !== req.session.userId.toString()) {
      return res.send("Not allowed.");
    }

    const recipeId = review.recipeId;
    await Review.deleteById(reviewId);

    return res.redirect("/recipe/" + recipeId);
  } catch (error) {
    console.error(error);
    return res.send("Error deleting review.");
  }
};
