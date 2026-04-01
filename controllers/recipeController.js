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

exports.getRecipes = async (req, res) => {
  try {
    const categoryId = req.query.category;
    const searchQuery = req.query.search || "";
    const bookmarkError = req.query.bookmarkError || null;
    let filter = {};

    if (categoryId) filter.category = categoryId;
    if (searchQuery) filter.title = { $regex: searchQuery, $options: "i" };

    const recipes = await Recipe.searchRecipes(filter);
    const CategoryList = await Category.getAll();

    const reviewCounts = {};
    for (const recipe of recipes) {
      const count = await Review.countByRecipeId(recipe._id);
      reviewCounts[recipe._id.toString()] = count;
    }

    return res.render("recipe", {
      recipes,
      user: req.user || null,
      CategoryList,
      categoryId,
      searchQuery,
      bookmarkError,
      reviewCounts,
    });
  } catch (error) {
    console.log(error);
    return res.send("Error in loading recipes. Please try again.");
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdWithCategory(req.params.id);
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
    const CategoryList = await Category.getAll();
    return res.render("add-recipe", { CategoryList, user: req.user || null });
  } catch (error) {
    return res.send("Error in add form");
  }
};

exports.createRecipes = async (req, res) => {
  try {
    const image = req.file ? "/images/" + req.file.filename : "/images/default.jpg";

    const data = {
      title: req.body.title,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      createdBy: req.user.email,
      createdByUsername: req.user.username,
      category: req.body.category,
      image: image,
    };

    await Recipe.createRecipe(data);
    return res.redirect("/recipe");
  } catch (error) {
    console.log(error);
    return res.send("Error creating recipe. Please try again.");
  }
};

exports.showEditForm = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdRecipe(req.params.id);
    const CategoryList = await Category.getAll();

    if (!recipe) return res.send("Recipe not found");

    return res.render("edit-recipe", {
      recipe,
      CategoryList,
      user: req.user || null,
    });
  } catch (error) {
    return res.send("There has been an error rendering edit recipe");
  }
};

exports.updateRecipes = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.send("Invalid ID");

    const recipe = await Recipe.findByIdRecipe(id);
    if (!recipe) return res.send("No ID has been found");

    if (req.user.role !== "admin" && recipe.createdBy !== req.user.email) {
      return res.send("Not allowed");
    }

    const image = req.file ? "/images/" + req.file.filename : recipe.image;

    const data = {
      title: req.body.title,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      category: req.body.category,
      image: image,
    };

    await Recipe.updateById(id, data);
    return res.redirect("/recipe");
  } catch (error) {
    return res.send("You've got an error updating this recipe");
  }
};

exports.deleteRecipes = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.send("Invalid ID");

    const recipe = await Recipe.findByIdRecipe(id);
    if (!recipe) return res.send("No ID has been found");

    if (req.user.role !== "admin" && recipe.createdBy !== req.user.email) {
      return res.send("Not allowed");
    }

    await Recipe.deleteById(id);
    return res.redirect("/recipe");
  } catch (error) {
    return res.send("You got an error deleting this recipe");
  }
};