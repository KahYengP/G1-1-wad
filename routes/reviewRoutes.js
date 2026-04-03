// routes/reviewRoutes.js

const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware"); 

// Show write review form
router.get(
  "/add",
  authMiddleware.isAuthenticated,
  reviewController.showAddForm,
);

// Submit review
router.post(
  "/add",
  authMiddleware.isAuthenticated,
  reviewController.createReview,
);

// Edit review
router.get(
  "/edit",
  authMiddleware.isAuthenticated,
  reviewController.showEditReview,
);
router.post(
  "/edit",
  authMiddleware.isAuthenticated,
  reviewController.updateReview,
);

// Delete review

router.get(
  "/delete",
  authMiddleware.isAuthenticated,
  reviewController.deleteReview,
);

router.post(
  "/delete",
  authMiddleware.isAuthenticated,
  reviewController.deleteReview,
);

module.exports = router;
