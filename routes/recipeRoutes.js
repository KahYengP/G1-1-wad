//get the required stuff to run this
const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController")

//Read route(so we can display later)
router.get("/",recipeController.getRecipes)

//router.get("/:id", recipeController.getRecipeById);
//above router.get can be good to show just 1  recipe
//basically a detailed page about that recipe

//create 
//doing this because i dont have a seperate function in controller to do this
router.get("/add",recipeController.showAddform);
router.post("/add",recipeController.createRecipes)

//Update this one has param so we put param placeholder
router.get("/edit/:id",recipeController.showEditForm)

router.post("/edit/:id",recipeController.updateRecipes)
//delete, since eveyrhting is happpening in the recipe file
//no need to get anything for this part
router.post("/delete/:id",recipeController.deleteRecipes)