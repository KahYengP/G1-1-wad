const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: String, required: true },
  instructions: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  createdBy: { type: String, required: true },
  createdByUsername: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

Recipe.getAll = function () {
  return Recipe.find().populate("category");
};

Recipe.createRecipe = function (data) {
  return Recipe.create(data);
};

Recipe.findByIdRecipe = function (id) {
  return Recipe.findById(id);
};

Recipe.findByIdWithCategory = function (id) {
  return Recipe.findById(id).populate("category");
};

Recipe.updateById = function (id, data) {
  return Recipe.findByIdAndUpdate(id, data, { new: true });
};

Recipe.deleteById = function (id) {
  return Recipe.findByIdAndDelete(id);
};

Recipe.searchRecipes = function (filter) {
  return Recipe.find(filter).populate("category");
};

module.exports = Recipe;
