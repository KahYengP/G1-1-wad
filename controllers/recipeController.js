const Recipe = require("../models/Recipe");
const Review = require("../models/Review");
const Category = require("../models/Category");
const mongoose = require("mongoose");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
exports.upload = upload;

//ill do it in the format of read, create,update, delete see? rcud not crud

//get recipes and render it into the recipe ejs use foreach later
//read
exports.getRecipes = async (req, res) => {
  try {
    const categoryId = req.query.category;
    const searchQuery = req.query.search || "";
    const bookmarkError = req.query.bookmarkError || null;
    let filter = {};

    if (categoryId) {
      filter.category = categoryId; // convert string -> ObjectId
    }

    if (searchQuery) {
      filter.title = { $regex: searchQuery, $options: "i" };
    }

    const recipes = await Recipe.find(filter).populate("category");
    const CategoryList = await Category.find();
    console.log("Filter:", filter);

    const reviewCounts = {};
    for (const recipe of recipes) {
      const count = await Review.countByRecipeId(recipe._id);
      reviewCounts[recipe._id.toString()] = count;
    }

    return res.render("recipe", {
      recipes: recipes,
      user: req.user || null,
      CategoryList,
      categoryId,
      searchQuery,
      bookmarkError: bookmarkError,
      reviewCounts
    });
  } catch (error) {
    console.log(error);
    return res.send("Error in loading recipes. Please try again.");
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("category");
    if (!recipe) return res.send("Recipe not found.");

    const reviews = await Review.findByRecipeId(req.params.id);

    res.render("recipe-details", {
      recipe,
      reviews,
      user: req.user || null,
    });
  } catch (error) {
    console.error("getRecipeById error:", error);
    res.send("Error loading recipe: " + error.message);
  }
};

exports.showAddform = async (req, res) => {
  try {
    const CategoryList = await Category.find();
    return res.render("add-recipe", { CategoryList });
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
    const image = req.file
      ? "/images/" + req.file.filename
      : "/images/default.jpg";

    const data = {
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      createdBy: createdBy,
      createdByUsername: req.user.username,
      category: req.body.category,
      image: image,
    };

    //okay this part creates a new recipe to be added
    //new recipes will have just the default image
    await Recipe.create(data);

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
    const CategoryList = await Category.find();

    if (!recipe) {
      return res.send("Recipe not found");
    }

    //  pass recipe to EJS
    return res.render("edit-recipe", {
      recipe,
      CategoryList,
      user: req.user || null,
    });
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
    if (req.user.role !== "admin" && recipe.createdBy !== req.user.email) {
      return res.send("Not allowed");
    }

    //take data from add recipe
    const title = req.body.title;
    const ingredients = req.body.ingredients;
    const instructions = req.body.instructions;
    const category = req.body.category;
    const image = req.file ? "/images/" + req.file.filename : recipe.image;

    // declare data properly
    const data = {
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      category: category,
      image: image,
    };

    //update using mongoose funciton
    await Recipe.findByIdAndUpdate(id, data);

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
    if (req.user.role !== "admin" && recipe.createdBy !== req.user.email) {
      return res.send("Not allowed");
    }

    await Recipe.findByIdAndDelete(id);

    // redirects right back to recipe to see changes
    return res.redirect("/recipe");
  } catch (error) {
    return res.send("You got an error deleting this recipe");
  }
};
