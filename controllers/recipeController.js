const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");

//ill do it in the format of read, create,update, delete see? rcud not crud

//get recipes and render it into the recipe ejs use foreach later
//read
exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.getAll();
    return res.render("recipe", { recipes: recipes });
  } catch (error) {
    console.log(error);
    return res.send("Error in loading recipes. Please try again.");
  }
};

exports.showAddform = (req, res) => {
  try {
    return res.render("add-recipe");
  } catch (error) {
    return res.send("Error in add form");
  }
};

//create
exports.createRecipes = async (req, res) => {
  try {
    const title = req.body.title;
    const ingredients = req.body.ingredients;
    const instructions = req.body.instructions;
    //
    const createdBy = req.user.email;
    
    const data = {
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      createdBy: createdBy,
    };

    //okay this part creates a new recipe to be added
    //new recipes will have just the default image
    await Recipe.createRecipe(data);

    //
    return res.redirect("/recipe");
  } catch (error) {
    console.log(error);
    return res.send("Error creating recipe. Please try again.");
  }
};

// Edit form, we will populate it with the preexisting data
//make sure that the recipe can be found
//then render the edit-recipe page
exports.showEditForm = async (req, res) => {
  try {
    // fetch recipe so form can be pre-filled
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.send("Recipe not found");
    }

    //  pass recipe to EJS
    return res.render("edit-recipe", { recipe });
  } catch (error) {
    return res.send("There has been an error rendering edit recipe ");
  }
};

//update
exports.updateRecipes = async (req, res) => {
  try {
    //I'll be using params instead of query, because i plan to use /:id not ?id= etc
    const id = req.params.id;

    // check if its a valid MongoDB ID (prevents crash)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.send("Invalid ID");
    }

    //maybe i should make a new recipe
    //check the recipe id first
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.send("No ID has been found");
    }

    //check ownership(havent learn authentication so ill move on )
    // placeholder()
    if (recipe.createdBy !== req.user.email) {
      return res.send("Not allowed");
    }

    //take data from add recipe
    const title = req.body.title;
    const ingredients = req.body.ingredients;
    const instructions = req.body.instructions;
    const image = req.body.image || "/images/default.jpg";

    // declare data properly
    const data = {
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      image: image,
    };

    //update using mongoose funciton
    await Recipe.updateById(id, data);

    //redirect back to recipe in order to check if the change has been made
    return res.redirect("/recipe");
  } catch (error) {
    //placeholder before i res.render("error") if we still doing that
    return res.send("You've got an error updating this recipe");
  }
};

//delete
exports.deleteRecipes = async (req, res) => {
  try {
    const id = req.params.id;

    //  must use await + correct function name
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.send("Invalid ID");
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.send("No ID has been found");
    }

    //authenticaiton placeholder
    if (recipe.createdBy !== req.user.email) {
      return res.send("Not allowed");
    }

    await Recipe.deleteById(id);

    // redirects right back to recipe to see changes
    return res.redirect("/recipe");
  } catch (error) {
    return res.send("You got an error deleting this recipe");
  }
};
