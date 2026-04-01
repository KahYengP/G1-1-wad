const Review = require("../models/Review");
const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");

exports.showAddForm = async (req, res) => {
  try {
    const recipeId = req.query.recipeId;
    return res.render("add-review", { recipeId, user: req.user || null });
  } catch (error) {
    return res.send("Error loading review form.");
  }
};

exports.createReview = async (req, res) => {
  try {
    const recipeId = req.body.recipeId;

    if (!req.user) return res.redirect("/login");

    const recipe = await Recipe.findByIdRecipe(recipeId);
    if (!recipe) return res.send("Recipe not found.");

    const rating = Number(req.body.rating);
    let content = req.body.content || "";
    content = content.trim();

    const errors = [];
    if (!rating || rating < 1 || rating > 5)
      errors.push("Please select a rating between 1 and 5.");
    if (!content) errors.push("Review content cannot be empty.");

    if (errors.length > 0) {
      return res.render("add-review", {
        recipeId,
        errors,
        user: req.user || null,
      });
    }

    await Review.createReview({
      recipeId,
      userId: req.user._id,
      username: req.user.username,
      rating,
      content,
    });

    return res.redirect("/recipe/view?id=" + recipeId);
  } catch (error) {
    console.error(error);
    return res.send("Error submitting review.");
  }
};

exports.showEditReview = async (req, res) => {
  try {
    const reviewId = req.query.reviewId;
    if (!req.user) return res.redirect("/login");
    if (!mongoose.Types.ObjectId.isValid(reviewId))
      return res.send("Invalid review ID.");

    const review = await Review.findByIdReview(reviewId);
    if (!review) return res.send("Review not found.");

    if (review.userId.toString() !== req.user._id.toString())
      return res.send("Not allowed.");

    const recipe = await Recipe.findByIdRecipe(review.recipeId);
    return res.render("edit-review", {
      review,
      recipe,
      errors: [],
      user: req.user || null,
    });
  } catch (error) {
    console.error(error);
    return res.send("Error loading edit form.");
  }
};

exports.updateReview = async (req, res) => {
  try {
    const reviewId = req.body.reviewId;
    if (!req.user) return res.redirect("/login");
    if (!mongoose.Types.ObjectId.isValid(reviewId))
      return res.send("Invalid review ID.");

    const review = await Review.findByIdReview(reviewId);
    if (!review) return res.send("Review not found.");

    if (review.userId.toString() !== req.user._id.toString())
      return res.send("Not allowed.");

    const rating = Number(req.body.rating);
    let content = req.body.content || "";
    content = content.trim();

    const errors = [];
    if (!rating || rating < 1 || rating > 5)
      errors.push("Please select a rating between 1 and 5.");
    if (!content) errors.push("Review content cannot be empty.");

    if (errors.length > 0) {
      const recipe = await Recipe.findByIdRecipe(review.recipeId);
      return res.render("edit-review", {
        review,
        recipe,
        errors,
        user: req.user || null,
      });
    }

    await Review.updateById(reviewId, {
      rating,
      content,
      updatedAt: new Date(),
    });
    return res.redirect("/recipe/view?id=" + review.recipeId);
  } catch (error) {
    console.error(error);
    return res.send("Error updating review.");
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.query.reviewId;
    if (!req.user) return res.redirect("/login");
    if (!mongoose.Types.ObjectId.isValid(reviewId))
      return res.send("Invalid review ID.");

    const review = await Review.findByIdReview(reviewId);
    if (!review) return res.send("Review not found.");

    if (review.userId.toString() !== req.user._id.toString())
      return res.send("Not allowed.");

    const recipeId = review.recipeId;

    await Review.deleteById(reviewId);
    return res.redirect("/recipe/view?id=" + recipeId);
  } catch (error) {
    console.error(error);
    return res.send("Error deleting review.");
  }
};
