const Collection = require("../models/Collections");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");

// Helper: get user by session ID
async function getLoggedInUser(req) {
  if (!req.session.userId) return null;
  return await User.findById(req.session.userId);
}

// READ collections
exports.getCollections = async (req, res) => {
  try {
    const user = await getLoggedInUser(req);
    if (!user) return res.redirect("/login");

    const collections = await Collection.find({ createdBy: user.email }).populate("recipes");
    return res.render("collections", { collections });
  } catch (error) {
    console.error(error);
    return res.send("Error loading collections. Please try again.");
  }
};

// Show add form
exports.showAddForm = async (req, res) => {
  const user = await getLoggedInUser(req);
  if (!user) return res.redirect("/login");

  return res.render("add-collection");
};

// CREATE collection
exports.createCollection = async (req, res) => {
  try {
    const user = await getLoggedInUser(req);
    if (!user){ 
        return res.redirect("/login")};

    const { name, description } = req.body;
    if (!name || name.trim() === "") {
      return res.send("Collection name is required");
    }

    const data = {
      name: name.trim(),
      description: description?.trim(),
      createdBy: user.email,
      recipes: []
    };

    await Collection.createCollection(data);
    return res.redirect("/collections");
  } catch (error) {
    console.error(error);
    return res.send("Error creating collection. Please try again.");
  }
};

// Show edit form
exports.showEditForm = async (req, res) => {
  const user = await getLoggedInUser(req);
  if (!user) return res.redirect("/login");

  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.send("Collection not found");

    return res.render("edit-collection", { collection });
  } catch (error) {
    return res.send("Error loading edit collection page");
  }
};

// UPDATE collection
exports.updateCollection = async (req, res) => {
  const user = await getLoggedInUser(req);
  if (!user) return res.redirect("/login");

  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.send("Invalid ID");

    const collection = await Collection.findById(id);
    if (!collection) return res.send("Collection not found");
    if (collection.createdBy !== user.email) return res.send("Not allowed");

    const { name, description } = req.body;
    await Collection.updateById(id, { name, description });

    return res.redirect("/collections");
  } catch (error) {
    return res.send("Error updating collection");
  }
};

// DELETE collection
exports.deleteCollection = async (req, res) => {
  const user = await getLoggedInUser(req);
  if (!user) return res.redirect("/login");

  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.send("Invalid ID");

    const collection = await Collection.findById(id);
    if (!collection) return res.send("Collection not found");
    if (collection.createdBy !== user.email) return res.send("Not allowed");

    await Collection.deleteById(id);
    return res.redirect("/collections");
  } catch (error) {
    return res.send("Error deleting collection");
  }
};

// ADD recipe
exports.addRecipe = async (req, res) => {
  const user = await getLoggedInUser(req);
  if (!user) return res.redirect("/login");

  try {
    const { collectionId, recipetitle } = req.body;

    const collection = await Collection.findById(collectionId);
    if (!collection) return res.send("Collection not found");
    if (collection.createdBy !== user.email) return res.send("Not allowed");

    // Create new recipe
    const newRecipe = await Recipe.createRecipe({
      title: recipetitle,
      ingredients: "To be added",
      instructions: "To be added",
      createdBy: user.email
    });

    // Add recipe to collection
    collection.recipes.push(newRecipe._id);
    await collection.save();

    return res.redirect("/collections");
  } catch (error) {
    console.error(error);
    return res.send("Error adding recipe to collection");
  }
};

// REMOVE recipe
exports.removeRecipe = async (req, res) => {
  const user = await getLoggedInUser(req);
  if (!user) return res.redirect("/login");

  try {
    const { collectionId, recipeId } = req.body;
    console.log("Removing recipe:", recipeId, "from collection:", collectionId);

    const collection = await Collection.findById(collectionId);
    if (!collection) return res.send("Collection not found");
    if (collection.createdBy !== user.email) return res.send("Not allowed");

   
    await Collection.updateOne(
      { _id: collectionId },
      { $pull: { recipes: recipeId } }
    );

    return res.redirect("/collections");
  } catch (error) {
    console.error("Error in removeRecipe:", error);
    return res.send("Error removing recipe");
  }
};