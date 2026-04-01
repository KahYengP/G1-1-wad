const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware.setUser, recipeController.getRecipes);

router.get(
  "/add",
  authMiddleware.isAuthenticated,
  recipeController.showAddform,
);
router.post(
  "/add",
  authMiddleware.isAuthenticated,
  recipeController.createRecipes,
);

router.get(
  "/edit",
  authMiddleware.isAuthenticated,
  recipeController.showEditForm,
);
router.post(
  "/edit",
  authMiddleware.isAuthenticated,
  recipeController.updateRecipes,
);
router.post(
  "/delete",
  authMiddleware.isAuthenticated,
  recipeController.deleteRecipes,
);
router.get("/view", authMiddleware.setUser, recipeController.getRecipeById);

module.exports = router;
