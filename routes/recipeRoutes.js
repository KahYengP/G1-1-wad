//get the required stuff to run this
const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController")


router.get("/", recipeController.getRecipes)
//Read route(so we can display later) then we make sure the id meets 


// remove this uselss
// router.get("/:id", recipeController.getRecipeById);

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
router.get("/:id", async (req, res) => {
    const Recipe = require("../models/Recipe")
    const recipe = await Recipe.findById(req.params.id)

    if (!recipe) return res.send("Recipe not found")

    res.render("recipe-detail", { recipe })
})
module.exports = router