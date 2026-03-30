// routes/reviewRoutes.js

const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ was missing

// Show write review form
router.get(
  "/add/:recipeId",
  authMiddleware.isAuthenticated,
  reviewController.showAddForm,
);

// Submit review
router.post(
  "/add/:recipeId",
  authMiddleware.isAuthenticated,
  reviewController.createReview,
);

// Edit review
router.get(
  "/edit/:reviewId",
  authMiddleware.isAuthenticated,
  reviewController.showEditReview,
);
router.post(
  "/edit/:reviewId",
  authMiddleware.isAuthenticated,
  reviewController.updateReview,
);

// Delete review

router.get(
  "/delete/:reviewId",
  authMiddleware.isAuthenticated,
  reviewController.deleteReview,
);


router.post(
  "/delete/:reviewId",
  authMiddleware.isAuthenticated,
  reviewController.deleteReview,
);

module.exports = router;
