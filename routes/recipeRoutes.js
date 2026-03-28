//get the required stuff to run this
const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const Recipe = require("../models/Recipe");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/recipe/create",
  authMiddleware.isAuthenticated, // ✅ REQUIRED
  recipeController.createRecipes,
);
//Read route(so we can display later)
router.get("/", recipeController.getRecipes);

//router.get("/:id", recipeController.getRecipeById);
//above router.get can be good to show just 1  recipe
//basically a detailed page about that recipe

//create
//doing this because i dont have a seperate function in controller to do this
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

//Update this one has param so we put param placeholder
router.get(
  "/edit/:id",
  authMiddleware.isAuthenticated,
  recipeController.showEditForm,
);

router.post(
  "/edit/:id",
  authMiddleware.isAuthenticated,
  recipeController.updateRecipes,
);
//delete, since eveyrhting is happpening in the recipe file
//no need to get anything for this part
router.post(
  "/delete/:id",
  authMiddleware.isAuthenticated,
  recipeController.deleteRecipes,
);

router.post("/view", async (req, res) => {
  try {
    const recipeId = req.body.recipeId;

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.send("Recipe not found.");
    }
    res.render("recipe-details", { recipe });
  } catch (error) {
    console.error(error);
    res.send("Error loading recipe.");
  }
});

router.get("/view/:id", recipeController.getRecipeById);

module.exports = router;
