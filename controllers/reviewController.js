// controllers/reviewController.js

const Review = require("../models/Review");
const Recipe = require("../models/Recipe");
const User = require("../models/User");
const mongoose = require("mongoose");

// Show recipe details + all its reviews
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

// Show the add review form
exports.showAddForm = async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    return res.render("add-review", { recipeId });
  } catch (error) {
    return res.send("Error loading review form.");
  }
};

// Create a new review
exports.createReview = async (req, res) => {
  try {
    // Get the recipe ID from the URL
    const recipeId = req.params.recipeId;

    // Check if user is logged in
    if (!req.user) {
      return res.redirect("/login");
    }

    // Check if the recipe actually exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.send("Recipe not found.");
    }

    // Get the rating and convert it from text to a number
    const rating = Number(req.body.rating);

    // Get the review text, use empty string if nothing was typed
    let content = req.body.content;
    if (!content) {
      content = "";
    }
    // remove extra spaces
    content = content.trim();

    // Validate the inputs
    const errors = [];
    if (!rating || rating < 1 || rating > 5) {
      errors.push("Please select a rating between 1 and 5.");
    }
    if (!content) {
      errors.push("Review content cannot be empty.");
    }

    // If there are errors, show the form again with error messages
    if (errors.length > 0) {
      return res.render("add-review", { recipeId, errors });
    }

    // Save the review to the database
    await Review.createReview({
      recipeId: recipeId,
      userId: req.user._id,
      username: req.user.username,
      rating: rating,
      content: content,
    });

    // Go back to the recipe detail page
    return res.redirect("/recipe/view/" + recipeId);
  } catch (error) {
    console.error(error);
    return res.send("Error submitting review.");
  }
};

// Show the edit review form, pre-filled with existing data
exports.showEditReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    if (!req.user) return res.redirect("/login");

    if (!mongoose.Types.ObjectId.isValid(reviewId))
      return res.send("Invalid review ID.");

    const review = await Review.findById(reviewId);
    if (!review) return res.send("Review not found.");

    if (review.userId.toString() !== req.user._id.toString())
      return res.send("Not allowed.");

    const recipe = await Recipe.findById(review.recipeId);
    return res.render("edit-review", { review, recipe, errors: [] });
  } catch (error) {
    console.error(error);
    return res.send("Error loading edit form.");
  }
};

exports.updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    if (!req.user) return res.redirect("/login");

    if (!mongoose.Types.ObjectId.isValid(reviewId))
      return res.send("Invalid review ID.");

    const review = await Review.findById(reviewId);
    if (!review) return res.send("Review not found.");

    if (review.userId.toString() !== req.user._id.toString())
      return res.send("Not allowed.");

    const rating = Number(req.body.rating);
    let content = req.body.content;
    if (!content) content = "";
    content = content.trim();

    const errors = [];
    if (!rating || rating < 1 || rating > 5)
      errors.push("Please select a rating between 1 and 5.");
    if (!content) errors.push("Review content cannot be empty.");

    if (errors.length > 0) {
      const recipe = await Recipe.findById(review.recipeId);
      return res.render("edit-review", { review, recipe, errors });
    }

    await Review.updateById(reviewId, {
      rating,
      content,
      updatedAt: new Date(),
    });
    return res.redirect("/recipe/view/" + review.recipeId);
  } catch (error) {
    console.error(error);
    return res.send("Error updating review.");
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    if (!req.user) return res.redirect("/login");

    if (!mongoose.Types.ObjectId.isValid(reviewId))
      return res.send("Invalid review ID.");

    const review = await Review.findById(reviewId);
    if (!review) return res.send("Review not found.");

    if (review.userId.toString() !== req.user._id.toString())
      return res.send("Not allowed.");

    const recipeId = review.recipeId;
    await Review.deleteById(reviewId);
    return res.redirect("/recipe/view/" + recipeId);
  } catch (error) {
    console.error(error);
    return res.send("Error deleting review.");
  }
};
