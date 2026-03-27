// routes/reviewRoutes.js

const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");

// Recipe details page (also shows reviews)
// NOTE: This must be registered AFTER /recipe/add and /recipe/edit/:id
// in server.js to avoid /:id catching those routes first
router.get("/recipe/:id", reviewController.showRecipeDetails);

// Add review
router.get("/review/add/:recipeId", reviewController.showAddReview);
router.post("/review/add/:recipeId", reviewController.createReview);

// Edit review
router.get("/review/edit/:reviewId", reviewController.showEditReview);
router.post("/review/edit/:reviewId", reviewController.updateReview);

// Delete review
router.post("/review/delete/:reviewId", reviewController.deleteReview);

module.exports = router;
